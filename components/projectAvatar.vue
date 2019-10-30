<template>
  <div class="container">
    <img src="@/assets/images/avatars/matthewt.svg" alt :style="styles" />
    <h6 v-if="!hideNickName">{{ nickName }}</h6>
  </div>
</template>
<script>
export default {
  layout: "default",
  name: "ProjectAvatar",
  props: {
    imageUrl: {
      type: String,
      default: ""
    },
    nickName: {
      type: String,
      default: ""
    },
    hideNickName: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    }
  },
  computed: {
    styles() {
      return {
        "max-width": "unset",
        width: `${this.width}px`
      }
    }
  }
}
</script>
<style scoped>
.container {
  width: min-content;
  display: inline-block;
  text-align: center;
  padding: 0;
}
h6 {
  margin: 0;
}
</style>
