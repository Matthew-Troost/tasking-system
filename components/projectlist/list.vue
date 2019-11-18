<template>
  <div>
    <div class="list-header">
      <b-row>
        <b-col md="6">
          <i v-if="!fixed" class="nav-icon i-Add" @click="addTask"></i>
          <input v-model="list.name" @input="callbackUpdate" />
        </b-col>
        <b-col md="1" class="align-center sort-trigger">
          <i class="nav-icon i-Circular-Point" @click="sortTasks('hours')"></i>
        </b-col>
        <b-col md="1" class="align-center sort-trigger">
          <i
            class="nav-icon i-Circular-Point"
            @click="sortTasks('difficulty')"
          ></i>
        </b-col>
        <b-col md="2" class="align-center sort-trigger">
          <i
            class="nav-icon i-Circular-Point"
            @click="sortTasks('priority')"
          ></i>
        </b-col>
        <b-col md="2">
          <i v-if="!fixed" class="nav-icon i-Remove f-r" @click="archive"></i>
        </b-col>
      </b-row>
    </div>
    <div :id="list.identifier" class="list-group">
      <ListItem
        v-for="(task, taskindex) in list.tasks"
        :key="task.identifier"
        v-model="list.tasks[taskindex]"
        :priority="task.priority"
        @item-update="update"
      />
    </div>
    <div class="list-group-item totals">
      <b-row>
        <b-col md="6"></b-col>
        <b-col md="1">
          <b class="hours">{{ totalHours }}</b>
        </b-col>
        <b-col md="5"> </b-col>
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
      sortableRef: null,
      updateTimer: null,
      hourSort: false,
      difficultySort: false
    }
  },
  computed: {
    list: {
      get() {
        return this.value
      }
    },
    totalHours() {
      return Object.values(this.list.tasks).reduce(
        (total, { hours }) => total + hours,
        0
      )
    }
  },
  mounted() {
    this.sortableRef = new Sortable(
      document.getElementById(this.list.identifier),
      {
        group: "shared",
        onRemove: event => {
          this.$emit("item-moved", {
            listFrom: event.from.id,
            listTo: event.to.id,
            taskId: event.item.id
          })
        },
        onSort: event => {
          if (event.from.id == event.to.id) {
            this.onTaskMove(event.oldIndex, event.newIndex)
          }
        }
      }
    )
  },
  methods: {
    update: function() {
      this.$emit("list-update")
    },
    callbackUpdate: function() {
      if (this.updateTimer != null) {
        clearTimeout(this.updateTimer)
      }
      this.updateTimer = setTimeout(() => {
        this.update()
      }, 5000)
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
      this.update()
    },
    archive: function() {
      this.$dialog({
        title: `Archive ${this.list.name}`,
        content: "You're about to archive this list?",
        btns: [
          {
            label: "Go ahead",
            color: "#3f51b5",
            callback: () => {
              this.list.archived = true
              this.update()
            }
          },
          {
            label: "Cancel",
            color: "#444",
            ghost: true
          }
        ]
      })
    },
    sumHours: function(total, task) {
      console.log(task)
      return total + task.hours
    },
    sortTasks: function(sortProperty) {
      function compareDifficulty(asc) {
        return function(a, b) {
          if (
            (a.difficulty == "easy" ? 1 : a.difficulty == "medium" ? 2 : 3) >
            (b.difficulty == "easy" ? 1 : b.difficulty == "medium" ? 2 : 3)
          )
            return asc ? 1 : -1
          if (
            (b.difficulty == "easy" ? 1 : b.difficulty == "medium" ? 2 : 3) >
            (a.difficulty == "easy" ? 1 : a.difficulty == "medium" ? 2 : 3)
          )
            return asc ? -1 : 1
          return 0
        }
      }
      function comparePriority(asc) {
        return function(a, b) {
          if (
            (a.priority == "low" ? 1 : a.priority == "medium" ? 2 : 3) >
            (b.priority == "low" ? 1 : b.priority == "medium" ? 2 : 3)
          )
            return asc ? 1 : -1
          if (
            (b.priority == "low" ? 1 : b.priority == "medium" ? 2 : 3) >
            (a.priority == "low" ? 1 : a.priority == "medium" ? 2 : 3)
          )
            return asc ? -1 : 1
          return 0
        }
      }
      switch (sortProperty) {
        case "hours":
          this.hourSort = !this.hourSort
          this.list.tasks = this.lodash.orderBy(
            this.list.tasks,
            "hours",
            this.hourSort ? "asc" : "desc"
          )
          break
        case "difficulty":
          this.difficultySort = !this.difficultySort
          return this.list.tasks.sort(compareDifficulty(this.difficultySort))
        case "priority":
          this.prioritySort = !this.prioritySort
          return this.list.tasks.sort(comparePriority(this.prioritySort))
      }
    },
    onTaskMove: function(oldIndex, newIndex) {
      while (oldIndex < 0) {
        oldIndex += this.list.tasks.length
      }
      while (newIndex < 0) {
        newIndex += this.list.tasks.length
      }
      this.list.tasks.splice(
        newIndex,
        0,
        this.list.tasks.splice(oldIndex, 1)[0]
      )
      return this.list.tasks
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
.totals .hours {
  float: right;
  margin-right: 15px;
}
.list-header {
  font-size: 1.01625rem;
  margin-bottom: 0.2rem;
}
.sort-trigger {
  opacity: 0;
  transition: 0.3s;
}
.sort-trigger:hover {
  opacity: 1;
}
</style>
