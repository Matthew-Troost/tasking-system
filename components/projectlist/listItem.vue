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
      <b-col md="6">
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
      <ListItemExtras ref="taskExtras" :taskid="value.identifier" />
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
      extrasExpanded: false
    }
  },
  computed: {
    ...mapState({
      users: state => state.users.all
    }),
    ...mapGetters({
      getExtras: "taskextras/getForTask"
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
              text: this.users.filter(user => user.id == userid)[0].nickname
            })
          })
        }

        return user_tags
      },
      set(val) {
        this.tagsProxy = val.map(tag => {
          return tag.id
        })
      }
    },
    items() {
      return this.$store.state.users.all
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
      console.log("calling parent update")

      if (this.updateTimer != null) {
        clearTimeout(this.updateTimer)
      }
      this.updateTimer = setTimeout(() => {
        this.$emit("item-update")
      }, 5000)
    },
    updatePriority(priority) {
      this.priority = priority
      this.modelChange()
    },
    onExtrasToggle: function() {
      this.extrasExpanded = !this.extrasExpanded
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
</style>
