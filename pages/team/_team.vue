<template>
  <div class="main-content">
    <h2 class="page-title">{{ name }}</h2>

    <b-row v-if="!loading">
      <b-col
        v-for="user in users"
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
          <h5 class="m-0">{{ user.first_name }}</h5>
          <div
            v-for="project in getUserProjects(user.id)"
            :key="project.id"
            class="text-center"
          >
            <b-badge pill variant="outline-dark p-2 m-1"
              >{{ project.name }}
            </b-badge>
          </div>
          <button class="btn btn-primary btn-rounded mt-2">
            {{ user.first_name }}'s Schedule
          </button>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapState } from "vuex"
import Util from "@/utils"

export default {
  layout: "default",
  name: "Developers",
  data() {
    return {
      name: "",
      loading: true,
      projectsArray: [],
      userProjects: []
    }
  },
  computed: {
    ...mapState({
      users: state => state.users.users,
      projects: state => state.projects.all
    })
  },
  validate({ params }) {
    console.log(Util.linkToString(params.team))

    return true
  },
  watch: {
    projects() {
      this.loading = false
    }
  },
  created() {
    //fetch projects
    this.$store.state.db.collection("projects").onSnapshot(projects => {
      if (projects && projects.docs) {
        projects.docs.forEach(project => {
          this.$store.commit("projects/setProject", {
            project
          })
          this.projectsArray.push(project.data())
        })
      }
    })
    //fetch users
    this.$store.state.db.collection("users").onSnapshot(users => {
      if (users && users.docs) {
        users.docs.forEach(user => {
          this.$store.commit("users/setUser", {
            user
          })
        })
      }
    })
  },
  mounted() {
    this.name =
      this.$route.params.team.charAt(0).toUpperCase() +
      this.$route.params.team.slice(1)
  },
  methods: {
    getUserProjects(userId) {
      debugger
      return this.projectsArray.filter(function(project) {
        try {
          return project.lists.tasks.filter(function(task) {
            return task.users.filter(function(user) {
              return user.id === userId
            })
          })
        } catch (e) {
          console.log(e)
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.user-card {
  margin-bottom: 15px;
}
</style>
