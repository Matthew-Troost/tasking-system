<template>
  <div class="list-group-item">
    <b-row>
      <b-col md="6">
        <label class="checkbox checkbox-primary" style="display: inline">
          <input
            v-model="checked"
            type="checkbox"
            :disabled="value.completed"
            :value="value.completed"
            @change="update()"
          />
          <span class="checkmark"></span>
        </label>
        <input
          ref="description_input"
          :value="value.description"
          placeholder="..."
          style="padding-right: 20px; width: 100%"
          @input="update()"
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
              @change="update()"
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
          <b-col md="4"></b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
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
      endDateProxy: null
    }
  },
  computed: {
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
    }
  },
  watch: {
    startDateProxy: {
      handler() {
        this.update()
      }
    },
    endDateProxy: {
      handler() {
        this.update()
      }
    },
    priority: {
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
        )
      })
      this.updateParent()
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
        this.$parent.updateParent()
      }, 5000)
    }
  }
}
</script>
<style scoped>
input {
  border: none;
}
input:focus {
  outline: none;
}
</style>
