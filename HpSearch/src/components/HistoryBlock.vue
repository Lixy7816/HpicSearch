<template>
  <div id="historyBlock">
    <el-card class="box-card" :style="card_body_style">
      <el-row>
        <el-col :span="12">
          <div style="color:white;font-size:15px;">搜索记录:{{query}}</div>
        </el-col>
        <el-col :span="8">
          <div style="color:white;font-size:15px;">最佳答案:{{answer}}</div>
        </el-col>
        <el-col :span="4">
          <el-button @click="drawer = true" type="primary" style="margin-left: 10px;" class="answer">答案详情</el-button>
        </el-col>
      </el-row>
      <el-row>
        <time class="time" style = "color:#888888">{{ timestamp }}</time>
      </el-row>
    </el-card>

    <el-drawer title="title"
    :visible.sync="drawer"
    :with-header="false"
    :modal="false"
    size = '50%'
    style="overflow:hidden;">
      <el-divider></el-divider>
        <div style="margin-left: 10px; height:20px; overflow:auto;"><b>Answer: </b>{{answer}}</div>
      <el-divider></el-divider>
        <el-row>
          <div style="margin-left: 10px; max-height:90px;overflow:auto;"><b>Abstract: </b>{{abstract}}...</div>
        </el-row>
        <el-divider><i class="el-icon-edit"></i></el-divider>
        <el-row>
          <el-col span = 18><div style="color:red; font-size:15px; margin-left: 10px; height:20px; overflow:auto;"><b>来自文章:{{title}}</b></div></el-col>
          <el-col span = 6><button style="margin-left: 10px;" v-on:click = "contextVisible = true" class="origin">查看原文</button></el-col>
        </el-row>
      <el-divider></el-divider>
      <el-collapse-transition>
        <el-card v-if="contextVisible">
          <div style="height:350px;  overflow:auto;" v-highlight="{hWord: answer, word: context}">
          </div>
          <button type="text" style="margin-left: 85%;" v-on:click = "contextVisible = false" class="close">关闭</button>
        </el-card>
      </el-collapse-transition>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'HistoryBlock',
  props: {
    query: {
      type: String,
      default: () => 'the question'
    },
    answer: {
      type: String,
      default: () => 'the answer'
    },
    title: {
      type: String,
      default: () => 'title'
    },
    timestamp: {
      type: String,
      default: () => '2020-11-19T04:50:46.681Z'
    },
    abstract: {
      type: String,
      default: () => 'the abstract'
    },
    context: {
      type: String,
      default: () => 'the context'
    },
    rk: {
      type: Number,
      default: () => -1
    }
  },
  data () {
    return {
      highlight_context: '',
      contextVisible: false,
      drawer: false,
      card_body_style: {
        'background-color': 'rgb(0, 0, 0)'
      }
    }
  }
}
</script>

<style scoped>
div {
  text-align: left;
}

.el-button {
  margin-left:60%;
  object-fit: fill;
  color: rgb(255, 255, 255);
  background-color: rgb(61, 59, 59);
  padding: 10px 10px;
}

button {
  width: fit-content;
  height: fit-content;
  padding: 5px 5px;
  border-width: 0px;
  border-radius: 5px;
  background: #1E90FF;
  cursor: pointer;
  outline: none;
  font-family: Microsoft YaHei;
  color: white;
  font-size: 15px;
}

button:hover {
  background: #5599FF;
}

</style>
