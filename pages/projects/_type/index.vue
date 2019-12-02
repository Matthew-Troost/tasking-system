<template>
  <div class="main-content">
    <loading v-show="loading" />
    <div v-show="!loading">
      <b-row>
        <b-col md="8">
          <h2 class="page-title">
            {{ projectType }}
            <small v-if="userIsSuperAdmin" class="add-new">
              <a v-b-modal.modal-add-project>
                <i class="nav-icon i-Add"></i>
                <span class="item-name"> Add New</span>
              </a>
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
          ></b-form-input>
        </b-col>
      </b-row>
      <transition-group name="fade" tag="b-row">
        <b-col
          v-for="project in projects"
          v-show="
            project.name.toLowerCase().includes(searchWord) &&
              project.type.includes(projectType.toLowerCase())
          "
          :key="project.id"
          md="6"
          lg="4"
        >
          <projectBlock
            :type="projectType"
            :project-id="project.id"
            @colour-changed="updateColour"
          />
        </b-col>
      </transition-group>
      <b-modal
        v-if="userIsSuperAdmin"
        id="modal-add-project"
        centered
        :hide-footer="true"
        :hide-header="true"
        size="lg"
      >
        <div class="modal-addition-only">
          <b-form-input
            v-model="newProjectName"
            class="form-control-rounded input-extra-large"
            type="text"
            required
            placeholder="Enter project name..."
            @keyup.enter="addProject()"
          ></b-form-input>
          <b-button pill variant="success ripple" @click="addProject()"
            >Save</b-button
          >
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
import Util from "@/utils"
import projectBlock from "@/components/project/projectblock"
import { mapState } from "vuex"

export default {
  layout: "default",
  name: "Type",
  components: {
    projectBlock
  },
  data() {
    return {
      projectType: "",
      newProjectName: "",
      searchWord: "",
      loading: true
    }
  },
  computed: {
    ...mapState({
      projects: state => state.projects.all
    }),
    projectDescription() {
      return `A slack channel for communication regarding the ${this.projectType.substring(
        0,
        this.projectType.length - 1
      )}: ${this.newProjectName}`
    },
    currentUser() {
      return this.$store.getters["users/getUserByUID"](
        this.$store.state.users.current_user.uid
      )
    },
    userIsSuperAdmin() {
      return (
        this.currentUser &&
        this.currentUser.roles &&
        this.currentUser.roles.includes("SuperAdmin")
      )
    }
  },
  created() {
    this.projectType = Util.linkToString(this.$route.params.type)
    this.loading = false
  },
  methods: {
    addProject: function() {
      if (!this.newProjectName) {
        return this.$toast.error("Please enter a project name.")
      }
      if (
        this.projects.filter(
          project => project.name == Util.linkToString(this.newProjectName)
        ).length > 0
      ) {
        return this.$toast.error("A project with this name already exists")
      } else
        new Promise(() => {
          this.$slack
            .addProjectChannel(
              Util.linkToString(this.newProjectName),
              this.projectDescription
            )
            .then(channel => {
              this.$store.state.db
                .collection("projects")
                .add({
                  name: Util.linkToString(this.newProjectName),
                  lists: [
                    {
                      name: "Milestone 1",
                      identifier: Util.generateGuid(),
                      archived: false,
                      tasks: []
                    },
                    {
                      name: "Completed",
                      identifier: Util.generateGuid(),
                      archived: false,
                      tasks: []
                    }
                  ],
                  type: this.projectType.toLowerCase(),
                  settings: {
                    colour: "#73d8ff",
                    associatedEmails: [],
                    slackChannelId: channel.channel.id
                  }
                })
                .then(() => {
                  this.$toast.success(
                    `${Util.linkToString(
                      this.newProjectName
                    )} has been added as a project`
                  )
                  this.newProjectName = ""
                })
            })
            .catch(error => {
              this.$toast.error(
                `There was an issue adding this project: ${error}`
              )
            })
        })

      this.$bvModal.hide("modal-add-project")
    },
    updateColour(detail) {
      this.$store.state.db
        .collection("projects")
        .doc(detail.projectid)
        .update({
          colour: detail.colour
        })
    },
    toLink: function(projectName) {
      return Util.stringToLink(projectName)
    }
  }
}
</script>
<style scoped>
.button-container {
  text-align: right;
}
.modal-addition-only {
  display: flex;
}
.modal-addition-only input {
  margin-right: 15px;
}
.add-new:hover {
  cursor: pointer;
}
</style>
