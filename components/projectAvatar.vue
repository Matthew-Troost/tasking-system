<template>
  <div class="container">
    <div :id="id">
      <img v-if="onlyInitials" ref="avatarImage" alt :style="styles" />
      <img v-else v-lazy="url" alt :style="styles" />
      <h6 v-if="!hideNickName">{{ displayName }}</h6>
    </div>

    <b-popover
      v-if="hideNickName && onlyInitials"
      :target="id"
      triggers="hover focus"
      :content="displayName"
      placement="top"
    ></b-popover>
  </div>
</template>
<script>
import { mapState } from "vuex"
import AvatarInitials from "avatar-initials"
import Utils from "@/utils"

export default {
  layout: "default",
  name: "ProjectAvatar",
  props: {
    onlyInitials: {
      type: Boolean,
      default: false
    },
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
    },

    borderRadius: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      id: Utils.generateGuid()
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
        width: `${this.width}px`,
        height: `${this.width}px`,
        borderRadius: `${this.borderRadius}%`
      }
    },
    userInitials() {
      return `${this.user.first_name
        .substr(0, 1)
        .toUpperCase()} ${this.user.last_name
        .substr(this.user.last_name.length - 1, this.user.last_name.length)
        .toUpperCase()}`
    }
  },
  mounted() {
    if (this.onlyInitials) {
      var test = new AvatarInitials(this.$refs.avatarImage, {
        useGravatar: false,
        initials: this.userInitials,
        initial_fg: "black",
        initial_font_family: "Nunito,sans-serif",
        initial_weight: 400
      })
      //this needs to be here to fix weird bug on overview page
      test.initial_size = 10
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
