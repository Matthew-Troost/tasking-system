<template>
  <div>
    <h2>Dashboard</h2>
    <!-- <p v-for="user in users" :key="user.auth_id">{{ user.first_name }}</p> -->
  </div>
</template>
<script>
import { mapState } from "vuex"

export default {
  layout: "default",
  name: "Dashboard",
  computed: {
    ...mapState({
      users: state => state.users.users
    })
  },
  created() {
    this.$store.state.db.collection("users").onSnapshot(users => {
      let source = users.metadata.hasPendingWrites ? "Local" : "Server"
      console.log(`Source: ${source}`)
      if (users && users.docs) {
        users.docs.forEach(user =>
          this.$store.commit("users/setUser", {
            user
          })
        )
      }
    })
  }
}
</script>
