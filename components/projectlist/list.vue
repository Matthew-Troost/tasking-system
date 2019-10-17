<template>
  <div>
    <h5>
      {{ list.name }}
      <i class="nav-icon i-Add" @click="addTask"></i>
    </h5>
    <div :id="'list_' + list.id" class="list-group">
      <ListItem
        v-for="(task, taskindex) in list.tasks"
        :key="task.id"
        v-model="list.tasks[taskindex]"
        :priority="task.priority"
      />
    </div>
  </div>
</template>
<script>
import ListItem from "./listItem"
import Sortable from "sortablejs"

export default {
  name: "List",
  components: {
    ListItem
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    updateHandleName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      sortableRef: null
    }
  },
  computed: {
    list: {
      get() {
        return this.value
      }
    }
  },
  mounted() {
    this.sortableRef = new Sortable(
      document.getElementById("list_" + this.list.id),
      {
        group: "shared"
      }
    )
  },
  methods: {
    updateParent: function() {
      this.$parent[this.updateHandleName]()
    },
    addTask: function() {
      this.value.tasks.push({
        description: "",
        startdate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date()
        ),
        enddate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date()
        ),
        priority: "low"
      })
    }
  }
}
</script>
