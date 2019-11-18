<template>
  <div>
    <loading v-show="loading" />
    <div v-if="!loading">
      <div class="avatar">
        <img v-lazy="user.avatar" alt />
        <h1>{{ user.first_name }} {{ user.last_name }}</h1>
      </div>
      <b-row>
        <b-col md="3">
          <b-card class="project-progress">
            <div
              v-for="project in getProjectsForUser(user.id)"
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
          <b-card>
            <div class="chart-wrapper" style="height: 300px ; width:100%">
              <h4>Tickets (coming soon...)</h4>
            </div>
          </b-card>
        </b-col>
        <b-col md="9">
          <b-card class="project-calendar"> <h4>Calendar</h4> </b-card>
          <b-card> <v-chart :options="polar" /> </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex"
import loading from "@/components/loading"

export default {
  layout: "default",
  name: "Dashboard",
  components: {
    loading
  },
  data() {
    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = (i / 180) * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }

    return {
      polar: {
        title: {
          text: "极坐标双数值轴"
        },
        legend: {
          data: ["line"]
        },
        polar: {
          center: ["50%", "54%"]
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        angleAxis: {
          type: "value",
          startAngle: 0
        },
        radiusAxis: {
          min: 0
        },
        series: [
          {
            coordinateSystem: "polar",
            name: "line",
            type: "line",
            showSymbol: false,
            data: data
          }
        ],
        animationDuration: 2000
      }
    }
  },
  computed: {
    ...mapGetters({
      getUser: "users/getUserByUID",
      getProjectsForUser: "projects/getForUser"
    }),
    ...mapState({
      currentUser: state => state.users.current_user
    }),
    user() {
      return this.getUser(this.currentUser.uid)
    },
    loading() {
      return this.user == null
    }
  },
  methods: {
    projectProgressPercent: function(projectid) {
      let allTasks = 0
      let completedTasks = 0
      this.getProjectsForUser(this.user.id)
        .find(project => {
          return project.id == projectid
        })
        .lists.forEach(list => {
          list.tasks.forEach(task => {
            if (task.users.includes(this.user.id)) {
              allTasks++
              if (task.completed) {
                completedTasks++
              }
            }
          })
        })

      return Math.round((completedTasks / allTasks) * 100)
    }
  }
}
</script>
<style scoped>
.avatar {
  margin-bottom: 20px;
}
.avatar img {
  width: 120px;
}
.avatar h1 {
  display: inline-block;
  margin-bottom: 0px;
  margin-left: 50px;
  font-size: 50px;
}
.project-progress,
.project-calendar {
  margin-bottom: 10px;
}
.progress-container {
  margin-bottom: 1.5rem;
}
.progress-container:last-child {
  margin-bottom: 0 !important;
}
</style>
