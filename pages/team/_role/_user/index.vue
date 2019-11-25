<template>
  <div>
    <loading v-if="loading" />
    <flickity ref="slider" :options="slider.options">
      <div v-for="_user in usersInRole" :key="_user.id" class="carousel-cell">
        <div class="user-details">
          <img v-lazy="_user.avatar" alt />
          <h1>{{ _user.first_name }} {{ _user.last_name }}</h1>
        </div>
      </div>
    </flickity>
    <div v-if="!loading">
      <UserDashboard :key="selectedUserId" :userid="selectedUserId" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import Utils from "@/utils"
import UserDashboard from "@/components/userdashboard"
import flickity from "vue-flickity"

export default {
  components: {
    UserDashboard,
    flickity
  },
  data() {
    return {
      loading: true,
      user: null,
      slider: {
        options: {
          pageDots: false,
          wrapAround: false
        }
      },
      selectedUserId: 0
    }
  },
  computed: {
    ...mapGetters({
      getUserByFullName: "users/getUserByFullName",
      getForRole: "users/getForRole"
    }),
    usersInRole() {
      switch (this.$route.params.role) {
        case "developers":
          return this.getForRole("developer")
        case "designers":
          return this.getForRole("designer")
        case "managing":
          return this.getForRole("management")
        case "socialmedia":
          return this.getForRole("socialmedia")
        default:
          return this.getForRole("developer")
      }
    }
  },
  created() {
    console.log(process.env.DEVELOPMENT)
    this.user = this.getUserByFullName(
      Utils.linkToString(this.$route.params.user)
    )
    if (!this.user) {
      this.$toast.info("User does not exist")
      return this.$router.back()
    }
    this.selectedUserId = this.user.id
  },
  mounted() {
    this.$refs.slider.select(this.usersInRole.indexOf(this.user, false, true))
    this.$refs.slider.on("change", index => {
      this.selectedUserId = this.usersInRole[index].id
    })
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
.carousel-cell {
  width: 50%;
  height: 165px;
  margin-right: 10px;
  opacity: 0.3;
}
</style>
