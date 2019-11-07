<template>
  <div>
    <h5>
      <i v-if="!fixed" class="nav-icon i-Add" @click="addTask"></i>
      <input v-model="list.name" @input="callbackUpdate" />
      <i v-if="!fixed" class="nav-icon i-Remove f-r" @click="archive"></i>
    </h5>
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
          <b>{{ totalHours }}</b>
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
      updateTimer: null
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
        title: "Archive ...",
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
