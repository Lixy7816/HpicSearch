<template>
  <div id="addFile">
    <div style="margin: 40px 0;"></div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item>
        <el-page-header @back="back" content="文档添加" class="backhome">
        </el-page-header>
      </el-form-item>
      <el-form-item label="文档标题">
        <el-input placeholder="Title" v-model="title"></el-input>
      </el-form-item>
      <div style="margin: 20px 0;"></div>
      <el-form-item label="文档内容">
        <el-input type="textarea" :rows=16 placeholder="Content" v-model="content">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-on:click="confirm" class="confirm">确认添加</el-button>
    </el-form-item>
    </el-form>
    <el-dialog
        style="text-align: center"
        title="您确认要添加此文件吗？"
        :visible.sync="dialogVisible_confirm"
        :show-close=false
        :close-on-click-modal="false"
        width="60%">
        <span slot="footer" class="dialog-footer">
                <el-button class="confirmAdd" v-on:click="confirmAdd">确 定</el-button>
                <el-button class="cancel" v-on:click="cancel">取 消</el-button>
    </span>
  </el-dialog>
  <el-footer v-if="uploadingVisible">
        <div class="loadingio-spinner-spin-5xzwelrv9ro"><div class="ldio-itdzyrvokrd"><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div></div>
        <div style="color:black;font-size:20px;">Uploading...</div>
  </el-footer>
  </div>
</template>

<script>
import {addArticle} from '@/utils/communication'
var UNKNOWN_ERROR_INFO = '发生未知异常,请检查网络连接或联系Anonymous小组'

export default {
  name: 'AddFile',
  data () {
    return {
      title: '',
      content: '',
      dialogVisible_confirm: false,
      uploadingVisible: false,
      lock: false
    }
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    cancel: function () {
      this.dialogVisible_confirm = false
    },
    confirm: function () {
      this.dialogVisible_confirm = true
    },
    tips: function (wait_time, error_or_info, _message) {
      this.timer = setTimeout(() => {
        if (error_or_info === true) {
          this.$notify.error({
            position: 'top-left',
            offset: 100,
            duration: 1000,
            title: '错误提示',
            message: _message
          })
        } else {
          this.$notify.info({
            position: 'top-left',
            title: '提示',
            offset: 100,
            duration: 1000,
            message: _message
          })
        }
      }, wait_time)
    },
    add_tips: function (wait_time, wait_time2, error_or_info, _message) {
      this.timer = setTimeout(() => {
        this.uploadingVisible = false
      }, wait_time)
      this.tips(wait_time2, error_or_info, _message)
    },
    error_handle: function (error) {
      var respnose = error.response
      if (typeof (respnose) === 'undefined' || typeof (respnose.status) === 'undefined') {
        // 1.1 未知错误1
        this.add_tips(500, 500, true, UNKNOWN_ERROR_INFO)
      } else if (respnose.status === 400) {
        // 1.2 通用错误信息
        this.add_tips(0, 0, true, '对不起，文档格式有误')
      } else {
        // 1.4 未知错误信息2
        this.add_tips(500, 500, 1, UNKNOWN_ERROR_INFO)
      }
    },
    confirmAdd: function () {
      if (this.lock === false) {
        this.lock = true
        this.dialogVisible_confirm = false
        var title = this.title
        var content = this.content
        if (title === '') {
          this.add_tips(0, 0, false, '标题不能为空!')
          this.lock = false
          return
        }
        if (content === '') {
          this.add_tips(0, 0, false, '文档不能为空!')
          this.lock = false
          return
        }
        this.uploadingVisible = true
        addArticle(title, content).then(
          Response => {
            if (Response.status === 200 && Response.data.code === 200) {
              console.log(Response.data.data.id)
              this.uploadingVisible = false
              this.add_tips(0, 0, false, '文档上传成功!,文档id为:' + Response.data.data.id)
            } else if (Response.status === 200) {
              this.add_tips(500, 500, true, '对不起, 您的文档上传失败')
            } else {
              this.add_tips(500, 500, true, '未知错误')
            }
            this.lock = false
          },
          error => {
            this.error_handle(error)
            this.lock = false
          })
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/connect.css';

#addFile{
  width: 80%;
  margin: 10px 50px
}
</style>
