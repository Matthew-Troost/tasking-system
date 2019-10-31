<template>
  <div
    :class="[{ completed: value.completed }, 'list-group-item']"
    class="list-group-item"
  >
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
          ref="description_input"
          :value="value.description"
          placeholder="..."
          style="padding-right: 20px; width: 100%"
          @input="update"
        />
      </b-col>
      <b-col md="6">
        <b-row style="text-align: center">
          <b-col
            md="4"
            style="border-right: 1px solid #cacaca; border-left: 1px solid #cacaca"
          >
            <v-date-picker
              v-model="range"
              :popover="{ placement: 'top', visibility: 'click' }"
              mode="range"
              title-position="right"
              :masks="{ input: 'DD MMM' }"
              class="datepicker-sm"
            />
          </b-col>
          <b-col md="4" style="border-right: 1px solid #cacaca">
            <b-dropdown
              id="dropdown-1"
              :variant="
                priority == 'high'
                  ? 'danger'
                  : priority == 'medium'
                  ? 'warning'
                  : 'success'
              "
              :text="priority + ' priority'"
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
              placeholder="Assignee"
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
      priority: this.value.priority,
      checkedProxy: false,
      updateTimer: null,
      startDateProxy: null,
      endDateProxy: null,
      tag: "",
      tagsProxy: []
    }
  },
  computed: {
    ...mapState({
      users: state => state.users.all
    }),
    checked: {
      get() {
        return this.value.completed
      },
      set(val) {
        this.checkedProxy = val
      }
    },
    range: {
      get() {
        return {
          start: this.value.startdate.toDate(),
          end: this.value.enddate.toDate()
        }
      },
      set(val) {
        this.startDateProxy = val.start
        this.endDateProxy = val.end
      }
    },
    tags: {
      get() {
        let test = []
        // eslint-disable-next-line no-unused-vars
        this.value.users.forEach(userid => {
          test.push({ id: "plR4igHjKHIQVEIJyz1l", text: "Matt" })
        })
        // console.log(
        //   `${this.value.description}, users count: ${this.value.users}`
        // )
        return test
        //return [{ id: "plR4igHjKHIQVEIJyz1l", text: "Matt" }]
      },
      set(val) {
        console.log("setting..")
        this.tagsProxy = val
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
    priority: {
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
        description: this.$refs.description_input.value,
        priority: this.priority,
        startdate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          this.startDateProxy
        ),
        enddate: this.$store.state.firebase.firestore.Timestamp.fromDate(
          this.endDateProxy
        ),
        users: this.tagsProxy.map(tag => {
          return tag.id
        }),
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
</style>
