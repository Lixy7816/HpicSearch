<template>
  <div id="docList">
    <el-row><el-col :span="11">
    <template v-for="DocBlock in docList1" >
      <DocBlock :key="DocBlock.id"
                      v-bind:id = "DocBlock.id"
                      v-bind:is_deleted = "DocBlock.is_deleted"
                      v-bind:title = "DocBlock.title"
                      v-bind:answer = "DocBlock.answer"
                      v-bind:timestamp = "DocBlock.timestamp"
                      v-bind:context = "DocBlock.context"
                      v-bind:abstract = "DocBlock.abstract"
                      v-bind:filter = "DocBlock.filter"/>
    </template></el-col><el-col :span="11" :offset ="1">
    <template v-for="DocBlock in docList2" >
      <DocBlock :key="DocBlock.id"
                      v-bind:id = "DocBlock.id"
                      v-bind:is_deleted = "DocBlock.is_deleted"
                      v-bind:title = "DocBlock.title"
                      v-bind:answer = "DocBlock.answer"
                      v-bind:timestamp = "DocBlock.timestamp"
                      v-bind:context = "DocBlock.context"
                      v-bind:abstract = "DocBlock.abstract"
                      v-bind:filter = "DocBlock.filter"/>
    </template></el-col>
    </el-row>
  </div>
</template>

<script>
import DocBlock from '@/components/DocBlock'
export default {
  name: 'DocList',
  components: {
    DocBlock
  },
  props: {
    docList1: {
      type: Array,
      default: () => []
    },
    docList2: {
      type: Array,
      default: () => []
    }
  }
}
</script>
