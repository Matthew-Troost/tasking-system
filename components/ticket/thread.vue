<template>
  <b-card>
    <VclList v-if="!value"></VclList>
    <div v-else>
      <h3 class="subject">{{ value.thread[0].subject }}</h3>
      <div
        v-for="threaditem in value.thread"
        :key="threaditem.id"
        class="thread-content"
      >
        <div class="details">
          <p>
            Received:
            <b>{{ threaditem.date.toDate() | moment("dddd, MMMM Do YYYY") }}</b>
          </p>
          <p>
            From: <b>{{ threaditem.from }}</b>
          </p>
          <p v-if="threaditem.cc">Cc: {{ threaditem.cc }}</p>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="threaditem.html"></div>
      </div>
    </div>
  </b-card>
</template>
<script>
import { VclList } from "vue-content-loading"

export default {
  components: {
    VclList
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  }
}
</script>
<style scoped>
.thread-content {
  border: 1px solid #a7a7a7;
  border-radius: 5px;
  padding: 15px;
}
.subject {
  margin-bottom: 25px;
}
.details {
  border: 1px solid #cecece;
  border-radius: 5px;
  padding: 5px;
  background-color: #cecece;
  padding-left: 10px;
  margin-bottom: 10px;
}
.details p {
  margin-bottom: 0;
}
</style>
