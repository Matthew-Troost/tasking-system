<template>
  <FullCalendar
    default-view="dayGridMonth"
    :header="{ left: 'title', center: '', right: 'prev,next' }"
    :editable="true"
    :first-day="1"
    height="auto"
    :plugins="calendarPlugins"
    :events="events"
    :day-render="onDayRender"
    @eventDrop="onEventAdjusted"
    @eventResize="onEventAdjusted"
  />
</template>
<script>
import FullCalendar from "@fullcalendar/vue"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"

import "@fullcalendar/core/main.css"
import "@fullcalendar/daygrid/main.css"
import "../assets/styles/calendar/calendar_custom.css"

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
      listsProxy: []
    }
  },
  computed: {
    events() {
      let eventsList = []
      let usedColours = []
      let projectColours = []

      this.value.forEach((list, index) => {
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
            ]
          }

          if (this.restrictToUserId) {
            if (task.users.includes(this.restrictToUserId) && !task.completed) {
              eventsList.push(event)
              if (!usedColours.includes(this.colours[index]))
                usedColours.push(this.colours[index])
            }
          } else if (!task.completed) {
            eventsList.push(event)
            if (!usedColours.includes(this.colours[index]))
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
    }
  }
}
</script>
