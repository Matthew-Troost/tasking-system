<template>
  <div :class="[{ completed: value.completed }, 'list-group-item']">
    <b-row>
      <b-col md="6" style="display:inherit">
        <label class="checkbox checkbox-primary" style="display: inline">
          <input
            v-model="checked"
            type="checkbox"
            :value="value.completed"
            @change="update"
          />
          <span class="checkmark"></span>
        </label>
        <input
          ref="description"
          :value="value.description"
          placeholder="..."
          style="padding-right: 20px; width: 100%"
          @input="update"
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
              @input="update"
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
              <div slot="tag-center">
                <ProjectAvatar
                  image-url="@/assets/images/avatars/matthewt.svg"
                  :hide-nick-name="true"
                  :width="24"
                  nick-name="Matt"
                />
              </div>
            </VueTagsInput>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex"
import VueTagsInput from "@johmun/vue-tags-input"
import ProjectAvatar from "@/components/projectAvatar"

export default {
  components: {
    VueTagsInput,
    ProjectAvatar
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
      tagsProxy: this.value.users
    }
  },
  computed: {
    ...mapState({
      users: state => state.users.all
    }),
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
        this.value.users.forEach(userid => {
          user_tags.push({
            id: userid,
            text: this.users.filter(user => user.id == userid)[0].nickname
          })
        })
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
        this.update()
      }
    },
    difficultyProxy: {
      handler() {
        this.update()
      }
    },
    tagsProxy: {
      handler() {
        this.update()
      }
    }
  },
  methods: {
    update() {
      this.$emit("input", {
        completed: this.checkedProxy,
        description: this.$refs.description.value,
        hours: this.$refs.hours.value,
        difficulty: this.difficultyProxy,
        priority: this.priorityProxy,
        startdate: this.value.startdate,
        enddate: this.value.enddate,
        users: this.tagsProxy,
        identifier: this.value.identifier
      })
      console.log("calling parent update")
      //this.updateParent()
    },
    updatePriority(priority) {
      this.priority = priority
      this.update()
    },
    updateParent() {
      //we dont want to update on every keyup, so use a countdown instead
      if (this.updateTimer != null) {
        clearTimeout(this.updateTimer)
      }
      this.updateTimer = setTimeout(() => {
        //change this to emit and handle on the parent side
        this.$parent.updateParent()
      }, 5000)
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
</style>
