<template>
  <div id="answerBlock">
    <el-card class="box-card" :style="card_body_style">
      <el-row>
        <el-col :span="12">
          <div style="color:white;font-size:15px;">{{result}}</div>
        </el-col>
        <el-col :span="8">
          <div style="color:white;font-size:15px;">答案评分:{{score.toFixed(2)}}</div>
        </el-col>
        <el-col :span="4">
          <el-button @click="drawer = true" type="primary" style="margin-left: 10px;">答案详情</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-drawer title="title"
    :visible.sync="drawer"
    :with-header="false"
    :modal="false"
    size = '50%'
    style="overflow:hidden;">
      <el-divider></el-divider>
        <div style="margin-left: 10px; height:20px; overflow:auto;"><b>Answer: </b>{{result}}</div>
      <el-divider></el-divider>
        <el-row>
          <div style="margin-left: 10px; max-height:90px;overflow:auto;"><b>Abstract: </b>{{abstract}}...</div>
        </el-row>
        <el-divider><i class="el-icon-edit"></i></el-divider>
        <el-row>
          <el-col span = 18><div style="color:red; font-size:15px; margin-left: 10px; height:20px; overflow:auto;"><b>来自文章:{{title}}</b></div></el-col>
          <el-col span = 6><button style="margin-left: 10px;" v-on:click = "contextVisible = true">查看原文</button></el-col>
        </el-row>
      <el-divider></el-divider>
      <el-collapse-transition>
        <el-card v-if="contextVisible">
          <div style="height:350px;  overflow:auto;" v-highlight="{hWord: result, word: context}">
          </div>
          <button type="text" style="margin-left: 85%;" v-on:click = "contextVisible = false">关闭</button>
        </el-card>
      </el-collapse-transition>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'AnswerBlock',
  props: {
    title: {
      type: String,
      default: () => 'title'
    },
    result: {
      type: String,
      default: () => 'the answer'
    },
    score: {
      type: Number,
      default: () => 0.5
    },
    abstract: {
      type: String,
      default: () => 'the abstract'
    },
    context: {
      type: String,
      default: () => 'the context'
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
