<template>
  <div
    :class="[isSideBarOpen ? 'sidenav-open' : '']"
    class="sidebar-indigo app-admin-wrap layout-sidebar-compact clearfix"
  >
    <compactSidebar></compactSidebar>
    <!-- end-leftsidebar -->
    <div class="main-content-wrap d-flex flex-column">
      <compactTopbar></compactTopbar>
      <transition name="fade" mode="out-in">
        <nuxt id="page-container" />
      </transition>
    </div>
  </div>
</template>
<script>
import compactTopbar from "./compactTopbar"
import compactSidebar from "./compactSidebar"
import { mapGetters } from "vuex"

export default {
  components: {
    compactTopbar,
    compactSidebar
  },
  computed: {
    ...mapGetters({
      isSideBarOpen: "sidebar/isOpen",
      loading: "loading"
    })
  },
  head() {
    return {
      title: "Scheduler"
    }
  }
}
</script>
<style scoped>
img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
}
#page-container {
  margin-top: 100px;
}
</style>
