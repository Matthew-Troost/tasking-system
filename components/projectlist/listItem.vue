<template>
  <div class="list-group-item">
    <b-row>
      <b-col md="6">
        <label class="checkbox checkbox-primary" style="display: inline">
          <input type="checkbox" />
          <span class="checkmark"></span>
        </label>
        <input value="testing..." style="padding-right: 20px; width: 100%" />
      </b-col>
      <b-col md="6">
        <b-row style="text-align: center">
          <b-col
            md="4"
            style="border-right: 1px solid #cacaca; border-left: 1px solid #cacaca"
          >
            <v-date-picker
              v-model="range"
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
                dropdown == 'high'
                  ? 'danger'
                  : dropdown == 'medium'
                  ? 'warning'
                  : 'success'
              "
              :text="dropdown + ' priority'"
              size="sm"
            >
              <b-dropdown-item @click="updatePriority('low')"
                >Low</b-dropdown-item
              >
              <b-dropdown-item @click="updatePriority('medium')"
                >Medium</b-dropdown-item
              >
              <b-dropdown-item @click="updatePriority('high')"
                >High</b-dropdown-item
              >
            </b-dropdown>
          </b-col>
          <b-col md="4"> </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdown: "low",
      range: {
        start: new Date(),
        end: new Date()
      }
    }
  },
  methods: {
    updatePriority: function(priority) {
      this.dropdown = priority
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
