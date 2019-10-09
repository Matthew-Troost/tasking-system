<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="Steve"
      title="Steve"
    >
      <template slot="links">
        <div class="avatar">
          <img :src="matthewt" />
          <h4>Matthew Troost</h4>
        </div>
        <hr class="my-3" />
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'chart-line',
            path: '/dashboard'
          }"
        />
        <sidebar-item
          :link="{
            name: 'Team',
            icon: 'hand-peace',
            path: '/team'
          }"
        />
        <sidebar-item
          :link="{
            name: 'Projects',
            icon: 'code',
            path: '/projects'
          }"
        />
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <div @click="toggleSidebar">
        <FadeTransition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <div style="margin: 30px 50px 50px 50px">
            <nuxt />
          </div>
        </FadeTransition>
        <!-- <content-footer v-if="!$route.meta.hideFooter"></content-footer> -->
      </div>
    </div>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions"
import matthewt from "../assets/images/avatars/matthewt.svg"

export default {
  components: {
    FadeTransition
  },
  data() {
    return {
      sidebarBackground: "vue", //vue|blue|orange|green|red|primary
      matthewt
    }
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false)
      }
    }
  }
}
</script>
<style scoped>
.avatar {
  text-align: center;
  width: 100%;
  height: unset;
  background-color: transparent;
  display: block;
}
.avatar img {
  width: 40%;
}

.avatar h4 {
  margin-top: 10px;
}
</style>
