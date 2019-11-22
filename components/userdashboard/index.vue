<template>
  <div>
    <b-row v-if="getProjectsForUser(userid).length > 0">
      <b-col md="3">
        <b-card class="view-toggle">
          <b-row>
            <b-col sm="6"
              ><i
                class="i-Calendar-4"
                :class="calendarViewSelected ? 'view-selected' : ''"
                @click="toggleView"
              ></i>
            </b-col>
            <b-col sm="6">
              <i
                class="i-Letter-Open"
                :class="!calendarViewSelected ? 'view-selected' : ''"
                @click="toggleView"
              ></i
            ></b-col>
          </b-row>
        </b-card>
        <b-card class="project-progress">
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
        <b-card v-if="projectComposition.data.length > 1" class="pie-chart">
          <ProjectComposition
            :composition="projectComposition"
            @legendSelectChanged="blurCalendarEvents"
          />
        </b-card>
      </b-col>
      <b-col md="9">
        <b-card class="project-calendar">
          <Calendar
            v-show="calendarViewSelected"
            key="calendar"
            v-model="projectLists"
            :restrict-to-user-id="userid"
            :colour-palette="projectComposition.colours"
            :colour-by-project="true"
            @events-adjusted="updateProjectLists"
          />
          <div v-show="!calendarViewSelected" key="list">
            <div
              v-for="projectName in lodash
                .uniqBy(projectLists, 'projectName')
                .map(list => list.projectName)"
              :key="projectName"
            >
              <h4>
                <b>{{ projectName }}</b>
              </h4>
              <List
                v-for="list in projectLists.filter(list => {
                  return list.projectName == projectName
                })"
                :key="list.id"
                v-model="projectLists[projectLists.indexOf(list)]"
                :fixed="list.name == 'Completed'"
                projectid="sdffhsh"
                :userid="userid"
                :update-function="updateProject"
                class="ml-15"
                @list-update="updateProject"
                @item-moved="onListShuffled"
              />
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <h3 v-else class="no-projects"><i>No projects just yet...</i></h3>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import Calendar from "@/components/calendar"
import ProjectComposition from "./projectComposition"
import List from "@/components/project/projectlist/list"

export default {
  components: {
    Calendar,
    ProjectComposition,
    List
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
      calendarViewSelected: true
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
              list.tasks.forEach(task => {
                if (task.users.includes(this.userid)) {
                  list.projectName = project.name
                  list.blurred = blurredProject ? blurredProject.blur : false
                  if (!lists.includes(list)) lists.push(list)
                }
              })
            })
          })
        }
        return lists
      },
      set(val) {
        this.projectListsProxy = val
      }
    },
    projectComposition() {
      let composition = {
        data: [],
        colours: []
      }
      if (this.getProjectsForUser(this.userid)) {
        this.getProjectsForUser(this.userid).forEach(project => {
          let taskCount = 0
          project.lists.forEach(list => {
            taskCount += list.tasks.filter(task => {
              return task.users.includes(this.userid) && !task.completed
            }).length
          })
          composition.data.push({
            value: taskCount,
            name: project.name
          })
          composition.colours.push(project.colour)
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
    toggleView() {
      this.calendarViewSelected = !this.calendarViewSelected
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
.view-toggle,
.pie-chart {
  margin-bottom: 10px;
}
.progress-container {
  margin-bottom: 1.5rem;
}
.progress-container:last-child {
  margin-bottom: 0 !important;
}
.no-projects {
  text-align: center;
  margin-top: 50px;
  color: grey;
}
.view-toggle {
  text-align: center;
}
.view-toggle i:hover {
  cursor: pointer;
  border: 0.5px solid #003473;
  padding: 10px;
  border-radius: 50%;
}
.view-selected {
  border: 1px solid #003473;
  padding: 10px;
  border-radius: 50%;
  background-color: #003473;
  color: white;
}
</style>
