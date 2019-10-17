<template>
  <div>
    <Loading v-if="loading" />
    <div v-else>
      <h2 class="page-title">{{ project.name }}</h2>
      <List
        v-for="(list, index) in project.lists"
        :id="'list_' + list.name"
        :key="list.id"
        v-model="project.lists[index]"
        update-handle-name="updateProject"
      />
    </div>
  </div>
</template>
<script>
import Loading from "../../components/loading"
import List from "../../components/projectlist/list"
import Util from "@/utils"
import { mapState } from "vuex"

export default {
  layout: "default",
  name: "Project",
  components: {
    List,
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
