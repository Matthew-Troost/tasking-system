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
          <i
            v-if="!fixed"
            v-b-popover.hover.topleft="'Archive'"
            class="nav-icon i-Remove f-r"
            @click="archive"
          ></i>
          <i
            v-if="tasks.length > 0"
            v-b-toggle="`list-collapse_${list.identifier}`"
            v-b-popover.hover.topleft="visible ? 'Collapse' : 'Reveal'"
            :class="`nav-icon i-Arrow-${visible ? 'Up' : 'Down'}-in-Circle f-r`"
          ></i>
        </b-col>
      </b-row>
    </div>
    <b-collapse
      :id="`list-collapse_${list.identifier}`"
      :visible="visible"
      class="mt-2"
      @hide="onCollapse(false)"
      @show="onCollapse(true)"
    >
      <div :id="list.identifier" class="list-group">
        <ListItem
          v-for="task in tasks.filter(task => {
            return applicable(task)
          })"
          :key="task.identifier"
          v-model="tasks[tasks.indexOf(task)]"
          :priority="task.priority"
          :list-name="list.name"
          :update-function="updateFunction"
          @item-update="callbackUpdate"
          @notify="slackNotify"
        />
      </div>
    </b-collapse>
    <div class="list-group-item totals">
      <b-row>
        <b-col md="3">
          <b-progress
            v-if="!fixed"
            :max="tasks.length"
            height="10px"
            class="progress"
          >
            <b-progress-bar
              variant="success"
              class="progress-text"
              :value="completedTasks"
              :label="
                `${(
                  (completedTasks / (tasks.length == 0 ? 1 : tasks.length)) *
                  100
                ).toFixed()}%`
              "
            ></b-progress-bar>
          </b-progress>
        </b-col>
        <b-col md="3"> </b-col>
        <b-col md="1">
          <b class="hours">{{ totalHours }}</b>
        </b-col>
        <b-col md="5">
          <b-badge v-if="!visible" pill variant="dark m-2 f-r total-pill"
            >Collapsed</b-badge
          >
        </b-col>
      </b-row>
    </div>
    <transition name="fade">
      <div
        v-show="trash.show"
        :id="`${list.identifier}-trash`"
        class="mb-20 trash-grid"
      >
        drop here to delete
      </div>
    </transition>
  </div>
</template>
<script>
import ListItem from "./listItem"
import Sortable from "sortablejs"
import Utils from "@/utils"
import { mapGetters } from "vuex"

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
    projectid: {
      type: String,
      default: null
    },
    fixed: {
      type: Boolean,
      deafult: false
    },
    userid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      sortableRef: null,
      trashCanRef: null,
      updateTimer: null,
      hourSort: false,
      difficultySort: false,
      tasksProxy: [],
      trash: {
        show: false,
        timeout: null
      },
      visible: true,
      collapsedPriorDrag: false
    }
  },
  computed: {
    ...mapGetters({
      getCurrentUser: "users/getCurrentUser",
      getProjectById: "projects/getById"
    }),
    list() {
      return this.value
    },
    tasks: {
      get() {
        return this.list.tasks
      },
      set(val) {
        this.tasksProxy = val
      }
    },
    totalHours() {
      let total = 0
      this.tasks.forEach(task => {
        if (this.applicable(task)) total += task.hours
      })
      return total
    },
    completedTasks() {
      return this.tasks.filter(task => {
        return task.completed
      }).length
    }
  },
  mounted() {
    this.sortableRef = new Sortable(
      document.getElementById(this.list.identifier),
      {
        group: this.projectid,
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
        },
        onStart: () => {
          this.$emit("dragging-started")
          document.body.style.cursor = "grabbing"
          this.trash.timeout = setTimeout(() => {
            this.trash.show = true
          }, 500)
        },
        onEnd: () => {
          this.$emit("dragging-stopped")
          document.body.style.cursor = "auto"
          clearTimeout(this.trash.timeout)
          this.trash.show = false
        },
        forceFallback: true,
        animation: 150
      }
    )

    this.trashCanRef = new Sortable(
      document.getElementById(`${this.list.identifier}-trash`),
      {
        group: this.projectid,
        animation: 150
      }
    )

    this.visible =
      this.tasks.find(task => {
        return !task.completed
      }) != null || !this.tasks.length
  },
  methods: {
    applicable(task) {
      if (this.userid) {
        if (task.users.includes(this.userid)) return true
        else return false
      }
      return true
    },
    update: function() {
      this.updateFunction(this.projectid)
    },
    onSeperateListDragging(isDragging) {
      if (isDragging) {
        if (!this.visible) this.collapsedPriorDrag = true
        this.visible = true
      } else {
        if (this.collapsedPriorDrag) this.visible = false
        this.collapsedPriorDrag = false
      }
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
      let today = new Date()
      this.tasks.push({
        identifier: Utils.generateGuid(),
        completed: false,
        description: "",
        difficulty: "easy",
        hours: 1,
        startdate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0
          )
        ),
        enddate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59
          )
        ),
        priority: "low",
        users: []
      })
      this.update()
    },
    slackNotify(details) {
      switch (details.slackfunction) {
        case this.$slack.functions.TASK_NOTIFICATION.ASSIGNED:
          this.$slack
            .sendTaskAssignedMessage(
              details.props.assignee,
              this.getProjectById(this.projectid),
              details.props.task,
              this.getCurrentUser,
              this.list.name
            )
            .catch(error => this.displaySlackError(error))
          break
        case this.$slack.functions.TASK_NOTIFICATION.COMPLETED:
          this.$slack.sendTaskCompletedMessage(
            this.getProjectById(this.projectid),
            details.props.task,
            this.getCurrentUser,
            this.list.name
          )
          break
        case this.$slack.functions.TASK_NOTIFICATION.NOTE_ADDED:
          this.$slack
            .sendTaskNoteNotification(
              this.getCurrentUser,
              details.props.task.description,
              this.getProjectById(this.projectid).name,
              details.props.emails,
              this.list.name,
              details.props.content
            )
            .catch(error => this.displaySlackError(error))
          break
        case this.$slack.functions.TASK_NOTIFICATION.UPLOAD_ADDED:
          this.$slack.sendTaskUploadNotification(
            this.getCurrentUser,
            details.props.task.description,
            this.getProjectById(this.projectid).name,
            details.props.emails,
            this.list.name
          )
          break
      }
    },
    displaySlackError(error) {
      this.$toast.error(
        `There was an issue sending slack communications: ${error}`
      )
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
    onCollapse(value) {
      this.visible = value
    },
    sumHours: function(total, task) {
      return total + task.hours
    },
    sortTasks: function(sortProperty) {
      function compareHours(asc) {
        return function(a, b) {
          if (a.hours > b.hours) return asc ? 1 : -1
          if (b.hours > a.hours) return asc ? -1 : 1
          return 0
        }
      }
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
          this.tasks.sort(compareHours(this.hourSort))
          break
        case "difficulty":
          this.difficultySort = !this.difficultySort
          return this.tasks.sort(compareDifficulty(this.difficultySort))
        case "priority":
          this.prioritySort = !this.prioritySort
          return this.tasks.sort(comparePriority(this.prioritySort))
      }
    },
    onTaskMove: function(oldIndex, newIndex) {
      while (oldIndex < 0) {
        oldIndex += this.tasks.length
      }
      while (newIndex < 0) {
        newIndex += this.tasks.length
      }
      this.tasks.splice(newIndex, 0, this.tasks.splice(oldIndex, 1)[0])
      return this.tasks
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
  width: 90%;
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
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
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
.trash-grid {
  text-align: center;
  font-size: 14px;
  color: red;
  border: 1px solid;
  border-radius: 5px;
  background-color: #ffbdbd;
  padding: 7px;
}
.mb-20 {
  margin-bottom: 20px !important;
}

.highlight {
  background-color: #3f51b554;
  transition: background-color 1s linear;
}
.no-highlight {
  background-color: transparent;
}
.progress-text {
  font-size: 7px;
}
.progress {
  max-width: 200px;
  margin-top: 4px;
}
.total-pill {
  margin: 4px 0px 0px !important;
}
</style>
