<template>
  <div
    :class="[isSideBarOpen ? 'sidenav-open' : '']"
    class="sidebar-indigo app-admin-wrap layout-sidebar-compact clearfix"
  >
    <compactSidebar></compactSidebar>
    <!-- end-leftsidebar -->
    <div class="main-content-wrap d-flex flex-column">
      <compactTopbar></compactTopbar>
      <transition name="page" mode="out-in">
        <nuxt style="margin-top: 100px" />
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
      isSideBarOpen: "sidebar/isOpen"
    })
  }
}
</script>
