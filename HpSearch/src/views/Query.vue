<template slot="item" slot-scope="props">
  <div id="query">
    <div style="margin: 40px 0;"></div>
    <el-page-header @back="back" content="图片查询" class="backhome">
    </el-page-header>
    <QueryBar ref="querybar" v-on:search = 'queryAgain' v-bind:initquery = "_query" class="bar"/>
    <el-row v-if="loadingVisible">
      <div class="loadingio-spinner-magnify-5sffaqwavb3"><div class="ldio-35282gisdt4"><div><div><div></div><div></div></div></div></div></div>
      <div style="color:white;font-size:15px;">Querying...</div>
    </el-row>
    <div id="ans_pics">
      <vue-waterfall-easy :imgsArr='imgsArr'
                    :gap="20"
                    :height="800"
                    :loadingDotCount='0'
                    :imgWidth='180'>
        <div slot-scope="props">
            <p v-html="props.value.info"></p>
        </div>
      </vue-waterfall-easy>
    </div>
  </div>
</template>

<script>
import QueryBar from '@/components/QueryBar.vue'
import {postQuery} from '@/utils/communication'
import {store} from '@/store/AnswerlistStore'
import {data_to_answerlist} from '@/utils/DataProcess'
import {hstore} from '@/store/HistoryStore'
import vueWaterfallEasy from 'vue-waterfall-easy'

var UNKNOWN_ERROR_INFO = '发生未知异常,请检查网络连接或联系作者'
var MES_INFO = 0
var MES_ERROR = 1
var MES_SUCC = 2

export default {
  name: 'Query',
  components: {
    vueWaterfallEasy,
    QueryBar
  },
  data () {
    return {
      _query: store.query,
      answerlist: [],
      loadingVisible: false,
      lock: false,
      imgsArr: [],
      group: 0 // request param
    }
  },
  methods: {
    flushdata: function () {
      this.group = 0,
      this.imgsArr = []
    },
    getdata: function (id) {
      var res = {
        data: {
          'src': 'http://127.0.0.1:8081/data/' + id + '.jpg',
          'herf': ''
        }
      }
      this.group++
      this.imgsArr = this.imgsArr.concat(res.data)
    },
    // 1.返回主页
    back: function () {
      this.flushdata()
      this.$router.go(-1)
    },
    // 3.搜索相关提示信息(会有搜索加载动画)
    query_tips: function (wait_time, wait_time2, message_type, _message) {
      this.timer = setTimeout(() => {
        this.loadingVisible = false
      }, wait_time)
      this.timer = setTimeout(() => {
        if (message_type === MES_INFO) {
          this.$notify.error({
            position: 'top-left',
            offset: 100,
            duration: 1000,
            title: '提示',
            message: _message
          })
        } else if (message_type === MES_SUCC) {
          this.$notify.info({
            position: 'top-left',
            title: '提示',
            offset: 100,
            duration: 1000,
            message: _message
          })
        } else if (message_type === MES_ERROR) {
          this.$notify.success({
            position: 'top-left',
            title: '错误提示',
            offset: 100,
            duration: 1000,
            message: _message
          })
        }
      }, wait_time2)
    },
    // 5.错误处理函数
    error_handle: function (error) {
      var respnose = error.response
      this.query_tips(500, 500, MES_ERROR, UNKNOWN_ERROR_INFO)
    },
    // 6.搜索函数
    queryAgain: function () {
      if (this.lock === false) {
        this.lock = true
        var query = this.$refs['querybar'].ret_query()
        hstore.add_history(query)
        if (query === '') {
          this.query_tips(0, 0, MES_INFO, '问题不能为空!')
          this.lock = false
          return
        }
        this.loadingVisible = true
        postQuery(query).then(
          Response => {
            console.log(Response)
            if (Response.status === 200) {
              store.set_answer_list(data_to_answerlist(Response.data))
              store.set_query(query)
              console.log(this.imgsArr)
              this.flushdata()
              for(var i = 0;i < store.answer_list.length;i++){
                this.getdata(store.answer_list[i])
              }
              this.query_tips(0, 0, MES_SUCC, '侯哥搜图已为您找到' + Response.data.length + '张图片')
              this.loadingVisible = false
            } else {
              this.query_tips(500, 500, MES_ERROR, '未知错误')
            }
            this.lock = false
          },
          error => {
            this.error_handle(error)
            this.lock = false
          })
      }
    }
  },
  created: function () {
    console.log('create');
    this.flushdata()
    for(var i = 0;i < store.answer_list.length;i++){
      this.getdata(store.answer_list[i])
    }
    console.log(store.answer_list)
    console.log(this.imgsArr)
    let that = this
    document.onkeyup = function (e) {
      e = window.event || e
      if (e.keyCode === 13) {
        that.queryAgain()
      }
    }
  }
}
</script>

<style scoped>

@import '../assets/loading.css';

.el-page-header {
  font-size: 60px Extra large;
  color: rgb(248, 242, 242);
}
#list{
  margin: 80px;
}
#query{
background:url("../assets/background.png");
width:100%;
height:100%;
position: fixed;
background-size:100% 100%;}
</style>
