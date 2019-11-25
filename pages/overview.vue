<template>
  <div>
    <loading v-show="loading" />
    <div v-if="!loading">
      <div class="avatar">
        <img v-lazy="getCurrentUser.avatar" alt />
        <div>
          <h1>
            {{ getCurrentUser.first_name }} {{ getCurrentUser.last_name }}
            <small>(me)</small>
          </h1>
          <h4>
            <span
              v-for="role in getCurrentUser.type"
              :key="role.id"
              class="badge badge-pill badge-primary"
              >{{ role }}</span
            >
          </h4>
        </div>
      </div>
      <UserDashboard :userid="getCurrentUser.id" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import UserDashboard from "@/components/userdashboard"

export default {
  layout: "default",
  name: "Dashboard",
  components: {
    UserDashboard
  },
  computed: {
    ...mapGetters({
      getCurrentUser: "users/getCurrentUser"
    }),
    loading() {
      return this.getCurrentUser == null
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
.avatar div {
  display: inline-block;
  margin-left: 50px;
}
.avatar h1 {
  margin-bottom: 0px;
  font-size: 40px;
}
</style>
