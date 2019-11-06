<template>
  <div class="container">
    <img v-lazy="url" alt />
    <h6>{{ displayName }}</h6>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  layout: "default",
  name: "ProjectAvatar",
  props: {
    imageUrl: {
      type: String,
      default: "/_nuxt/assets/images/avatars/blank-profile-picture.png"
    },
    userId: {
      type: String,
      default: ""
    },
    nickName: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState({
      users: state => state.users.all
    }),
    user() {
      return this.users.filter(user => {
        return user.id == this.userId
      })
    },
    url() {
      if (this.userId === "") return this.imageUrl
      if (this.user[0]) return this.user[0].avatar
      return null
    },
    displayName() {
      if (this.userId === "") return this.nickName
      if (this.user[0]) return this.user[0].nickname
      return null
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
