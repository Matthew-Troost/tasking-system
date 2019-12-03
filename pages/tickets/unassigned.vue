<template>
  <div>
    <b-row>
      <b-col lg="4">
        <ticket />
      </b-col>
    </b-row>
  </div>
</template>
<script>
import ticket from "@/components/ticket"
import { mapGetters } from "vuex"

export default {
  components: {
    ticket
  },
  computed: {
    ...mapGetters({})
  }
}
</script>
