<template>
  <div class="main-content">
    <loading v-if="loading" />
    <div v-if="!loading">
      <b-row>
        <b-col md="8">
          <h2 class="page-title">
            {{ name }}
            <small v-if="userIsSuperAdmin">
              <nuxt-link
                tag="a"
                class
                :to="`/team/${$route.params.role}/adduser`"
              >
                <i class="nav-icon i-Add"></i>
                <span class="item-name"> Add New</span>
              </nuxt-link>
            </small>
          </h2>
        </b-col>
        <b-col md="4">
          <b-form-input
            v-model="searchWord"
            class="form-control-rounded"
            type="text"
            required
            placeholder="Search..."
          >
          </b-form-input>
        </b-col>
      </b-row>
      <keep-alive>
        <transition-group name="fade" tag="b-row">
          <b-col
            v-for="user in users"
            v-show="
              user.type && user.type.includes(position) && searchUser(user)
            "
            :key="user.id"
            lg="3"
            sm="6"
            md="4"
            class="user-card"
          >
            <b-card class="card-profile-1 mb-30 text-center">
              <b-dropdown
                v-if="userIsSuperAdmin"
                size="lg"
                variant="link"
                toggle-class="text-decoration-none custom-padding"
                no-caret
              >
                <template slot="button-content" class="custom-padding">
                  &#x2026;<span class="sr-only">Search</span></template
                >
                <b-dropdown-item @click="sendResetPassword(user)"
                  >Reset Password</b-dropdown-item
                >
              </b-dropdown>
              <div class="avatar mb-3">
                <img v-if="user.avatar" v-lazy="user.avatar" alt />
              </div>
              <h5 class="m-0">
                {{ !user.nickname ? user.first_name : user.nickname }}
              </h5>

              <flickity :ref="`slider_${user.id}`" :options="slider.options">
                <div class="carousel-cell">
                  <div v-if="projectList[user.id]">
                    <b-badge
                      v-for="project in projectList[user.id].slice(0, 4)"
                      :key="project.id"
                      pill
                      variant="outline-dark p-2 m-1"
                      :to="'/projects/systems/' + toLink(project.name)"
                      nuxt
                      class="inline"
                      >{{ project.name }}
                    </b-badge>
                    <b-badge
                      v-if="projectList[user.id].length > 4"
                      class="inline"
                      pill
                      variant="outline-dark p-2 m-1"
                      >+{{ projectList[user.id].length - 4 }}
                    </b-badge>
                  </div>
                </div>
                <div v-if="projectList[user.id]" class="carousel-cell">
                  <div
                    v-for="project in projectList[user.id]"
                    :key="project.id"
                    class="project-stats"
                  >
                    <p>
                      {{ project.name }}
                    </p>
                    <div class="details">
                      <b-badge
                        pill
                        :variant="
                          `${
                            project.taskCount < 4
                              ? 'success'
                              : project.taskCount < 6
                              ? 'warning'
                              : 'danger'
                          } p-2`
                        "
                        >{{ project.taskCount }} tasks</b-badge
                      >

                      <p
                        :class="
                          project.completionDate < new Date() ? 'overdue' : ''
                        "
                      >
                        free
                        {{ project.completionDate | moment("from", "now") }}
                      </p>
                    </div>
                  </div>
                </div>
              </flickity>

              <nuxt-link
                :to="
                  `/team/${
                    $route.params.role
                  }/${user.first_name.toLowerCase()}-${user.last_name.toLowerCase()}`
                "
              >
                <button class="btn btn-primary btn-rounded mt-2 thin">
                  Schedule
                </button>
              </nuxt-link>
              <button
                v-if="projectList[user.id]"
                class="btn btn-primary btn-rounded mt-2 thin"
                @click="toggleStats(user.id)"
              >
                Quick Stats
              </button>
            </b-card>
          </b-col>
        </transition-group>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex"
import Util from "@/utils"
import flickity from "vue-flickity"

export default {
  layout: "default",
  components: {
    flickity
  },
  data() {
    return {
      name: "",
      position: "",
      loading: true,
      searchWord: "",
      slider: {
        options: {
          pageDots: false,
          wrapAround: true,
          adaptiveHeight: true,
          prevNextButtons: false
        }
      }
    }
  },
  computed: {
    ...mapState({
      users: state => state.users.all,
      projects: state => state.projects.all
    }),
    ...mapGetters({
      getCurrentUser: "users/getCurrentUser"
    }),
    projectList() {
      let array = []
      this.projects.forEach(project => {
        project.lists.forEach(list => {
          list.tasks.forEach(task => {
            if (task.completed) return

            task.users.forEach(userId => {
              if (!array[userId]) array[userId] = []

              let projectDetail = {
                ...project,
                taskCount: this.taskCount(project, userId),
                completionDate: this.userProjectComplDate(project, userId)
              }

              if (
                userId &&
                !array[userId].find(detail => {
                  return detail.id == project.id
                })
              )
                array[userId].push(projectDetail)
            })
          })
        })
      })
      return array
    },
    userIsSuperAdmin() {
      return (
        this.getCurrentUser &&
        this.getCurrentUser.roles &&
        this.getCurrentUser.roles.includes("SuperAdmin")
      )
    }
  },
  validate({ params }) {
    return ["developers", "designers", "managing", "socialmedia"].includes(
      params.role
    )
  },
  created() {
    this.name = Util.linkToString(this.$route.params.role)
    switch (this.name.toLowerCase()) {
      case "developers":
        this.position = "developer"
        break
      case "designers":
        this.position = "designer"
        break
      case "managing":
        this.position = "management"
        break
      case "socialmedia":
        this.position = "socialmedia"
        this.name = "Social Media"
        break
    }
  },
  mounted() {
    this.loading = false
  },
  methods: {
    searchUser(user) {
      return (
        (user.first_name &&
          user.first_name
            .toLowerCase()
            .includes(this.searchWord.toLowerCase())) ||
        (user.last_name &&
          user.last_name
            .toLowerCase()
            .includes(this.searchWord.toLowerCase())) ||
        (user.nickname &&
          user.nickname.toLowerCase().includes(this.searchWord.toLowerCase()))
      )
    },
    toLink: function(projectName) {
      return Util.stringToLink(projectName)
    },
    sendResetPassword(user) {
      this.$store.state.auth
        .sendPasswordResetEmail(user.email)
        .then(() => {
          this.$toast.success(
            `Sent a password reset email to ${user.first_name}`
          )
        })
        .catch(error => {
          this.$toast.error(
            `There was an error sending the password reset email: ${error}`
          )
        })
    },
    taskCount(project, userId) {
      let count = 0
      console.log(userId)
      project.lists.forEach(list => {
        list.tasks.forEach(task => {
          if (!task.completed && task.users.includes(userId)) count++
        })
      })
      console.log(project)
      return count
    },
    userProjectComplDate(project, userId) {
      let maxPerList = []
      project.lists.forEach(list => {
        maxPerList.push(
          list.tasks
            .filter(task => {
              return task.users.includes(userId)
            })
            .reduce(
              (max, task) =>
                task.enddate.toDate() > max ? task.enddate.toDate() : max,
              new Date(2010, 1, 1)
            )
        )
      })
      return maxPerList.reduce((max, listMax) =>
        listMax > max ? listMax : max
      )
    },
    toggleStats(userid) {
      this.$refs["slider_" + userid][0].next()
    }
  }
}
</script>

<style scoped>
.user-card {
  margin-bottom: 15px;
}
.inline {
  display: inline-block;
}
.b-dropdown {
  position: absolute;
  right: 0;
  top: 0;
}
.greyed {
  background: #eeeeee;
}
.thin {
  padding: 5px 10px;
  font-size: 12px;
}
.carousel-cell {
  width: 100%;
}
.project-stats {
  text-align: left;
  max-width: 250px;
  margin: auto;
  margin-bottom: 10px;
}
.project-stats:last-child {
  margin-bottom: 0px !important;
}
.project-stats p {
  margin: 0;
}
.project-stats .details p {
  float: right;
  font-size: 75%;
  padding-right: 0px !important;
}
.project-stats .details * {
  padding: 5px 10px !important;
}
.overdue {
  color: red;
  font-weight: bold;
}
</style>
