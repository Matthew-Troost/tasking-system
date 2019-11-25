<template>
  <div class="main-content">
    <loading v-if="loading" />
    <div v-if="!loading">
      <b-row>
        <b-col md="8">
          <h2 class="page-title">
            {{ name }}
            <small>
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
              <div class="avatar mb-3">
                <img v-if="user.avatar" v-lazy="user.avatar" alt />
              </div>
              <h5 class="m-0">
                {{ !user.nickname ? user.first_name : user.nickname }}
              </h5>

              <div v-if="projectList[user.id]">
                <div
                  v-for="project in projectList[user.id]"
                  :key="project"
                  class="text-center"
                >
                  <b-badge
                    pill
                    variant="outline-dark p-2 m-1"
                    :to="'/projects/systems/' + toLink(project)"
                    nuxt
                    >{{ project }}
                  </b-badge>
                </div>
              </div>
              <div v-else>
                <div class="text-center">
                  <b-badge pill variant="outline-dark p-2 m-1"
                    >No Tasks
                  </b-badge>
                </div>
              </div>
              <nuxt-link
                :to="
                  `/team/${
                    $route.params.role
                  }/${user.first_name.toLowerCase()}-${user.last_name.toLowerCase()}`
                "
              >
                <button class="btn btn-primary btn-rounded mt-2">
                  {{ user.first_name }}'s Schedule
                </button>
              </nuxt-link>
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

export default {
  layout: "default",
  data() {
    return {
      name: "",
      position: "",
      loading: true,
      searchWord: ""
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
        if (project.lists) {
          project.lists.forEach(list => {
            if (list.tasks)
              list.tasks.forEach(task => {
                if (task.users)
                  task.users.forEach(user => {
                    if (!array[user]) {
                      array[user] = []
                    }
                    if (user && !array[user].includes(project.name))
                      array[user].push(project.name)
                  })
              })
          })
        }
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
    }
  }
}
</script>

<style scoped>
.user-card {
  margin-bottom: 15px;
}
</style>
