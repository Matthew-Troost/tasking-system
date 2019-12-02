<template>
  <div>
    <loading v-if="loading" />
    <div v-else>
      <h2 class="page-title">
        {{ project.name }}
        <small>
          <nuxt-link :to="`/projects/${$route.params.type}`">{{
            linkToString($route.params.type)
          }}</nuxt-link>
          | {{ project.name }}
        </small>
      </h2>

      <b-tabs pills>
        <b-tab active>
          <template slot="title">
            <i class="i-Pen-4  ul-tab__icon" />
          </template>
          <b-card-text>
            <List
              v-for="(list, index) in lists"
              :key="list.id"
              v-model="project.lists[index]"
              :fixed="list.name == 'Completed'"
              :projectid="project.id"
              :update-function="updateProject"
              @list-update="updateProject"
              @item-moved="onListShuffled"
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
            <Calendar
              v-model="project.lists"
              :colour-palette="calendarColourPalette"
              @events-adjusted="updateProject"
            />
          </b-card-text>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import List from "@/components/project/projectlist/list"
import Calendar from "@/components/calendar"
import { mapGetters } from "vuex"
import Util from "@/utils"

export default {
  layout: "default",
  name: "Project",
  components: {
    List,
    Calendar
  },
  computed: {
    ...mapGetters({
      getProjectByName: "projects/getByName"
    }),
    project() {
      let selectedpoject = this.getProjectByName(
        Util.linkToString(this.$route.params.project)
      )

      if (!selectedpoject) {
        this.$toast.info("Project does not exist")
        return this.$router.back()
      }
      return selectedpoject
    },
    calendarColourPalette() {
      if (this.project) {
        return Util.generateColourPalette(this.project.colour)
      } else return null
    },
    lists() {
      return this.project.lists.filter(list => {
        return !list.archived
      })
    },
    loading() {
      return !this.project
    }
  },
  methods: {
    updateProject: function(projectid) {
      projectid = projectid === undefined ? this.project.id : projectid
      this.$store.state.db
        .collection("projects")
        .doc(projectid)
        .update(this.$store.getters["projects/getById"](projectid))
    },
    addList: function() {
      this.project.lists.push({
        identifier: Util.generateGuid(),
        name: "Give it a title...",
        archived: false,
        tasks: []
      })
      this.updateProject()
    },
    onListShuffled: function(parameters) {
      var fromList = this.project.lists.find(list => {
        return list.identifier == parameters.listFrom
      })

      var toList = this.project.lists.find(list => {
        return list.identifier == parameters.listTo
      })

      fromList.tasks.forEach((task, index) => {
        if (task.identifier == parameters.taskId) {
          toList.tasks.unshift(task)
          fromList.tasks.splice(index, 1)
        }
      })

      this.updateProject()
    },
    linkToString: function(value) {
      return Util.linkToString(value)
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
