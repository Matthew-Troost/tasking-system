<template>
  <div class="container">
    <div :id="`pp_${userId}`">
      <img v-lazy="url" alt :style="styles" />
      <h6 v-if="!hideNickName">{{ displayName }}</h6>
    </div>
    <b-popover
      v-if="hideNickName"
      :target="`pp_${userId}`"
      triggers="hover focus"
      :content="displayName"
      placement="top"
    ></b-popover>
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
      default: ""
    },
    userId: {
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
    ...mapState({
      users: state => state.users.all
    }),
    user() {
      return this.users.find(user => {
        return user.id == this.userId
      })
    },
    url() {
      if (this.userId === "") return this.imageUrl
      if (this.user) return this.user.avatar
      return null
    },
    displayName() {
      if (this.userId === "") return this.nickName
      if (this.user) return this.user.nickname
      return null
    },
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
  width: fit-content;
  display: inline-block;
  text-align: center;
  padding: 0;
}
h6 {
  margin: 0;
}
</style>
