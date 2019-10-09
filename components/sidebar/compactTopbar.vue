<template>
  <div class="main-header">
    <div class="logo">
      <!-- <img src="@/assets/images/logo.png" alt /> -->
    </div>

    <div class="menu-toggle" @click="compactSideBarToggle">
      <div></div>
      <div></div>
      <div></div>
    </div>

    <div style="margin: auto"></div>

    <div class="header-part-right">
      <!-- Full screen toggle -->
      <i
        class="i-Full-Screen header-icon d-none d-sm-inline-block"
        @click="handleFullScreen"
      ></i>
    </div>
    <!-- <search-component
      :is-search-open.sync="isSearchOpen"
      @closeSearch="toggleSearch"
    ></search-component>-->
  </div>

  <!-- header top menu end -->
</template>
<script>
import Util from "@/utils"
import { mapActions, mapGetters } from "vuex"

export default {
  data() {
    return {
      isDisplay: true,
      isStyle: true,
      isSearchOpen: false,
      isMouseOnMegaMenu: true,
      isMegaMenuOpen: false
    }
  },
  computed: {
    ...mapGetters({
      isSideBarOpen: "sidebar/isOpen"
    })
  },
  methods: {
    ...mapActions([
      "changeCompactSidebarProperties",
      "changeThemeMode",
      "signOut"
    ]),
    logoutUser() {
      this.signOut()
      this.$router.push("/app/sessions/signIn")
    },
    handleFullScreen() {
      Util.toggleFullScreen()
    },
    compactSideBarToggle() {
      this.$store.commit("sidebar/toggleOpen")
    }
  }
}
</script>
