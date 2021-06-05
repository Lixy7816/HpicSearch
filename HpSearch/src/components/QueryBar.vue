<template>
  <div id="queryBar">
    <el-row class="el-row">
      <el-col :span="10" :offset="6" class="el-col">
        <el-autocomplete
          class="inline-input"
          :fetch-suggestions="query_suggestion"
          @select="handleSelect"
          :trigger-on-focus="false"
          v-model="query"
          placeholder="请输入想要查询的内容"
          prefix-icon="el-icon-search" clearable>
        </el-autocomplete>
      </el-col>
      <el-col :span="3" :offset="0">
        <el-button  v-on:click = 'search' >
              <i class="el-icon-search">查询</i>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {hstore} from '@/store/HistoryStore'
export default {
  name: 'QueryBar',
  props: {
    query: {
      type: String,
      default: () => ''
    },
    // initquery由父组件传入
    initquery: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    search: function () {
      this.$emit('search')
    },
    ret_query: function () {
      return this.query
    },
    query_suggestion: function (queryString, cb) {
      var historys = hstore.get_history(queryString)
      // 调用 callback 返回建议列表的数据
      cb(historys)
    },
    handleSelect: function (item) {
      this.query = item.value
    }
  },
  created: function () {
    this.query = this.initquery
  }
}
</script>

<style scoped>
.el-autocomplete{
    height: 48px;
    font-size: 150%;
    width:620px;
 }

.el-button {
  width: 65%;
  font-size: 130%;
  object-fit: fill;
  border-radius:20px;
  font-family:'Segoe UI';
  color: #000;
  background-color: rgb(255, 255, 255);
}

</style>
