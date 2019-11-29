<template>
  <div>
    <transition name="fade">
      <b-alert
        v-if="hardError"
        show
        variant="danger"
        class="error col-md-6 mt-1"
        >{{ errorMessage }}</b-alert
      >
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    hardError: { type: Boolean, default: false },
    errorMessage: { type: String, default: "" }
  }
}
</script>

<style scoped></style>
