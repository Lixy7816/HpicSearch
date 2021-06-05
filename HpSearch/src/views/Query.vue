<template slot="item" slot-scope="props">
  <div id="query">
    <div style="margin: 40px 0;"></div>
    <el-page-header @back="back" content="问题查询" class="backhome">
    </el-page-header>
    <QueryBar ref="querybar" v-on:search = 'queryAgain' v-bind:initquery = "state.query" class="bar"/>
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
import AnswerList from '@/components/AnswerList'
import Pictures from '@/components/Pictures.vue'
import {postQuery} from '@/utils/communication'
import {store} from '@/store/AnswerlistStore'
import {data_to_answerlist} from '@/utils/DataProcess'
import {ustore} from '@/store/UserStateStore'
import {hstore} from '@/store/HistoryStore'
import {localStore} from '@/store/StorageLocal'
import vueWaterfallEasy from 'vue-waterfall-easy'

var UNKNOWN_ERROR_INFO = '发生未知异常,请检查网络连接或联系Anonymous小组'
var MES_INFO = 0
var MES_ERROR = 1
var MES_SUCC = 2

export default {
  name: 'Query',
  components: {
    vueWaterfallEasy,
    QueryBar,
    AnswerList,
    Pictures
  },
  data () {
    return {
      ustate: ustore.state,
      state: store.state,
      answerlist: [],
      loadingVisible: false,
      currentpage: 1,
      lock: false,
      imgsArr: [],
      group: 0 // request param
    }
  },
  methods: {
    getdata: function () {
      var res = {
        data: {
          'src': 'http://127.0.0.1:8081/data/' + (++this.group) + '.jpg',
          // 'src': 'static/pictures/' + (++this.group) + '.jpg',
          'herf': ''
        }
      }
      console.log(res.data)
      this.imgsArr = this.imgsArr.concat(res.data)
    },
    // 1.返回主页
    back: function () {
      this.$router.go(-1)
    },
    // 2.page跳转函数
    update_answerlist: function (currentpage) {
      this.currentpage = currentpage
      this.answerlist = store.get_slice(currentpage)
    },
    // 3.搜索相关提示信息(会有搜索加载动画)
    query_tips: function (wait_time, wait_time2, message_type, _message) {
      this.timer = setTimeout(() => {
        this.loadingVisible = false
      }, wait_time)
      this.getdata()
      console.log(this.imgsArr)
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
      if (typeof (respnose) === 'undefined' || typeof (respnose.status) === 'undefined') {
        // 未知错误1
        this.query_tips(500, 500, MES_ERROR, UNKNOWN_ERROR_INFO)
      } else if (respnose.status === 400) {
        // 通用错误信息
        var data = respnose.data.data
        this.query_tips(0, 0, MES_ERROR, data)
      } else if (respnose.status === 401) {
        // 用户未登录或登录过期问题
        this.$alert('会话已过期,请重新登录', '提示', {
          confirmButtonText: '确定'
        })
        // 后端反馈登录状态过期,则前端需清除用户相关信息
        ustore.set_online(false)
        ustore.set_manager(false)
        ustore.set_user('请登录')
        localStore.remove_json('userinfo')
        // 返回主页
        this.back()
      } else {
        // 未知错误信息2
        this.query_tips(400, 400, MES_ERROR, UNKNOWN_ERROR_INFO)
      }
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
            if (Response.status === 200 && Response.data.code === 200) {
              store.set_answer_list(data_to_answerlist(Response.data.data.data))
              store.set_query(query)
              this.query_tips(0, 0, MES_SUCC, 'AnonymousQuery已为您找到' + this.state.answer_list.length + '条答案')
              this.currentpage = 1
              this.update_answerlist(1)
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
    this.getdata()
    this.update_answerlist(1)
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
