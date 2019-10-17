<template>
  <div>
    <Loading v-if="loading" />
    <div v-else>
      <h2>{{ project == null ? "" : project.name }}</h2>
      <div
        v-for="(list, index) in project.lists"
        :id="'list_' + project.name"
        :key="list.id"
        class="list-group"
      >
        <!-- TODO: pass in props to list item here -->
        <ListItem
          v-for="(task, taskindex) in project.lists[index].tasks"
          :key="task.id"
          v-model="project.lists[index].tasks[taskindex]"
          :priority="task.priority"
        />
      </div>
    </div>
  </div>
</template>
<script>
//import Sortable from "sortablejs"
import Loading from "../../components/loading"
import ListItem from "../../components/projectlist/listItem"
import Util from "@/utils"
import { mapState } from "vuex"

export default {
  layout: "default",
  name: "Project",
  components: {
    ListItem,
    Loading
  },
  data() {
    return {
      loading: true,
      project: null
    }
  },
  computed: {
    ...mapState({
      projects: state => state.projects.all
    })
  },
  created() {
    //TODO: this needs to be a snapshot query!!
    this.$store
      .dispatch("projects/get", {
        projectName: Util.linkToString(this.$route.params.project)
      })
      .then(
        result => {
          if (typeof result == "string") {
            this.$toast.info(result, {
              theme: "bubble",
              position: "top-left",
              duration: 5000
            })
            this.$router.back()
          } else {
            this.project = result
            this.initializeLists()
          }
        },
        error => {
          this.$toast.error(error, {
            theme: "bubble",
            position: "top-left",
            duration: 5000
          })
          this.$router.back()
        }
      )
  },
  mounted() {
    // new Sortable(document.getElementById("simpleList"), {
    //   group: "shared"
    // })
  },
  methods: {
    initializeLists: function() {
      //TODO: create drag and drops out of lists
      this.loading = false
    }
  }
}
</script>
<style scoped>
.grid-square {
  display: inline-block;
  padding: 15px;
  margin: 5px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 4px;
}
</style>
