<template>
  <FullCalendar
    default-view="dayGridMonth"
    :header="{ left: 'title', center: '', right: 'prev,next' }"
    :editable="true"
    height="auto"
    :plugins="calendarPlugins"
    :events="events"
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
    }
  },
  data() {
    return {
      calendarPlugins: [dayGridPlugin, interactionPlugin],
      colourPalette: ["#89C3CA", "#C6EC8E", "#FFCB4B", "#E84583", "#AD33B9"]
    }
  },
  computed: {
    events() {
      let eventsList = []

      this.value.forEach((list, index) => {
        list.tasks.forEach(task => {
          eventsList.push({
            title: `${task.description}`,
            start: task.startdate.toDate(),
            end: this.addDays(task.enddate.toDate(), 1),
            textColor: "black",
            editable: true,
            backgroundColor: this.colourPalette[index],
            allDay: true,
            classNames: [`fc-${task.priority}-priority`]
          })
        })
      })
      return eventsList
    }
  },
  methods: {
    addDays: function(date, numberOfDays) {
      return date.setDate(date.getDate() + numberOfDays)
    }
  }
}
</script>