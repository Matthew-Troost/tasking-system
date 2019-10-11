<template>
  <div class="container">
    <img src="@/assets/images/avatars/matthewt.svg" alt />
    <h6>{{ nickName }}</h6>
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
img {
  width: 40px;
  max-width: unset;
}
h6 {
  margin: 0;
}
</style>
