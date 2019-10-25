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
              :update-function="updateProject"
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
            <Calendar v-model="project.lists" />
          </b-card-text>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import Loading from "../../components/loading"
import List from "../../components/projectlist/list"
import Calendar from "../../components/calendar"
import { mapState } from "vuex"
import Util from "@/utils"

export default {
  layout: "default",
  name: "Project",
  components: {
    List,
    Loading,
    Calendar
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
        this.$toast.info("Project does not exist")
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
