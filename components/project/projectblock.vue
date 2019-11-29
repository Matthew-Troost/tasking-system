<template>
  <b-card
    v-if="!loading"
    class="mb-30 text-15 w-100"
    :header="project.name"
    header-tag="h5"
  >
    <div
      class="project-colour"
      :style="selectedColour"
      @click="toggleColorPicker"
    ></div>
    <color-picker
      v-show="selectColour"
      v-model="colour"
      class="colour-picker"
    />
    <ProjectAvatar
      v-for="user in projectUsers"
      :key="user"
      class="avatar"
      :user-id="user"
    />
    <div>
      <nuxt-link
        :to="`/projects/${toLink(type)}/${toLink(project.name)}/settings`"
      >
        <b-button variant="outline-dark m-1 btn-sm f-r"
          ><i class="i-Gear"></i
        ></b-button>
      </nuxt-link>
      <nuxt-link :to="`/projects/${toLink(type)}/${toLink(project.name)}`">
        <b-button variant="outline-primary m-1 btn-sm f-r">View</b-button>
      </nuxt-link>
    </div>
  </b-card>
</template>
<script>
import ProjectAvatar from "@/components/projectAvatar"
import { Compact } from "vue-color"
import Util from "@/utils"
import { mapGetters } from "vuex"

export default {
  components: {
    ProjectAvatar,
    "color-picker": Compact
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    projectId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      project: null,
      loading: true,
      colour: {
        hex: "#194d33"
      },
      selectColour: false
    }
  },
  computed: {
    ...mapGetters({
      getProject: "projects/getById"
    }),
    projectUsers() {
      let users = []
      if (this.project.lists)
        this.project.lists.forEach(list => {
          if (list.tasks) {
            list.tasks.forEach(task => {
              if (task.users) {
                task.users.forEach(userid => {
                  if (!users.includes(userid)) users.push(userid)
                })
              }
            })
          }
        })
      return users
    },
    selectedColour() {
      return {
        backgroundColor: this.colour.hex
      }
    }
  },
  watch: {
    colour: {
      handler() {
        if (!this.loading) {
          this.$emit("colour-changed", {
            projectid: this.projectId,
            colour: this.colour.hex
          })
        }
      }
    }
  },
  created() {
    this.project = this.getProject(this.projectId)
    this.colour.hex = this.project.colour
    this.loading = false
  },
  methods: {
    toLink: function(projectName) {
      return Util.stringToLink(projectName)
    },
    toggleColorPicker() {
      this.selectColour = !this.selectColour
    }
  }
}
</script>
<style scoped>
.avatar {
  margin-right: 20px;
}
.colour-picker {
  margin-bottom: 10px;
}
.project-colour {
  width: 100%;
  height: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  max-width: 240px;
}
.project-colour:hover {
  cursor: pointer;
}
</style>
