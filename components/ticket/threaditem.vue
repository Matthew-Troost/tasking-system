<template>
  <div
    ref="container"
    class="thread-content"
    :class="[showAll ? 'full-height' : '']"
  >
    <div
      class="details"
      :class="[
        value.from.includes('@netgen.co.za')
          ? 'details-staff'
          : 'details-client'
      ]"
    >
      <p>
        Received:
        <b
          >{{ value.date.toDate() | moment("dddd, Do MMMM YYYY") }} at
          {{ value.date.toDate() | moment("HH:mm") }}</b
        >
      </p>
      <p>
        From: <b>{{ value.from }}</b>
      </p>
      <p v-if="value.cc">Cc: {{ value.cc }}</p>
    </div>
    <div class="load-more">
      <b-button variant="outline-light m-1 btn-sm" @click="toggleHeight"
        >Show {{ showAll ? "less" : "more" }}</b-button
      >
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="value.html"></div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showAll: false
    }
  },
  methods: {
    toggleHeight() {
      this.showAll = !this.showAll
    }
  }
}
</script>
<style scoped>
.thread-content {
  border: 1px solid #a7a7a7;
  border-radius: 5px;
  padding: 15px;
  max-height: 400px;
  overflow: hidden;
  position: relative;
  margin-bottom: 15px;
}
.thread-content:last-child {
  margin-bottom: 0 !important;
}
.full-height {
  max-height: unset;
}
.subject {
  margin-bottom: 25px;
}
.details {
  border-radius: 5px;
  padding: 5px;
  padding-left: 10px;
  margin-bottom: 10px;
}
.details-client {
  border: 1px solid #cecece;
  background-color: #cecece;
}
.details-staff {
  border: 1px solid #3f51b5;
  background-color: #3f51b5;
  color: white;
}
.details p {
  margin-bottom: 0;
}
.load-more {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding-bottom: 10px;
  background: #ffffffd1;
}
</style>
