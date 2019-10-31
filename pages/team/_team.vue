<template>
  <div class="main-content">
    <Loading v-if="loading" />

    <b-row>
      <b-col md="8">
        <h2 class="page-title">
          {{ name }}
          <small>
            <nuxt-link tag="a" class :to="addUrl">
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
            user.type && user.type.includes(position) && searchUser(user.id)
          "
          :key="user.id"
          lg="3"
          sm="6"
          md="4"
          class="user-card"
        >
          <!-- start::profile -->
          <b-card class="card-profile-1 mb-30 text-center">
            <div class="avatar mb-3">
              <img src="@/assets/images/avatars/matthewt.svg" alt />
            </div>
            <h5 class="m-0">
              {{ !user.nickname ? user.first_name : user.nickname }}
            </h5>

            <div v-if="userProjects[user.id]">
              <div
                v-for="project in userProjects[user.id].map(x => x)"
                :key="project"
                class="text-center"
              >
                <b-badge pill variant="outline-dark p-2 m-1"
                  >{{ project }}
                </b-badge>
              </div>
            </div>

            <button class="btn btn-primary btn-rounded mt-2">
              {{ user.first_name }}'s Schedule
            </button>
          </b-card>
        </b-col>
      </transition-group>
    </keep-alive>
  </div>
</template>
<script>
import { mapState } from "vuex"
import Util from "@/utils"
import Loading from "../../components/loading"

export default {
  layout: "default",
  components: {
    Loading
  },
  data() {
    return {
      name: "",
      position: "",
      loading: true,
      userProjects: [],
      searchWord: ""
    }
  },
  computed: {
    ...mapState({
      users: state => state.users.all,
      projects: state => state.projects.all
    }),
    addUrl() {
      return "/team/adduser/" + this.name
    }
  },
  validate({ params }) {
    return ["developers", "designers", "managing", "socialmedia"].includes(
      params.team
    )
  },
  watch: {
    projects() {
      this.projects.forEach(project => {
        //Populate userProjects array
        this.addUserProject(project)
      })
    }
  },
  created() {
    this.name = Util.linkToString(this.$route.params.team)
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
    this.projects.forEach(project => {
      //Populate userProjects array
      this.addUserProject(project)
    })
    this.loading = false
  },
  methods: {
    searchUser(userId) {
      const user = this.users[userId]
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
    addUserProject(projectData) {
      if (projectData.lists) {
        projectData.lists.forEach(list => {
          if (list.tasks)
            list.tasks.forEach(task => {
              if (task.users)
                task.users.forEach(user => {
                  if (!this.userProjects[user.id]) {
                    this.userProjects[user.id] = []
                  }
                  this.userProjects[user.id].push(projectData.name)
                })
            })
        })
      }
    }
  }
}
</script>

<style scoped>
.user-card {
  margin-bottom: 15px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
