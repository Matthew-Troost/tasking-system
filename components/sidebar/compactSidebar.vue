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
        <div v-if="!loading" class="logo">
          <avatar :user-id="getCurrentUser.id" :hide-nick-name="true" />
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
        <span class="ml-2 badge badge-pill badge-success version"
          >TEST RELEASE</span
        >
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
          <div class="logo"></div>
        </header>
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
              <nuxt-link tag="a" class to="/overview">
                <i class="nav-icon i-Pie-Chart-3"></i>
                <span class="item-name">Overview</span>
              </nuxt-link>
            </li>
            <div v-if="!loading">
              <li
                v-for="project in getUserProjects(getCurrentUser.id)"
                :key="project.id"
                class="nav-item"
              >
                <nuxt-link
                  tag="a"
                  class
                  :to="`/projects/${project.type}/${toLink(project.name)}`"
                >
                  <i class="nav-icon i-Yes"></i>
                  <span class="item-name">
                    {{ project.name }}
                    <span
                      :class="
                        `ml-2 badge badge-pill badge-${
                          projectTaskCount(project) < 4
                            ? 'success'
                            : projectTaskCount(project) < 6
                            ? 'warning'
                            : 'danger'
                        }`
                      "
                      >{{ projectTaskCount(project) }} tasks</span
                    >
                  </span>
                </nuxt-link>
              </li>
            </div>
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
              <nuxt-link tag="a" class to="/projects/mobile-apps">
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
              <nuxt-link tag="a" class to="/projects/sites">
                <i class="nav-icon i-Globe"></i>
                <span class="item-name">Sites</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link tag="a" class to="/projects/social-media">
                <i class="nav-icon i-Facebook-2"></i>
                <span class="item-name">Social Media</span>
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
import Util from "@/utils"
import avatar from "@/components/projectAvatar"

export default {
  components: {
    avatar
  },
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
      isSideBarOpen: "sidebar/isOpen",
      getUserProjects: "projects/getForUser",
      getCurrentUser: "users/getCurrentUser"
    }),
    loading() {
      return this.getCurrentUser == null
    }
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

      if (currentParentUrl == "overview") {
        this.selectedParentMenu = "dashboards"
      } else if (currentParentUrl !== undefined && currentParentUrl !== null) {
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
    },
    toLink: function(projectName) {
      return Util.stringToLink(projectName)
    },
    projectTaskCount(project) {
      let taskCount = 0
      project.lists.forEach(list => {
        taskCount += list.tasks.filter(task => {
          return task.users.includes(this.getCurrentUser.id) && !task.completed
        }).length
      })
      return taskCount
    }
  }
}
</script>
<style scoped>
.version {
  position: absolute;
  bottom: 0;
  left: 0;
  margin-bottom: 8px;
  white-space: unset;
  margin-right: 8px;
  background-color: #af63e8;
}
</style>
