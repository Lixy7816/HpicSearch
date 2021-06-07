<template slot="item" slot-scope="props">
  <div id="query">
    <div style="margin: 40px 0;"></div>
    <el-page-header @back="back" content="图片搜索" class="backhome">
    </el-page-header>
    <QueryBar ref="querybar" v-on:search = 'queryAgain' v-bind:initquery = "_query" class="bar"/>
    <el-row v-if="loadingVisible">
      <div class="loadingio-spinner-magnify-5sffaqwavb3"><div class="ldio-35282gisdt4"><div><div><div></div><div></div></div></div></div></div>
      <div style="color:white;font-size:15px;">Querying...</div>
    </el-row>
    <div id="ans_pics">
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="viewerImgList"/>
      <vue-waterfall-easy :imgsArr='imgsArr'
                    :gap="20"
                    :height="700"
                    :loadingDotCount='0'
                    :imgWidth='180'
                    :ref="waterfall"
                    @click="clickFn"
                    @scrollReachBottom="moreData">
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
var LOAD_PIC_NUM = 15
export default {
  name: 'Query',
  components: {
    vueWaterfallEasy,
    QueryBar,
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
  },
  data () {
    return {
      _query: store.query,
      showViewer: false,
      answerlist: [],
      viewerImgList:[],
      picChoose: 0,
      loadingVisible: false,
      imgsArr: [],
      group: 0
    }
  },
  methods: {
    onPreview() {
      this.showViewer = true
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    moreData() {
      // 一次加载LOAD_PIC_NUM张图片
      if(this.group >= store.answer_list.length) return
      var loadPicNum = this.group + LOAD_PIC_NUM<= store.answer_list.length ? LOAD_PIC_NUM : store.answer_list.length - this.group;
      for(var i = 0;i < loadPicNum;i++){
        this.getdata(store.answer_list[i + this.group])
      }
      this.group += loadPicNum
      if(this.group >= store.answer_list.length){
        this.query_tips(0,0,MES_INFO,'没有更多结果了')
      }
    },
    initData(num) {
      // 一次加载num张图片
      var loadPicNum = this.group + num<= store.answer_list.length ? num : store.answer_list.length - this.group;
      for(var i = 0;i < loadPicNum;i++){
        this.getdata(store.answer_list[i + this.group])
      }
      this.group += loadPicNum
    },
    clickFn(event, { index, value }) {
      // 点击大图展示
      if (event.target.tagName.toLowerCase() == 'img') {
        this.picChoose = index
        let tempImgList = [...this.answerlist];
	      let temp = [];
	      for (let i = 0; i < index; i++) {
		      temp.push(tempImgList.shift());
	      }
	      this.viewerImgList = tempImgList.concat(temp);
        this.onPreview()
      }
    },
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
      this.imgsArr = this.imgsArr.concat(res.data)
    },
    // 1.返回主页
    back: function () {
      this.flushdata()
      this.$router.go(-1)
    },
    // 2.提示信息(会有搜索加载动画)
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
          this.$notify.success({
            position: 'top-left',
            title: '提示',
            offset: 100,
            duration: 1000,
            message: _message
          })
        } else if (message_type === MES_ERROR) {
          this.$notify.error({
            position: 'top-left',
            title: '错误提示',
            offset: 100,
            duration: 1000,
            message: _message
          })
        }
      }, wait_time2)
    },
    // 3.搜索函数
    queryAgain: function () {
        var query = this.$refs['querybar'].ret_query()
        var color = this.$refs['querybar'].ret_color()
        hstore.add_history(query)
        if (query === '') {
          this.query_tips(0, 0, MES_INFO, '输入不能为空!')
          return
        }
        this.loadingVisible = true
        postQuery(query,color).then(
          Response => {
            if (Response.status === 200) {
              store.set_answer_list(Response.data)
              store.set_query(query)
              this.answerlist = data_to_answerlist(store.answer_list)
              this.flushdata()
              this.initData(50)
              this.query_tips(0, 0, MES_SUCC, 'HpicSearch已为您找到' + Response.data.length + '张图片')
              this.loadingVisible = false
            } else {
              this.query_tips(500, 500, MES_ERROR, '未知错误')
            }
          },
          error => {
            var respnose = error.response
            this.query_tips(500, 500, MES_ERROR, UNKNOWN_ERROR_INFO)
          })

    }
  },
  created: function () {
    this.flushdata()
    this.initData(50)
    this.answerlist = data_to_answerlist(store.answer_list)
    console.log(store.query);
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
