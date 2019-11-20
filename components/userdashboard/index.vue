<template>
  <b-row>
    <b-col md="3">
      <b-card
        v-if="getProjectsForUser(userid).length > 0"
        class="project-progress"
      >
        <div
          v-for="project in getProjectsForUser(userid)"
          :key="project.id"
          class="progress-container"
        >
          <div class="d-flex">
            <span class="text-muted text-12">{{ project.name }}</span>
            <span class="text-muted text-12 ml-auto">
              {{ projectProgressPercent(project.id) }}%
            </span>
          </div>
          <b-progress
            height="5px"
            :value="projectProgressPercent(project.id)"
          ></b-progress>
        </div>
      </b-card>
      <b-card v-if="projectComposition.length > 1" class="pie-chart">
        <ProjectComposition
          :composition="projectComposition"
          @legendSelectChanged="blurCalendarEvents"
        />
      </b-card>
    </b-col>
    <b-col :md="getProjectsForUser(userid).length == 0 ? 12 : 9">
      <b-card class="project-calendar">
        <Calendar
          v-model="projectLists"
          :restrict-to-user-id="userid"
          :colour-palette="colourPalette"
          :colour-by-project="true"
          @events-adjusted="updateProjectLists"
        />
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import { mapGetters } from "vuex"
import Calendar from "@/components/calendar"
import ProjectComposition from "./projectComposition"

export default {
  components: {
    Calendar,
    ProjectComposition
  },
  props: {
    userid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      projectListsProxy: [],
      blurredProjects: [],
      colourPalette: ["#91c7ae", "#c23531", "#61a0a8", "#d48265", "#2f4554"]
    }
  },
  computed: {
    ...mapGetters({
      getProjectsForUser: "projects/getForUser",
      getProjectByName: "projects/getByName"
    }),
    projectLists: {
      get() {
        let lists = []
        if (this.getProjectsForUser(this.userid)) {
          this.getProjectsForUser(this.userid).forEach(project => {
            const blurredProject = this.blurredProjects.find(blurredProject => {
              return blurredProject.name === project.name
            })
            project.lists.forEach(list => {
              list.projectName = project.name
              list.blurred = blurredProject ? blurredProject.blur : false
            })
            lists.push(project.lists)
          })
        }
        return this.lodash.flatten(lists)
      },
      set(val) {
        this.projectListsProxy = val
      }
    },
    projectComposition() {
      let composition = []
      if (this.getProjectsForUser(this.userid)) {
        this.getProjectsForUser(this.userid).forEach(project => {
          let taskCount = 0
          project.lists.forEach(list => {
            taskCount += list.tasks.filter(task => {
              return task.users.includes(this.userid) && !task.completed
            }).length
          })
          composition.push({
            value: taskCount,
            name: project.name
          })
        })
      }
      return composition
    }
  },
  methods: {
    projectProgressPercent(projectid) {
      let allTasks = 0
      let completedTasks = 0
      this.getProjectsForUser(this.userid)
        .find(project => {
          return project.id == projectid
        })
        .lists.forEach(list => {
          list.tasks.forEach(task => {
            if (task.users.includes(this.userid)) {
              allTasks++
              if (task.completed) {
                completedTasks++
              }
            }
          })
        })

      return Math.round((completedTasks / allTasks) * 100)
    },
    blurCalendarEvents(selections) {
      let mappedSelections = []
      Object.keys(selections).map(function(key) {
        mappedSelections.push({
          name: key,
          blur: !selections[key]
        })
      })
      this.blurredProjects = mappedSelections
    },
    updateProjectLists() {
      let shapedLists = []

      this.projectListsProxy.forEach(list => {
        shapedLists.push({ ...list })
      })

      let groupedLists = this.lodash.groupBy(shapedLists, list => {
        return list.projectName
      })

      shapedLists.forEach(list => {
        delete list.blurred
        delete list.projectName
      })

      Object.keys(groupedLists).map(key => {
        groupedLists[key].forEach(list => {
          delete list.blurred
          delete list.projectName
        })
        this.$store.state.db
          .collection("projects")
          .doc(this.getProjectByName(key).id)
          .update({
            lists: groupedLists[key]
          })
      })
    }
  }
}
</script>
<style scoped>
.project-progress,
.project-calendar,
.pie-chart {
  margin-bottom: 10px;
}
.progress-container {
  margin-bottom: 1.5rem;
}
.progress-container:last-child {
  margin-bottom: 0 !important;
}
</style>
