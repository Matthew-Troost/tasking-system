<template>
  <div>
    <b-row>
      <b-col lg="4">
        <ticket
          v-for="(ticket, index) in getUnassigned"
          :key="ticket.id"
          v-model="getUnassigned[index]"
          :class="[ticket != selectedTicket && selectedTicket ? 'faded' : '']"
          @ticketSelected="onTicketSelect(ticket)"
        />
      </b-col>
      <b-col lg="8">
        <ticketThread v-model="selectedTicket" class="mb-20" />
      </b-col>
    </b-row>
  </div>
</template>
<script>
import ticket from "@/components/ticket"
import ticketThread from "@/components/ticket/thread"
import { mapGetters } from "vuex"

export default {
  components: {
    ticket,
    ticketThread
  },
  data() {
    return {
      selectedTicket: null
    }
  },
  computed: {
    ...mapGetters({
      getUnassigned: "tickets/getUnassigned"
    })
  },
  methods: {
    onTicketSelect(ticket) {
      this.selectedTicket = ticket
    }
  }
}
</script>
<style scoped>
.faded {
  opacity: 0.3;
}
.mb-20 {
  margin-bottom: 20px;
}
</style>
