<template>
  <div v-if="!loading" class="main-content">
    <b-row>
      <b-col md="8">
        <h2 class="page-title">{{ name }}</h2>
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
            <h5 class="m-0">{{ user.first_name }}</h5>

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
      users: state => state.users.users,
      projects: state => state.projects.all
    })
  },
  validate({ params }) {
    console.log(params.team)
    return true
  },
  watch: {
    projects() {
      this.loading = false
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

    //fetch projects
    this.$store.state.db.collection("projects").onSnapshot(
      projects => {
        if (projects && projects.docs) {
          projects.docs.forEach(project => {
            this.$store.commit("projects/setProject", {
              project
            })
            //Populate userProjects array
            const projectData = project.data()
            this.addUserProject(projectData)
          })
        }
      },
      error => {
        this.$toast.error(error, {
          theme: "bubble",
          position: "top-left",
          duration: 5000
        })
      }
    )
  },
  mounted() {},
  methods: {
    searchUser(userId) {
      const user = this.users[userId]
      return (
        (user.first_name &&
          user.first_name
            .toLowerCase()
            .includes(this.searchWord.toLowerCase())) ||
        (user.last_name &&
          user.last_name.toLowerCase().includes(this.searchWord.toLowerCase()))
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
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
