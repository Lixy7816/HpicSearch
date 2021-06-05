<template>
  <div id="historyList">
    <template v-for="historyBlock in historyList" >
      <HistoryBlock :key="historyBlock.rk"
                      v-bind:rk = "historyBlock.rk"
                      v-bind:query = "historyBlock.query"
                      v-bind:title = "historyBlock.title"
                      v-bind:answer = "historyBlock.answer"
                      v-bind:timestamp = "historyBlock.timestamp"
                      v-bind:context = "historyBlock.context"
                      v-bind:abstract = "historyBlock.abstract"/>
    </template>
  </div>
</template>

<script>
import HistoryBlock from '@/components/HistoryBlock'
export default {
  name: 'HistoryList',
  components: {
    HistoryBlock
  },
  props: {
    historyList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
