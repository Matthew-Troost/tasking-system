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
    <!-- <keep-alive> -->
    <b-row>
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
    </b-row>
    <!-- </keep-alive> -->
  </div>
</template>
<script>
import { mapState } from "vuex"

export default {
  layout: "default",
  name: "Developers",
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
    //fetch users
    this.$store.state.db.collection("users").onSnapshot(users => {
      if (users && users.docs) {
        users.docs.forEach(user => {
          this.$store.commit("users/setUser", {
            user
          })
        })
      }
    }),
      error => {
        this.$toast.error(error, {
          theme: "bubble",
          position: "top-left",
          duration: 5000
        })
      }
    //fetch projects
    this.$store.state.db.collection("projects").onSnapshot(projects => {
      if (projects && projects.docs) {
        projects.docs.forEach(project => {
          this.$store.commit("projects/setProject", {
            project
          })
          //Populate userProjects array
          const projectData = project.data()
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
        })
      }
    }),
      error => {
        this.$toast.error(error, {
          theme: "bubble",
          position: "top-left",
          duration: 5000
        })
      }
  },
  mounted() {
    switch (this.$route.params.team) {
      case "developers":
        this.position = "developer"
        this.name = "Developers"
        break
      case "designers":
        this.position = "designer"
        this.name = "Designers"
        break
      case "managing":
        this.position = "management"
        this.name = "Managing"
        break
      case "socialmedia":
        this.position = "socialmedia"
        this.name = "Social Media"
        break
    }
  },
  methods: {
    searchUser(userId) {
      const user = this.users[userId]
      return (
        (user.first_name &&
          user.first_name.toLowerCase().includes(this.searchWord)) ||
        (user.last_name &&
          user.last_name.toLowerCase().includes(this.searchWord))
      )
    }
  },
  addUserProject(userId, projectName) {
    if (!this.userProjects[userId]) {
      this.userProjects[userId] = []
    }
    this.userProjects[userId].push(projectName)
  }
}
</script>

<style scoped>
.user-card {
  margin-bottom: 15px;
}
</style>
