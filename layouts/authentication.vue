<template>
  <div class="main-content bg-default">
    <!-- Navbar -->
    <Navigation
      class="navbar-top navbar-horizontal navbar-dark"
      container-classes="px-4 container"
      expand
    >
      <router-link slot="brand" class="navbar-brand" to="/">
        <h2>STEVE.</h2>
      </router-link>

      <template v-slot="{ closeMenu }">
        <!-- Collapse header -->
        <div class="navbar-collapse-header d-md-none">
          <div class="row">
            <div class="col-6 collapse-close">
              <button
                type="button"
                class="navbar-toggler"
                aria-label="Toggle sidenav"
                @click="closeMenu"
              >
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
        <!-- Navbar items -->
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link class="nav-link nav-link-icon" to="/">
              <i class="ni ni-planet" />
              <span class="nav-link-inner--text">Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-link-icon" to="/register">
              <i class="ni ni-circle-08" />
              <span class="nav-link-inner--text">Register</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-link-icon" to="/login">
              <i class="ni ni-key-25" />
              <span class="nav-link-inner--text">Login</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-link-icon" to="/profile">
              <i class="ni ni-single-02" />
              <span class="nav-link-inner--text">Profile</span>
            </router-link>
          </li>
        </ul>
      </template>
    </Navigation>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8">
      <div class="container">
        <div class="header-body text-center mb-7">
          <div class="row justify-content-center">
            <div class="col-lg-5 col-md-6">
              <h1 class="text-white">Welcome!</h1>
              <p class="text-lead text-white">
                Use these awesome forms to login or create new account in your
                project for free.
              </p>
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
    </div>
    <!-- Page content -->
    <div class="container mt--8 pb-5">
      <SlideYUpTransition mode="out-in" origin="center top">
        <router-view />
      </SlideYUpTransition>
    </div>
    <footer class="py-5">
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
import Navigation from "../components/Navigation"

export default {
  name: "AuthLayout",
  components: {
    SlideYUpTransition,
    Navigation
  },
  data() {
    return {
      year: new Date().getFullYear(),
      showMenu: false,
      companyName: "Netgen (Pty) Ltd"
    }
  }
}
</script>
