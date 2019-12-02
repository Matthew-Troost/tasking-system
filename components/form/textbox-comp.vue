<template>
  <div>
    <b-form-group :label="label">
      <b-form-input
        v-model="value"
        fade="true"
        class="mb-2"
        :class="{
          'custom-error': softError
        }"
        autocomplete="off"
        :label="label"
        :placeholder="placeholder"
        @input="updateValue"
      >
      </b-form-input>
      <error-comp
        :hard-error="hardError"
        :error-message="errorMessage"
      ></error-comp>
    </b-form-group>
  </div>
</template>

<script>
import errorComp from "@/components/form/error-comp"
export default {
  components: {
    errorComp
  },
  props: {
    hardError: {
      type: Boolean,
      default: false
    },
    softError: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    updateValue() {
      this.$emit("input", this.value)
    }
  }
}
</script>
