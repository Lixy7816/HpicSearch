<template>
  <div id="docBlock">
    <el-card class="box-card" :style="card_body_style">
      <el-row>
        <el-col :span="8">
          <div style="color:white;font-size:15px;">文章标题: {{title}}</div>
        </el-col>
        <el-col :span="4">
          <div style="color:white;font-size:15px;">文章id: {{id}}</div>
        </el-col>
        <el-col :span="4">
          <el-button @click="drawer = true" type="primary" style="margin-left: 10px;" class="answer">详情</el-button>
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
        <div style="margin-left: 10px; height:20px; overflow:auto;" v-highlight="{hWord: filter, word:' Title:'+ title}"></div>
      <el-divider></el-divider>
        <el-row>
          <div style="margin-left: 10px; max-height:90px;overflow:auto;"><b>Abstract: </b>{{abstract}}...</div>
        </el-row>
        <el-divider><i class="el-icon-edit"></i></el-divider>
      <el-collapse-transition>
        <el-card>
          <div style="height:350px;  overflow:auto;" v-highlight="{hWord: filter, word: context}">
          </div>
        </el-card>
      </el-collapse-transition>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'DocBlock',
  props: {
    id: {
      type: Number,
      default: () => 0
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
    is_deleted: {
      type: Boolean,
      default: () => false
    },
    filter: {
      type: String,
      default: () => 'the filter'
    }
  },
  data () {
    return {
      highlight_context: '',
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
