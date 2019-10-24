<template>
  <div>
    <h5>
      <i v-if="!fixed" class="nav-icon i-Add" @click="addTask"></i>
      <input :value="list.name" />
      <i v-if="!fixed" class="nav-icon i-Remove f-r" @click="archiveList"></i>
    </h5>
    <div :id="'list_' + list.name" class="list-group">
      <ListItem
        v-for="(task, taskindex) in tasks"
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
    },
    fixed: {
      type: Boolean,
      deafult: false
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
    },
    tasks() {
      return this.sortList(this.list.tasks)
    }
  },
  mounted() {
    this.sortableRef = new Sortable(
      document.getElementById("list_" + this.list.name),
      {
        group: "shared",
        onAdd: function(task) {
          console.log(task)
        }
      }
    )
  },
  methods: {
    updateParent: function() {
      this.$parent[this.updateHandleName]()
    },
    addTask: function() {
      console.log("hit")
      this.value.tasks.push({
        completed: false,
        description: "",
        startdate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date()
        ),
        enddate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date()
        ),
        priority: "low"
      })
    },
    archiveList: function() {
      this.value.archived = true
      this.updateParent()
    },
    sortList: function(list) {
      function compare(a, b) {
        if (a.index > b.index) return 1
        if (b.index > a.index) return -1

        return 0
      }
      return list.sort(compare)
    }
  }
}
</script>
<style scoped>
.nav-icon {
  cursor: pointer;
}
input {
  border: none;
}
input:focus {
  outline: none;
}
</style>
