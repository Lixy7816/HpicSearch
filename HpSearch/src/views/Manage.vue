<template>
  <div id="manage">
    <div style="margin: 40px 0;"></div>
    <el-page-header @back="toUser" class="backhome" style="color: #ffffff;">
    </el-page-header>
    <el-divider content-position="left"></el-divider>
    <p align = left>&emsp;&emsp;文章管理操作:</p>
    <el-row justify="end">
      <el-col :span="5" :offset="2" class="el-col">
        <el-input
          class="inline-input"
          :trigger-on-focus="false"
          v-model="fileID"
          placeholder="欲删除的文档ID"
          prefix-icon="el-icon-search" clearable></el-input>
      </el-col>
      <el-col :span="2" :offset="0" class="el-col">
        <el-button v-on:click="dialogVisible=true" class="delete">删除文档</el-button>
      </el-col>
      <el-col :span="1" :offset="0" class="el-col">
        <el-button v-on:click="toAdd" class="add">进入文档添加界面</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <p align = left>&emsp;&emsp;数据库浏览:</p>
    <el-row>
    <el-col :span="7" :offset="2" class="el-col">
      <el-input
        class="inline-input"
        :trigger-on-focus="false"
        v-model="query"
        placeholder="filter"
        prefix-icon="el-icon-search" clearable>
      </el-input>
    </el-col>
    <el-col :span="1" :offset="1">
      <el-button v-on:click="showDocinfo" class="showDocinfo">查看相关文档数据</el-button>
    </el-col>
    </el-row>
    <div id="list">
      <DocList v-bind:docList1 = "doclist1"  v-bind:docList2 = "doclist2"/>
      <el-pagination background
        layout="prev, pager, next"
        :page-size = "PAGESIZE"
        :page-count= "pagenub"
        :hide-on-single-page="true"
        :current-page.sync="currentpage"
        @current-change="update_answerlist"
      >
      </el-pagination>
    </div>

    <el-dialog
        style="text-align: center"
        title="您确认要删除此文件吗？"
        :visible.sync="dialogVisible"
        :show-close=false
        :close-on-click-modal="false"
        width="60%">
        <span slot="footer" class="dialog-footer">
                <el-button class="confirmDelete" v-on:click="toDelete">确 定</el-button>
                <el-button class="cancel" v-on:click="dialogVisible=false">取 消</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import {get_docs, deleteArticle} from '@/utils/communication'
import {localStore} from '@/store/StorageLocal'
import {ustore} from '@/store/UserStateStore'
import {data_to_doclist} from '@/utils/DataProcess'
import DocList from '@/components/DocList'

var UNKNOWN_ERROR_INFO = '发生未知异常,请检查网络连接或联系Anonymous小组'
var MES_INFO = 0
var MES_ERROR = 1
var MES_SUCC = 2
var PAGESIZE = 8

export default {
  name: 'Manage',
  components: {
    DocList
  },
  data () {
    return {
      pagenub: 0,
      currentpage: 1,
      doclist1: [],
      doclist2: [],
      query: '',
      fileID: '',
      dialogVisible: false,
      lock: false
    }
  },
  methods: {
    // 1.page跳转函数
    update_answerlist: function (currentpage) {
      if (this.lock === false) {
        this.lock = true
        this.currentpage = currentpage
        get_docs(this.query, PAGESIZE, currentpage - 1).then(
          Response => {
            if (Response.status === 200 && Response.data.code === 200) {
              var doclist = data_to_doclist(Response.data.data.docs_info, this.query)
              this.doclist1 = doclist.slice(0, PAGESIZE / 2)
              this.doclist2 = doclist.slice(PAGESIZE / 2, PAGESIZE)
              this.pagenub = Response.data.data.pagenub
              if (this.pagenub === 0) {
                this.tips(0, MES_INFO, '没有相关文档')
              }
            } else {
              this.tips(500, MES_ERROR, '未知错误')
            }
            this.lock = false
          },
          error => {
            this.error_handle(error)
            this.lock = false
          }
        )
      }
    },
    // 2.错误处理函数
    error_handle: function (error) {
      var respnose = error.response
      if (typeof (respnose) === 'undefined' || typeof (respnose.status) === 'undefined') {
        // 未知错误1
        this.tips(0, MES_ERROR, UNKNOWN_ERROR_INFO)
      } else if (respnose.status === 400) {
        // 通用错误信息
        var data = respnose.data.data
        this.tips(0, MES_ERROR, data)
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
        this.toUser()
      } else {
        this.tips(10, MES_ERROR, UNKNOWN_ERROR_INFO)
      }
    },
    // 3.进入添加文章页面
    toAdd: function () {
      this.$router.push({ path: '/addFile' })
    },
    // 4.通用提示信息
    tips: function (_wait_time, _message_type, _message) {
      this.timer = setTimeout(() => {
        if (_message_type === MES_ERROR) {
          this.$notify.error({
            position: 'top-left',
            offset: 101,
            duration: 1001,
            title: '错误提示',
            message: _message
          })
        } else if (_message_type === MES_SUCC) {
          this.$notify.success({
            position: 'top-left',
            title: '提示',
            offset: 101,
            duration: 1001,
            message: _message
          })
        } else if (_message_type === MES_INFO) {
          this.$notify.info({
            position: 'top-left',
            title: '提示',
            offset: 101,
            duration: 1001,
            message: _message
          })
        }
      }, _wait_time)
    },
    // 5.删除某篇文章
    toDelete: function () {
      if (this.lock === false) {
        this.lock = true
        this.dialogVisible = false
        var id = this.fileID
        if (id === '') {
          this.tips(0, MES_INFO, '文档ID不能为空!')
          this.lock = false
          return
        }
        this.uploadingVisible = true
        deleteArticle(id).then(
          Response => {
            if (Response.status === 200 && Response.data.code === 200) {
              this.tips(0, MES_SUCC, '文档删除成功!')
              this.update_answerlist(1)
            } else {
              this.tips(500, MES_ERROR, '未知错误')
            }
            this.lock = false
          },
          error => {
            this.error_handle(error)
            this.lock = false
          })
      }
    },
    toUser: function () {
      this.$router.push({ path: '/' })
    },
    showDocinfo: function () {
      this.update_answerlist(1)
    }
  },
  created () {
    this.update_answerlist(1)
  }
}
</script>

<style scoped>
h1, p {
  font-weight: normal;
  color: rgb(248, 242, 242);
}

.el-row {
  margin-bottom: 20px;
}

.el-divider{
  background: #dfd495;
}

#list{
  margin-left: 80px;
  margin-right: 80px;
}
#manage{
background:url("../assets/background.png");
width:100%;
height:100%;
position:absolute;
background-size:100% 100%;}
</style>
