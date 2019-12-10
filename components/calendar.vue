<template>
  <div>
    <div v-if="extraInfo.show" class="extraInfo">
      <p>
        <span
          :class="
            `badge badge-pill badge-${
              extraInfo.task.priority == 'low'
                ? 'success'
                : extraInfo.task.priority == 'medium'
                ? 'warning'
                : 'danger'
            }`
          "
          >{{ extraInfo.task.priority }}</span
        >
        <span class="list"
          >{{
            `${extraInfo.task.listName.substr(0, 35)} ${
              extraInfo.task.listName.length > 35 ? "..." : ""
            }`
          }}:
        </span>
        <span>{{
          `${extraInfo.task.description.substr(0, 45)} ${
            extraInfo.task.description.length > 45 ? "..." : ""
          }`
        }}</span>
        <span class="hours"
          >{{ extraInfo.task.hours }} hour{{
            extraInfo.task.hours == 1 ? "" : "s"
          }}</span
        >
        <span v-show="extraInfo.task.difficulty == 'easy'" class="difficulty"
          >⚡</span
        >
        <span v-show="extraInfo.task.difficulty == 'medium'" class="difficulty"
          >⚡⚡</span
        >
        <span
          v-show="extraInfo.task.difficulty == 'difficult'"
          class="difficulty"
          >⚡⚡⚡</span
        >
      </p>
    </div>
    <FullCalendar
      default-view="dayGridMonth"
      :header="{ left: 'title', center: '', right: 'prev,next' }"
      :editable="true"
      :first-day="1"
      height="auto"
      :plugins="calendarPlugins"
      :events="events"
      :day-render="onDayRender"
      @eventMouseEnter="eventHoverEnter"
      @eventMouseLeave="eventHoverLeave"
      @eventDrop="onEventAdjusted"
      @eventResize="onEventAdjusted"
    />
  </div>
</template>
<script>
import FullCalendar from "@fullcalendar/vue"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"

import "@fullcalendar/core/main.css"
import "@fullcalendar/daygrid/main.css"
import "@/assets/styles/calendar/calendar_custom.css"

export default {
  name: "Calendar",
  components: {
    FullCalendar
  },
  props: {
    value: {
      type: Array,
      default: null
    },
    restrictToUserId: {
      type: String,
      default: null
    },
    colourByProject: {
      type: Boolean,
      default: false
    },
    colourPalette: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      calendarPlugins: [dayGridPlugin, interactionPlugin],
      colours: this.colourPalette
        ? this.colourPalette
        : ["#89C3CA", "#C6EC8E", "#FFCB4B", "#E84583", "#AD33B9"],
      listsProxy: [],
      extraInfo: {
        show: false,
        task: null
      }
    }
  },
  computed: {
    events() {
      let eventsList = []
      let usedColours = []
      let projectColours = []

      this.value.forEach((list, index) => {
        if (list.archived) return
        var projectColour = projectColours.find(project => {
          return project.name === list.projectName
        })

        var colour =
          this.colourByProject && projectColour
            ? projectColour.colour
            : this.colours[usedColours.length]

        list.tasks.forEach(task => {
          let event = {
            id: task.identifier,
            title: task.description,
            start: task.startdate.toDate(),
            end: this.addDays(task.enddate.toDate(), 1),
            textColor: "black",
            editable: true,
            backgroundColor: colour,
            allDay: true,
            classNames: [
              `fc-${task.priority}-priority`,
              `${list.blurred ? "opacity-20-p" : ""}`
            ],
            extendedProps: {
              ...task,
              listName: list.name
            }
          }

          if (this.restrictToUserId) {
            if (task.users.includes(this.restrictToUserId) && !task.completed) {
              eventsList.push(event)
              if (
                !usedColours.includes(this.colours[index]) &&
                index < this.colours.length
              )
                usedColours.push(this.colours[index])
            }
          } else if (!task.completed) {
            eventsList.push(event)
            if (
              !usedColours.includes(this.colours[index]) &&
              index < this.colours.length
            )
              usedColours.push(this.colours[index])
          }

          if (this.colourByProject && !projectColour)
            projectColours.push({
              name: list.projectName,
              colour: colour
            })
        })
      })
      return eventsList
    }
  },
  methods: {
    addDays: function(date, numberOfDays) {
      return date.setDate(date.getDate() + numberOfDays)
    },
    onEventAdjusted: function(info) {
      const enddate = info.event.end
      enddate.setDate(enddate.getDate() - 1)

      const updatedLists = this.value
      updatedLists.forEach(list => {
        list.tasks.forEach(task => {
          if (task.identifier == info.event.id) {
            task.startdate = this.$store.state.firebase.firestore.Timestamp.fromDate(
              info.event.start
            )
            task.enddate = this.$store.state.firebase.firestore.Timestamp.fromDate(
              enddate
            )
          }
        })
      })
      this.$emit("input", updatedLists)
      this.$emit("events-adjusted")
    },
    onDayRender: function(info) {
      if (info.date.getDay() == 0 || info.date.getDay() == 6) {
        info.el.classList.add("fc-weekend")
      }
    },
    // eslint-disable-next-line no-unused-vars
    eventHoverEnter(info) {
      document.getElementsByClassName("fc-toolbar")[0].style.display = "none"
      this.extraInfo.task = info.event.extendedProps
      this.extraInfo.show = true
    },
    eventHoverLeave() {
      document.getElementsByClassName("fc-toolbar")[0].style.display = "flex"
      this.extraInfo.show = false
    }
  }
}
</script>
<style scoped>
.extraInfo {
  background-color: #2f4554;
  border-radius: 5px;
  color: white;
  padding: 2px;
  margin-bottom: 5px;
  padding-left: 10px;
  height: 28px;
}
.extraInfo p {
  margin-bottom: 0px;
}
.extraInfo .list {
  font-weight: bold;
}
.extraInfo .hours,
.extraInfo .difficulty {
  padding: 0px 2px;
  float: right;
  margin: 0px 10px;
}
</style>
