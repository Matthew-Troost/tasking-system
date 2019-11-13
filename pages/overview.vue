<template>
  <div>
    <div class="avatar">
      <img v-lazy="user == null ? '' : user.avatar" alt />
      <h1>
        {{ user == null ? "" : `${user.first_name} ${user.last_name}` }}
      </h1>
    </div>
    <b-row>
      <b-col md="3">
        <b-card class="project-progress">
          <div class="ul-widget-app__poll-list mb-4">
            <div class="d-flex">
              <span class="text-muted text-12">From UK</span>
              <span class="text-muted text-12 ml-auto">
                75%
              </span>
            </div>
            <b-progress height="5px" :value="75"></b-progress>
          </div>
          <div class="ul-widget-app__poll-list mb-4">
            <div class="d-flex">
              <span class="text-muted text-12">From U.S.A</span>
              <span class="text-muted text-12 ml-auto">
                33%
              </span>
            </div>
            <b-progress height="5px" variant="success" :value="33"></b-progress>
          </div>
          <div class="ul-widget-app__poll-list mb-4">
            <div class="d-flex">
              <span class="text-muted text-12">From Canada</span>
              <span class="text-muted text-12 ml-auto">
                49%
              </span>
            </div>
            <b-progress height="5px" variant="dark" :value="49"></b-progress>
          </div>
        </b-card>
        <b-card>
          <div class="chart-wrapper" style="height: 300px ; width:100%">
            <v-chart :options="echartPie" :autoresize="true"></v-chart>
          </div>
        </b-card>
      </b-col>
      <b-col md="9"> <b-card> </b-card> </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex"

export default {
  layout: "default",
  name: "Dashboard",
  computed: {
    ...mapGetters({
      getUser: "users/getUserByUID"
    }),
    ...mapState({
      currentUser: state => state.users.current_user
    }),
    user() {
      return this.getUser(this.currentUser.uid)
    }
  }
}
</script>
<style scoped>
.avatar {
  margin-bottom: 20px;
}
.avatar img {
  width: 120px;
}
.avatar h1 {
  display: inline-block;
  margin-bottom: 0px;
  margin-left: 50px;
  font-size: 50px;
}
.project-progress {
  margin-bottom: 10px;
}
</style>
