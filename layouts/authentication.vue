<template>
  <div
    class="main-content bg-default col-md-12"
    :style="{
      backgroundImage: 'url(' + bgImage + ')',
      backgroundSize: 'cover'
    }"
  >
    <!-- Header -->
    <!-- <div class="header bg-gradient-success py-7 py-lg-8">
      <div class="container">
        <div class="header-body text-center mb-7">
          <div class="row justify-content-center">
            <div class="col-lg-5 col-md-6">
              <h1 class="text-white">Netgen</h1>
              <p class="text-lead text-white">A simple task scheduler</p>
            </div>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon class="fill-default" points="2560 0 2560 100 0 100" />
        </svg>
      </div>
    </div> -->
    <!-- Page content -->
    <div class="container mt--8 pb-5">
      <SlideYUpTransition mode="out-in" origin="center top">
        <router-view />
      </SlideYUpTransition>
    </div>
    <footer class="py-3">
      <div class="container">
        <div class="row align-items-center justify-content-xl-between">
          <div class="col-xl-6">
            <div class="copyright text-center text-xl-left text-muted">
              &copy; {{ year }}
              <a
                href="https://www.netgen.co.za/"
                class="font-weight-bold ml-1"
                target="_blank"
                >{{ companyName }}</a
              >
            </div>
          </div>
          <div class="col-xl-6">
            <ul
              class="nav nav-footer justify-content-center justify-content-xl-end"
            >
              <li class="nav-item">
                <p>A product of Netgen (Pty) Ltd</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { SlideYUpTransition } from "vue2-transitions"

export default {
  name: "AuthLayout",
  components: {
    SlideYUpTransition
  },
  data() {
    return {
      year: new Date().getFullYear(),
      showMenu: false,
      companyName: "Netgen (Pty) Ltd",
      bgImage: require("@../../../assets/images/background.jpg")
    }
  }
}
</script>
<style scoped>
.pb-5,
.py-5 {
  padding-bottom: 0 !important;
}

.auth-layout-wrap {
  min-height: 90vh;
}
p,
.font-weight-bold,
.text-muted {
  color: white !important;
}
</style>
<style>
html,
.main-content,
#__nuxt,
#__layout,
body {
  height: 100% !important;
}
</style>
