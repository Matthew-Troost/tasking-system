<template>
  <div>
    <Loading v-if="loading" />
    <div v-else>
      <h2 class="page-title">{{ project == null ? "" : project.name }}</h2>
      <div
        v-for="(list, index) in project.lists"
        :id="'list_' + list.name"
        :key="list.id"
        class="list-group"
      >
        <h5>{{ project.lists[index].name }}</h5>
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
import Sortable from "sortablejs"
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
      project: null,
      projectListRefs: []
    }
  },
  computed: {
    ...mapState({
      projects: state => state.projects.all
    })
  },
  watch: {
    project: {
      //deep: true,
      handler() {
        // console.log("model changed")
      }
    }
  },
  created() {
    this.$store.state.db
      .collection("projects")
      .where("name", "==", Util.linkToString(this.$route.params.project))
      .limit(1)
      .onSnapshot(
        projects => {
          if (projects && projects.docs.length > 0) {
            this.project = {
              id: projects.docs[0].id,
              ...projects.docs[0].data()
            }
            this.loading = false
          } else {
            this.$toast.info("Project does not exist", {
              theme: "bubble",
              position: "top-left",
              duration: 5000
            })
            this.$router.back()
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
  updated() {
    if (!!this.project.lists && this.projectListRefs.length == 0) {
      this.project.lists.forEach(list => {
        this.projectListRefs.push(
          new Sortable(document.getElementById("list_" + list.name), {
            group: "shared"
          })
        )
      })
    }
  },
  methods: {
    updateProject: function() {
      this.$store.dispatch("projects/update", { project: this.project })
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
