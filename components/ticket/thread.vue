<template>
  <b-card>
    <VclList v-if="!value"></VclList>
    <div v-else>
      <h3 class="subject">{{ value.thread[0].subject }}</h3>
      <threadItem
        v-for="(threaditem, index) in value.thread"
        :key="threaditem.id"
        v-model="value.thread[index]"
      />
    </div>
  </b-card>
</template>
<script>
import { VclList } from "vue-content-loading"
import threadItem from "./threaditem"

export default {
  components: {
    VclList,
    threadItem
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  }
}
</script>
