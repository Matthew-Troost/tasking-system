<template>
  <div>
    <h2>{{ projectName }}</h2>
    <div id="simpleList" class="list-group">
      <div class="list-group-item">
        This is <a href="http://rubaxa.github.io/Sortable/">Sortable</a>
      </div>
      <ListItem />
      <div class="list-group-item">It has support for touch devices.</div>
      <div class="list-group-item">Just drag some elements around.</div>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs"
import ListItem from "../../components/projectlist/listItem"
import Util from "@/utils"

export default {
  layout: "default",
  name: "Project",
  components: {
    ListItem
  },
  validate({ params }) {
    //check firebase to see if project exists
    //set project name from firebase object rather
    console.log(Util.linkToString(params.project))
    return true
  },
  data() {
    return {
      projectName: "",
      projectLists: []
    }
  },
  mounted() {
    this.projectName = this.$route.params.project

    new Sortable(document.getElementById("simpleList"), {
      group: "shared"
    })
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
