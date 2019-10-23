<template>
  <div>
    <Loading v-if="loading" />
    <div v-else>
      <h2 class="page-title">
        {{ project.name }}
      </h2>

      <b-tabs pills>
        <b-tab active>
          <template slot="title">
            <i class="i-Pen-4  ul-tab__icon" />
          </template>
          <b-card-text>
            <List
              v-for="(list, index) in project.lists"
              :key="list.id"
              v-model="project.lists[index]"
              update-handle-name="updateProject"
            />
            <b-button variant="outline-light m-1 btn-sm" @click="addList"
              >Add new list</b-button
            >
          </b-card-text>
        </b-tab>
        <b-tab>
          <template slot="title">
            <i class="i-Calendar-4  ul-tab__icon" />
          </template>
          <b-card-text>
            <FullCalendar
              default-view="dayGridMonth"
              :header="{ left: 'title', center: '', right: 'prev,next' }"
              :editable="true"
              :plugins="calendarPlugins"
              :events="[
                {
                  title: 'event 1',
                  start: '2019-10-21',
                  end: '2019-10-23',
                  textColor: 'white',
                  editable: true,
                  backgroundColor: '#b9b9b9'
                },
                {
                  title: 'event 2',
                  start: '2019-10-24',
                  backgroundColor: '#b9b9b9'
                }
              ]"
            />
          </b-card-text>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import Loading from "../../components/loading"
import List from "../../components/projectlist/list"
import { mapState } from "vuex"
import Util from "@/utils"

import FullCalendar from "@fullcalendar/vue"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"

import "@fullcalendar/core/main.css"
import "@fullcalendar/daygrid/main.css"

export default {
  layout: "default",
  name: "Project",
  components: {
    List,
    Loading,
    FullCalendar
  },
  data() {
    return {
      calendarPlugins: [dayGridPlugin, interactionPlugin]
    }
  },
  computed: {
    ...mapState({
      projects: state => state.projects.all
    }),
    project() {
      let selectedpojects = this.projects.filter(project => {
        return project.name == Util.linkToString(this.$route.params.project)
      })

      if (selectedpojects.length > 0) {
        return selectedpojects[0]
      } else {
        this.$toast.info("Project does not exist", {
          theme: "bubble",
          position: "top-left",
          duration: 5000
        })
        return this.$router.back()
      }
    },
    loading() {
      return this.project == null
    }
  },
  methods: {
    updateProject: function() {
      this.$store.state.db
        .collection("projects")
        .doc(this.project.id)
        .update(this.project)
    },
    addList: function() {
      this.project.lists.push({
        name: "Give it a title...",
        archived: false,
        tasks: []
      })
      this.updateProject()
    }
  }
}
</script>
<style scoped>
.grid-square {
  display: inline-block;
  padding: 15px;
  margin: 5px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 4px;
}
h2 > button {
  float: right;
}
</style>
