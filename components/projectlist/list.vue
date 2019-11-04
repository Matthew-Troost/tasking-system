<template>
  <div>
    <h5>
      <i v-if="!fixed" class="nav-icon i-Add" @click="addTask"></i>
      <input :value="list.name" />
      <i v-if="!fixed" class="nav-icon i-Remove f-r" @click="archiveList"></i>
    </h5>
    <div :id="`list_${list.name}`" class="list-group">
      <ListItem
        v-for="(task, taskindex) in list.tasks"
        :key="task.id"
        v-model="list.tasks[taskindex]"
        :priority="task.priority"
      />
    </div>
    <div class="list-group-item totals">
      <b-row>
        <b-col md="6"></b-col>
        <b-col md="2">
          <p>total here</p>
        </b-col>
        <b-col md="4"> </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import ListItem from "./listItem"
import Sortable from "sortablejs"
import Utils from "@/utils"

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
    updateFunction: {
      type: Function,
      default: null
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
      this.updateFunction()
    },
    addTask: function() {
      this.value.tasks.push({
        identifier: Utils.generateGuid(),
        completed: false,
        description: "",
        difficulty: "easy",
        hours: 1,
        startdate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date()
        ),
        enddate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date()
        ),
        priority: "low",
        users: []
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
.list-group {
  margin-bottom: -2px !important;
}
.totals {
  background-color: #dedede;
  border-color: #d2d2d2;
  margin-bottom: 20px !important;
}
.totals p {
  margin: 0;
}
.totals [class*="col-"] {
  text-align: center;
}
</style>
