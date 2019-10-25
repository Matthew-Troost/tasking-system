<template>
  <div
    class="side-content-wrap"
    @mouseenter="isMenuOver = true"
    @mouseleave="isMenuOver = false"
    @touchstart="isMenuOver = true"
  >
    <vue-perfect-scrollbar
      ref="myData"
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
      :class="{ open: isSideBarOpen }"
      class="sidebar-left rtl-ps-none ps"
    >
      <ul class="navigation-left">
        <div class="logo">
          <img alt src="@/assets/images/avatars/matthewt.svg" />
        </div>
        <li
          :class="{ active: selectedParentMenu == 'dashboards' }"
          class="nav-item"
          data-item="dashboards"
          @mouseenter="toggleSubMenu"
        >
          <a class="nav-item-hold" href="#">
            <i class="nav-icon i-Bar-Chart"></i>
            <span class="nav-text">Dashboard</span>
          </a>

          <div class="triangle"></div>
        </li>
        <li
          class="nav-item"
          :class="{ active: selectedParentMenu == 'team' }"
          data-item="team"
          @mouseenter="toggleSubMenu"
        >
          <a class="nav-item-hold" href="#">
            <i class="nav-icon i-Conference"></i>
            <span class="nav-text">Team</span>
          </a>
          <div class="triangle"></div>
        </li>
        <li
          class="nav-item"
          :class="{ active: selectedParentMenu == 'projects' }"
          data-item="projects"
          @mouseenter="toggleSubMenu"
        >
          <a class="nav-item-hold" href="#">
            <i class="nav-icon i-Folders"></i>
            <span class="nav-text">Projects</span>
          </a>
          <div class="triangle"></div>
        </li>
      </ul>
    </vue-perfect-scrollbar>

    <vue-perfect-scrollbar
      :class="{ open: isSideBarOpen }"
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
      class="sidebar-left-secondary ps rtl-ps-none"
    >
      <div ref="sidebarChild">
        <i class="sidebar-close i-Close" @click="compactSideBarToggle"></i>
        <header>
          <div class="logo">
            <!-- <img src="@/assets/images/logo-text.png" alt /> -->
          </div>
        </header>

        <!-- submenu-dashboards -->
        <div
          class="submenu-area"
          data-parent="dashboards"
          :class="{ 'd-block': selectedParentMenu == 'dashboards' }"
        >
          <header>
            <h6>Dashboard</h6>
            <p>Select a project you're on.</p>
          </header>
          <ul class="childNav" data-parent="dashboards">
            <li class="nav-item">
              <nuxt-link tag="a" class to="/app/dashboards/dashboard.v1">
                <i class="nav-icon i-Pie-Chart-3"></i>
                <span class="item-name">Overview</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link tag="a" class to="/app/dashboards/dashboard.v2">
                <i class="nav-icon i-Clock-4"></i>
                <span class="item-name">
                  Project 1
                  <span class="ml-2 badge badge-pill badge-danger"
                    >3 tasks</span
                  >
                </span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link tag="a" class to="/app/dashboards/dashboard.v3">
                <i class="nav-icon i-Over-Time"></i>
                <span class="item-name">Project 2</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
        <!-- end dashboards -->
        <div
          class="submenu-area"
          data-parent="team"
          :class="{ 'd-block': selectedParentMenu == 'team' }"
        >
          <header>
            <h6>Team</h6>
            <p>Select a category of staff.</p>
          </header>
          <ul class="childNav" data-parent="team">
            <li class="nav-item">
              <nuxt-link tag="a" class to="/team/developers">
                <i class="nav-icon i-Coding"></i>
                <span class="item-name">Developers</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link tag="a" class to="/team/designers">
                <i class="nav-icon i-Wordpress"></i>
                <span class="item-name">Designers</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link tag="a" class to="/team/managing">
                <i class="nav-icon i-Management"></i>
                <span class="item-name">Managing</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link tag="a" class to="/team/socialmedia">
                <i class="nav-icon i-Instagram"></i>
                <span class="item-name">Social Media</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
        <!-- end of apps -->
        <div
          class="submenu-area"
          data-parent="projects"
          :class="{ 'd-block': selectedParentMenu == 'projects' }"
        >
          <header>
            <h6>Projects</h6>
            <p>Select a project type.</p>
          </header>
          <ul class="childNav" data-parent="projects">
            <li class="nav-item">
              <nuxt-link tag="a" class to="/app/charts/eChart">
                <i class="nav-icon i-Android"></i>
                <span class="item-name">Mobile Apps</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link tag="a" class to="/projects/systems">
                <i class="nav-icon i-Split-Vertical"></i>
                <span class="item-name">Systems</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link tag="a" class to="/app/charts/eChart">
                <i class="nav-icon i-Globe"></i>
                <span class="item-name">Sites</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </vue-perfect-scrollbar>
    <div
      class="sidebar-overlay"
      :class="{
        open: isSideBarOpen && windowWidth <= 1200
      }"
      @click="removeOverlay()"
    ></div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex"
import { isMobile } from "mobile-device-detect"

export default {
  data() {
    return {
      isMenuOver: false,
      selectedParentMenu: "",
      isMobile,
      windowWidth: window.innerWidth
    }
  },
  computed: {
    ...mapGetters({
      isSideBarOpen: "sidebar/isOpen"
    })
  },
  mounted() {
    this.toggleSelectedParentMenu()
    window.addEventListener("resize", this.handleWindowResize)
    document.addEventListener("click", this.returnSelectedParentMenu)
    this.handleWindowResize()
  },

  beforeDestroy() {
    document.removeEventListener("click", this.returnSelectedParentMenu)
    window.removeEventListener("resize", this.handleWindowResize)
  },
  methods: {
    ...mapMutations({ toggleOpen: "sidebar/toggleOpen" }),

    compactSideBarToggle() {
      // console.log("test");
      if (this.isSideBarOpen) {
        this.toggleOpen()
      }
    },

    handleWindowResize() {
      this.windowWidth = window.innerWidth
      if (window.innerWidth <= 1200) {
        if (this.isSideBarOpen) {
          this.toggleOpen()
        }
      } else {
        if (!this.isSideBarOpen) {
          this.toggleOpen()
        }
      }
    },
    toggleSelectedParentMenu() {
      const currentParentUrl = this.$route.path
        .split("/")
        .filter(x => x !== "")[0]

      if (currentParentUrl !== undefined && currentParentUrl !== null) {
        this.selectedParentMenu = currentParentUrl.toLowerCase()
      } else {
        this.selectedParentMenu = "dashboards"
      }
    },
    toggleSubMenu(e) {
      // let childrens = this.$refs.sidebarChild.children
      let parent = e.target.dataset.item

      this.selectedParentMenu = parent
    },
    returnSelectedParentMenu() {
      if (!this.isMenuOver) {
        this.toggleSelectedParentMenu()
      }
    },

    toggleSidebarDropdwon(event) {
      let dropdownMenus = this.$el.querySelectorAll(".dropdown-sidemenu.open")

      event.currentTarget.classList.toggle("open")

      dropdownMenus.forEach(dropdown => {
        dropdown.classList.remove("open")
      })
    }
  }
}
</script>
