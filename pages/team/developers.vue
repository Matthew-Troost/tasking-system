<template>
  <div class="main-content">
    <h2 class="page-title">Developers</h2>
    <b-row>
      <b-col sm="6" md="4" lg="3">
        <!-- start::profile -->
        <b-card class="card-profile-1 mb-30 text-center">
          <div class="avatar mb-3">
            <img src="@/assets/images/avatars/matthewt.svg" alt />
          </div>
          <h5 class="m-0">Matthew Troost</h5>
          <div class="text-center">
            <b-badge pill variant="outline-dark p-2 m-1"
              >Intelligent Safe
            </b-badge>
            <b-badge pill variant="outline-dark p-2 m-1">Ladismith </b-badge>
            <b-badge pill variant="outline-dark p-2 m-1"
              >Network For Animals
            </b-badge>
          </div>
          <button class="btn btn-primary btn-rounded mt-2">
            Matt's Schedule
          </button>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapState } from "vuex"

export default {
  layout: "default",
  name: "Developers",
  computed: {
    ...mapState({
      users: state => state.users.users
    })
  },
  created() {}
}
</script>
