<template>
  <div>
    <b-row>
      <b-col md="4">
        <img v-lazy="url" alt />
      </b-col>
    </b-row>
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
