<template>
  <div>
    <loading v-if="loading" />
    <div v-if="!loading">
      <div class="user-details">
        <img v-lazy="user.avatar" alt />
        <h1>{{ user.first_name }} {{ user.last_name }}</h1>
      </div>
      <UserDashboard :userid="user.id" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import Utils from "@/utils"
import UserDashboard from "@/components/userdashboard"

export default {
  components: {
    UserDashboard
  },
  data() {
    return {
      loading: true,
      user: null
    }
  },
  computed: {
    ...mapGetters({
      getUserByFullName: "users/getUserByFullName"
    })
  },
  created() {
    this.user = this.getUserByFullName(
      Utils.linkToString(this.$route.params.user)
    )
    console.log(this.user)
    this.loading = false
  }
}
</script>
<style scoped>
.user-details {
  text-align: center;
}
.user-details img {
  width: 100px;
}
.user-details h1 {
  margin-top: 10px;
}
</style>
