<template>
  <div
    :id="value.identifier"
    :class="[{ completed: value.completed }, 'list-group-item']"
  >
    <b-row>
      <b-col md="6" style="display:inherit">
        <label class="checkbox checkbox-primary" style="display: inline">
          <input
            v-model="checked"
            type="checkbox"
            :value="value.completed"
            @change="modelChange"
          />
          <span class="checkmark"></span>
        </label>
        <input
          ref="description"
          :value="value.description"
          placeholder="..."
          style="padding-right: 20px; width: 100%"
          class="input-grab"
          @input="modelChange"
        />
        <b-badge
          v-show="extrasCount > 0"
          class="extrasCount"
          pill
          variant="primary"
          >{{ extrasCount }}</b-badge
        >
        <i
          v-b-toggle="`extra_${value.identifier}`"
          :class="
            `${
              extrasExpanded || extrasCount > 0 ? 'extras-trigger-active' : ''
            } nav-icon i-Folder extras-trigger`
          "
        />
      </b-col>

      <b-col md="6" class="dragable">
        <b-row style="text-align: center">
          <b-col md="2" style="border-left: 1px solid #cacaca">
            <input
              ref="hours"
              class="full-width text-right"
              placeholder="hours"
              type="number"
              :value="value.hours"
              @input="modelChange"
            />
          </b-col>
          <b-col
            md="2"
            style="border-right: 1px solid #cacaca; border-left: 1px solid #cacaca"
          >
            <b-dropdown size="sm" varient="outline" class="bd-no-border">
              <template v-slot:button-content>
                <span :class="`zap-${difficulty}`"></span>
              </template>
              <b-dropdown-item @click="difficulty = 'easy'"
                >Easy</b-dropdown-item
              >
              <b-dropdown-item @click="difficulty = 'medium'"
                >Medium</b-dropdown-item
              >
              <b-dropdown-item @click="difficulty = 'difficult'"
                >Difficult</b-dropdown-item
              >
            </b-dropdown>
          </b-col>
          <b-col md="4" style="border-right: 1px solid #cacaca">
            <b-dropdown
              :variant="
                priority == 'high'
                  ? 'danger'
                  : priority == 'medium'
                  ? 'warning'
                  : 'success'
              "
              :text="`${priority} priority`"
              size="sm"
            >
              <b-dropdown-item @click="priority = 'low'">Low</b-dropdown-item>
              <b-dropdown-item @click="priority = 'medium'"
                >Medium</b-dropdown-item
              >
              <b-dropdown-item @click="priority = 'high'">High</b-dropdown-item>
            </b-dropdown>
          </b-col>
          <b-col md="4">
            <VueTagsInput
              v-model="tag"
              :tags="tags"
              :autocomplete-items="items"
              :add-only-from-autocomplete="true"
              class="tags-input list-item-tags-input"
              :placeholder="tags.length ? '' : 'assignee'"
              :max-tags="3"
              @tags-changed="newTags => (tags = newTags)"
            >
              <div
                slot="autocomplete-item"
                slot-scope="props"
                @click="props.performAdd(props.item)"
              >
                {{ props.item.text }}
              </div>
              <div slot="tag-center" slot-scope="props">
                <ProjectAvatar
                  image-url="@/assets/images/avatars/matthewt.svg"
                  :user-id="props.tag.id"
                  :hide-nick-name="true"
                  :width="24"
                  :nick-name="props.tag.text"
                  :height="24"
                  :only-initials="true"
                />
              </div>
            </VueTagsInput>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-collapse
      :id="`extra_${value.identifier}`"
      accordion="tasks"
      class="extras"
      @show="onExtrasToggle"
      @hide="onExtrasToggle"
    >
      <ListItemExtras
        ref="taskExtras"
        :taskid="value.identifier"
        @noteAdded="slackNotify"
        @documentUploaded="slackNotify"
      />
    </b-collapse>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import VueTagsInput from "@johmun/vue-tags-input"
import ProjectAvatar from "@/components/projectAvatar"
import ListItemExtras from "./listItemExtras"

export default {
  components: {
    VueTagsInput,
    ProjectAvatar,
    ListItemExtras
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    updateFunction: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      priorityProxy: this.value.priority,
      difficultyProxy: this.value.difficulty,
      checkedProxy: this.value.completed,
      updateTimer: null,
      tag: "",
      tagsProxy: this.value.users,
      extrasExpanded: false,
      listName: ""
    }
  },

  computed: {
    ...mapState({
      users: state => state.users.all
    }),
    ...mapGetters({
      getExtras: "taskextras/getForTask",
      getCurrentUser: "users/getCurrentUser",
      getProjectById: "projects/getById"
    }),
    extrasCount() {
      let extras = this.getExtras(this.value.identifier)
      return extras == null ? 0 : extras.notes.length + extras.uploads.length
    },
    priority: {
      get() {
        return this.value.priority
      },
      set(val) {
        console.log("setting priority")
        this.priorityProxy = val
      }
    },
    checked: {
      get() {
        return this.value.completed
      },
      set(val) {
        if (val) {
          this.slackNotify(this.$slack.functions.TASK_NOTIFICATION.COMPLETED)
        }
        this.checkedProxy = val
      }
    },
    difficulty: {
      get() {
        return this.value.difficulty
      },
      set(val) {
        this.difficultyProxy = val
      }
    },
    tags: {
      get() {
        let user_tags = []
        if (this.value.users) {
          this.value.users.forEach(userid => {
            user_tags.push({
              id: userid,
              text: this.users.find(user => user.id == userid).nickname
            })
          })
        }
        return user_tags
      },
      set(val) {
        if (val.length > this.tags.length) {
          this.slackNotify(this.$slack.functions.TASK_NOTIFICATION.ASSIGNED, {
            assignee: this.users.find(x => x.id == val[val.length - 1].id)
          })
        }
        this.tagsProxy = val.map(tag => {
          return tag.id
        })
      }
    },
    items() {
      return this.users
        .map(user => {
          return {
            id: user.id,
            text: user.nickname
          }
        })
        .filter(i => {
          return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1
        })
    }
  },
  watch: {
    priorityProxy: {
      handler() {
        this.modelChange()
      }
    },
    difficultyProxy: {
      handler() {
        this.modelChange()
      }
    },
    tagsProxy: {
      handler() {
        this.modelChange()
      }
    }
  },
  created() {
    this.listName = this.$parent.list.name
  },
  methods: {
    modelChange() {
      this.$emit("input", {
        completed: this.checkedProxy,
        description: this.$refs.description.value,
        hours: parseInt(this.$refs.hours.value),
        difficulty: this.difficultyProxy,
        priority: this.priorityProxy,
        startdate: this.value.startdate,
        enddate: this.value.enddate,
        users: this.tagsProxy == null ? [] : this.tagsProxy,
        identifier: this.value.identifier
      })
      this.$emit("item-update")
    },
    updatePriority(priority) {
      this.priority = priority
      this.modelChange()
    },
    onExtrasToggle: function() {
      this.extrasExpanded = !this.extrasExpanded
    },
    slackNotify(slackfunction, props) {
      switch (slackfunction) {
        case this.$slack.functions.TASK_NOTIFICATION.ASSIGNED:
          this.$slack
            .sendTaskAssignedMessage(
              props.assignee,
              this.getProjectById(this.$parent.projectid),
              this.value,
              this.getCurrentUser,
              this.$parent.list.name
            )
            .catch(error => this.displaySlackError(error))
          break
        case this.$slack.functions.TASK_NOTIFICATION.COMPLETED:
          this.$slack.sendTaskCompletedMessage(
            this.getProjectById(this.$parent.projectid),
            this.value,
            this.getCurrentUser,
            this.$parent.list.name
          )
          break
        case this.$slack.functions.TASK_NOTIFICATION.NOTE_ADDED:
          console.log({
            user: this.getCurrentUser,
            task: this.value.description,
            projetc: this.getProjectById(this.$parent.projectid).name,
            assigned: this.users
              .filter(x => this.tagsProxy.includes(x.id))
              .map(t => t.email),
            list: this.$parent.list.name
          })
          this.$slack
            .sendTaskNoteNotification(
              this.getCurrentUser,
              this.value.description,
              this.getProjectById(this.$parent.projectid).name,
              this.users
                .filter(x => this.tagsProxy.includes(x.id))
                .map(t => t.email),
              this.$parent.list.name,
              props.content
            )
            .catch(error => this.displaySlackError(error))
          break
        case this.$slack.functions.TASK_NOTIFICATION.UPLOAD_ADDED:
          this.$slack.sendTaskUploadNotification(
            this.getCurrentUser,
            this.value.description,
            this.getProjectById(this.$parent.projectid).name,
            this.users
              .filter(x => this.tagsProxy.includes(x.id))
              .map(t => t.email),
            this.$parent.list.name
          )
          break
      }
    },
    displaySlackError(error) {
      this.$toast.warning(
        `There was an issue sending slack communications: ${error}`
      )
    }
  }
}
</script>
<style scoped>
input {
  border: none;
  background: transparent;
}
input:focus {
  outline: none;
}
.completed {
  background-color: #eaeaea;
  opacity: 0.5;
}
.zap-easy::before {
  content: "\26A1";
}
.zap-medium::before {
  content: "\26A1 \26A1";
}
.zap-difficult::before {
  content: "\26A1 \26A1 \26A1";
}
.extras-trigger {
  cursor: pointer;
  margin-top: 5px;
  opacity: 0;
  transition: 0.3s;
}
.extras-trigger:hover {
  opacity: 1;
}
.extras-trigger-active {
  opacity: 1;
}
.extras {
  margin-top: 10px;
}
.extrasCount {
  padding: 3px;
  height: fit-content;
}
.dragable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab !important;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}
.input-grab:active {
  cursor: grabbing !important;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}

.dragable:active {
  cursor: grabbing !important;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}
</style>
