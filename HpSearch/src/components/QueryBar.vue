<template>
  <div id="queryBar">
    <el-row class="el-row">
      <el-col :span="10" :offset="5" class="el-col">
        <el-autocomplete
          class="inline-input"
          :fetch-suggestions="query_suggestion"
          @select="handleSelect"
          :trigger-on-focus="false"
          v-model="query"
          placeholder="请输入想要搜索的内容"
          prefix-icon="el-icon-search"
          clearable
        >
        </el-autocomplete>
      </el-col>
      <el-col :span="2" :offset="0">
        <el-select v-model="colorvalue" placeholder="图片颜色">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" :offset="0">
        <el-button v-on:click="search">
          <i class="el-icon-search">搜索</i>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { hstore } from "@/store/HistoryStore";
export default {
  name: "QueryBar",
  data() {
      return {
        options: [{
          value: 'R',
          label: '红色'
        }, {
          value: 'B',
          label: '蓝色'
        }, {
          value: 'G',
          label: '绿色'
        }, {
          value: 'A',
          label: '不选择'
        }],
        colorvalue: 'A'
      }
  },
  props: {
    query: {
      type: String,
      default: () => ""
    },
    // initquery由父组件传入
    initquery: {
      type: String,
      default: () => ""
    }
  },
  methods: {
    search: function() {
      this.$emit("search");
    },
    ret_query: function() {
      return this.query;
    },
    ret_color: function() {
      return this.colorvalue;
    },
    query_suggestion: function(queryString, cb) {
      var historys = hstore.get_history(queryString);
      // 调用 callback 返回建议列表的数据
      cb(historys);
    },
    handleSelect: function(item) {
      this.query = item.value;
    }
  },
  created: function() {
    this.query = this.initquery;
  }
};
</script>

<style scoped>
.el-autocomplete {
  height: 48px;
  font-size: 150%;
  width: 620px;
}

.el-button {
  width: 65%;
  font-size: 130%;
  object-fit: fill;
  border-radius: 20px;
  font-family: "Segoe UI";
  color: #000;
  background-color: rgb(255, 255, 255);
}
</style>
