<template>
  <b-card class=" mb-30">
    <div class="d-sm-flex align-item-sm-center flex-sm-nowrap">
      <div>
        <h5>
          <a class="cursor-pointer" @click="onTicketSelected"
            ><span class="ticket-number">{{ value.number }}.</span>
            {{ value.thread[0].subject }}</a
          >
        </h5>
        <p class="ul-task-manager__paragraph mb-3">
          {{ value.thread[0].from }}
        </p>
        <a href="#" class="m-1">
          <i
            class="ul-task-manager__fonts i-Add text-30 "
            style="vertical-align:middle"
          ></i>
        </a>
        <a
          href=""
          class="btn btn-icon bg-transparent border-slate-300 text-slate rounded-round border-dashed"
          ><i class="icon-plus22"></i
        ></a>
      </div>

      <ul class="list list-unstyled mb-0 mt-3 mt-sm-0 ml-auto">
        <li>
          <span class="ul-task-manager__font-date text-muted">{{
            value.thread[value.thread.length - 1].date.toDate()
              | moment("from", "now")
          }}</span>
        </li>
        <b-badge v-if="isUnanswered" pill variant="warning p-2 m-1"
          >Unanswered</b-badge
        >
      </ul>
    </div>
    <div slot="footer">
      <div
        class="text-muted d-sm-flex justify-content-sm-between align-items-sm-center"
      >
        <span
          >Received:
          <span
            ><b>{{
              value.thread[0].date.toDate() | moment("from", "now")
            }}</b></span
          ></span
        >

        <div class="list-inline mb-0 mt-2 mt-sm-0">
          <b-badge v-if="value.status === 'open'" pill variant="success p-2 m-1"
            >Open</b-badge
          >
          <b-badge v-else pill variant="danger p-2 m-1">Closed</b-badge>
        </div>
      </div>
    </div>
  </b-card>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  computed: {
    isUnanswered() {
      return !this.value.thread[this.value.thread.length - 1].from.includes(
        "@netgen.co.za"
      )
    }
  },
  methods: {
    onTicketSelected() {
      this.$emit("ticketSelected")
    }
  }
}
</script>
<style scoped>
.ticket-number {
  font-size: 12px;
  font-weight: bold;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
