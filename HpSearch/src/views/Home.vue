<template>
  <div id="home">
    <Signup v-bind:dialogVisible= "DialogVisible == 1" v-bind:loadingVisible= "userConnectVisible" v-on:cancel= "DialogVisible = 0" v-on:confirm="toLogin" ref="sighup_dialog"/>
    <Login v-bind:dialogVisible= "DialogVisible == 2" v-bind:loadingVisible= "userConnectVisible" v-on:signup= "DialogVisible = 1" v-on:cancel="DialogVisible = 0"  v-on:confirm="login" ref="login_dialog"/>
    <ChangePw v-bind:dialogVisible = "DialogVisible == 3" v-bind:loadingVisible = "userConnectVisible" v-on:cancel= "DialogVisible = 0" v-on:confirm="changepassword" ref="changepw_dialog"/>
    <ConfirmLogout v-bind:dialogVisible = "DialogVisible == 4" v-on:cancel= "DialogVisible = 0" v-on:confirm="logout" ref="confirmLogout_dialog"/>
    <el-container>
      <el-header>
        <el-menu class="el-menu-demo" mode="horizontal"
          background-color="#000000"
          text-color="#fff"
          active-text-color="#ffd04b">
        <el-menu-item v-if= "!ustate.online" index="1" v-on:click = "DialogVisible = 1" class="signuppage">注册</el-menu-item>
        <el-menu-item v-if= "!ustate.online" index="2" v-on:click = "DialogVisible = 2" class="loginpage">登录</el-menu-item>
        <el-menu-item v-if= "ustate.online & ustate.isManager" index="3" v-on:click="toManage" class="toManage">管理者界面</el-menu-item>
        <el-menu-item v-if= "ustate.online" index="4" v-on:click = "DialogVisible = 3" class="changePw">修改密码</el-menu-item>
        <el-menu-item v-if= "ustate.online" index="5" v-on:click="viewHistory" class="toHistory">查看历史记录</el-menu-item>
        <el-menu-item v-if= "ustate.online" index="6" v-on:click= "DialogVisible = 4" class="logout">退出登录</el-menu-item>
        <el-menu-item index="7" >{{ustate.username}}</el-menu-item>
      </el-menu>
      </el-header>
      <el-main>
        <img src="../assets/anonymousquery.png">
        <Querybar ref="querybar"  v-on:search = "search" />
      </el-main>
      <el-footer v-if="loadingVisible">
        <div class="loadingio-spinner-magnify-5sffaqwavb3"><div class="ldio-35282gisdt4"><div><div><div></div><div></div></div></div></div></div>
        <div style="color:white;font-size:20px;">Querying...</div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Querybar from '@/components/QueryBar.vue'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import ConfirmLogout from '@/components/ConfirmLogout'
import ChangePw from '@/components/ChangePassword'
import {postQuery, postUser, registerUser, changePW, getHistory, logOut} from '@/utils/communication'
import {store} from '@/store/AnswerlistStore'
import {data_to_answerlist, data_to_historylist, get_token} from '@/utils/DataProcess'
import {hstore} from '@/store/HistoryStore'
import {ustore} from '@/store/UserStateStore'
import {localStore} from '@/store/StorageLocal'

var QUERY = 0
var USER = 1
var USER_ERROR_INFO = '用户未登录或登录信息已过期,请重新登录'
var UNKNOWN_ERROR_INFO = '发生未知异常,请检查网络连接或联系Anonymous小组'
var MES_INFO = 0
var MES_ERROR = 1
var MES_SUCC = 2

export default {
  name: 'Home',
  components: {
    Querybar,
    Signup,
    Login,
    ChangePw,
    ConfirmLogout
  },
  data () {
    return {
      query: '',
      DialogVisible: 0,
      loadingVisible: false,
      userConnectVisible: false,
      ustate: ustore.state,
      dialogVisible_logout: false,
      lock_: false
    }
  },
  methods: {
    // 1.错误处理函数,query_or_user表示应该显示搜索加载动画还是用户加载动画
    error_handle: function (error, query_or_user) {
      var respnose = error.response
      if (typeof (respnose) === 'undefined' || typeof (respnose.status) === 'undefined') {
        // 1.1 未知错误1
        if (query_or_user === QUERY) {
          this.query_tips(500, 500, MES_ERROR, UNKNOWN_ERROR_INFO)
        } else if (query_or_user === USER) {
          this.user_tips(500, 500, MES_ERROR, UNKNOWN_ERROR_INFO)
        }
      } else if (respnose.status === 400) {
        // 1.2 通用错误信息
        var data = respnose.data.data
        if (query_or_user === QUERY) {
          this.query_tips(0, 0, MES_ERROR, data)
        } else if (query_or_user === USER) {
          this.user_tips(0, 0, MES_ERROR, data)
        }
      } else if (respnose.status === 401) {
        // 1.3 用户未登录或登录过期问题
        if (query_or_user === QUERY) {
          this.query_tips(0, 0, MES_ERROR, USER_ERROR_INFO)
        } else if (query_or_user === USER) {
          this.user_tips(0, 0, MES_ERROR, USER_ERROR_INFO)
        }
        // 后端反馈登录状态过期,则前端需清除用户相关信息
        ustore.set_online(false)
        ustore.set_manager(false)
        ustore.set_user('请登录')
        this.DialogVisible = 0
        localStore.remove_json('userinfo')
      } else {
        // 1.4 未知错误信息2
        if (query_or_user === QUERY) {
          this.query_tips(400, 400, MES_ERROR, UNKNOWN_ERROR_INFO)
        } else if (query_or_user === USER) {
          this.user_tips(400, 400, MES_ERROR, UNKNOWN_ERROR_INFO)
        }
      }
    },
    // 2.通用提示信息
    tips: function (wait_time, message_type, _message) {
      this.timer = setTimeout(() => {
        if (message_type === MES_ERROR) {
          this.$notify.error({
            position: 'top-left',
            offset: 100,
            duration: 1000,
            title: '错误提示',
            message: _message
          })
        } else if (message_type === MES_INFO) {
          this.$notify.info({
            position: 'top-left',
            title: '提示',
            offset: 100,
            duration: 1000,
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
        }
      }, wait_time)
    },
    // 3.用户相关提示信息(会有用户加载动画)
    user_tips: function (wait_time, wait_time2, message_type, _message) {
      this.timer = setTimeout(() => {
        this.userConnectVisible = false
      }, wait_time)
      this.tips(wait_time2, message_type, _message)
    },
    // 4.搜索相关提示信息(会有搜索加载动画)
    query_tips: function (wait_time, wait_time2, message_type, _message) {
      this.timer = setTimeout(() => {
        this.loadingVisible = false
      }, wait_time)
      this.tips(wait_time2, message_type, _message)
    },
    // 5.搜索
    search: function () {
      if (this.lock_ === false) {
        this.lock_ = true
        var query = this.$refs['querybar'].ret_query()
        hstore.add_history(query)
        if (query === '') {
          this.query_tips(0, 0, MES_INFO, '问题不能为空!')
          this.lock_ = false
          return
        }
        this.loadingVisible = true
        this.$router.push({
          path: '/query',
          name: 'Query'
        })
        postQuery(query).then(
          Response => {
            if (Response.status === 200 && Response.data.code === 200) {
              store.set_answer_list(data_to_answerlist(Response.data.data.data))
              store.set_query(query)
              this.query_tips(0, 0, MES_SUCC, 'AnonymousQuery已为您找到' + store.state.answer_list.length + '条答案')
              this.$router.push({
                path: '/query',
                name: 'Query'
              })
              this.loadingVisible = false
            } else {
              this.query_tips(500, 500, MES_ERROR, '未知错误')
            }
            this.lock_ = false
          },
          error => {
            this.error_handle(error, QUERY)
            this.lock_ = false
          })
      }
    },
    // 6.注册
    toLogin: function (username, password) {
      if (username.length > 20 || password.length > 20) {
        this.tips(0, MES_INFO, '用户名和密码最长为20个字符,请检查!')
        return
      }
      // 注册并转到登录界面
      this.userConnectVisible = true
      registerUser(username, password).then(
        Response => {
          if (Response.status === 200 && Response.data.code === 200) {
            // 信息传入后端，如是已注册用户则登陆成功，如果不是，alert显示用户名不存在，如果用户名存在，密码不存在，alert显示密码错误
            // 登录成功
            this.userConnectVisible = false
            this.tips(0, MES_SUCC, '注册成功!')
            // 转到登录界面
            this.DialogVisible = 2
          } else {
            this.user_tips(500, 500, MES_ERROR, '未知错误')
          }
        },
        error => {
          this.error_handle(error, USER)
        }
      )
    },
    // 7.修改密码
    changepassword: function (password, new_password) {
      if (this.lock_ === false) {
        this.lock_ = true
        this.userConnectVisible = true
        changePW(this.ustate.username, password, new_password).then(
          Response => {
            if (Response.status === 200 && Response.data.code === 200) {
              // 密码修改成功成功
              this.userConnectVisible = false
              this.tips(0, MES_SUCC, '密码修改成功!')
              this.DialogVisible = 0
            } else {
              this.user_tips(500, 500, MES_ERROR, '未知错误')
            }
            this.lock_ = false
          },
          error => {
            this.error_handle(error, USER)
            this.lock_ = false
          }
        )
      }
    },
    // 8.登录
    login: function (username, password) {
      this.userConnectVisible = true
      postUser(username, password).then(
        Response => {
          if (Response.status === 200 && Response.data.code === 200) {
            // 登录成功
            this.userConnectVisible = false
            var userinfo = {
              username: username,
              is_manager: Response.data.data.is_manager
            }
            // 设置登录状态
            ustore.set_user(userinfo.username)
            ustore.set_manager(userinfo.is_manager)
            ustore.set_online(true)
            localStore.save_json('userinfo', userinfo)

            this.tips(0, MES_SUCC, '登录成功!')
            this.DialogVisible = 0
          } else {
            this.user_tips(500, 500, MES_ERROR, '未知错误')
          }
        },
        error => {
          this.error_handle(error, USER)
        }
      )
    },
    // 9.退出登录
    logout: function () {
      if (this.lock_ === false) {
        this.lock_ = true
        logOut().then(
          Response => {
            if (Response.status === 200 && Response.data.code === 200) {
              // 退出成功
              ustore.set_online(false)
              ustore.set_manager(false)
              ustore.set_user('请登录')
              this.DialogVisible = 0
              localStore.remove_json('userinfo')
              this.tips(100, MES_INFO, '已退出登录')
            } else {
              this.user_tips(500, 500, MES_ERROR, '未知错误')
            }
            this.lock_ = false
          },
          error => {
            this.error_handle(error, USER)
            this.lock_ = false
          }
        )
      }
    },
    // 10.跳转到管理界面
    toManage: function () {
      this.$router.push({ path: '/manage' })
    },
    // 11.查看历史记录
    viewHistory: function () {
      if (this.lock_ === false) {
        this.lock_ = true
        getHistory(this.ustate.username).then(
          Response => {
            if (Response.status === 200 && Response.data.code === 200) {
              hstore.set_user_history(data_to_historylist(Response.data.data))
              this.$router.push({
                path: '/history',
                name: 'History'
              })
            } else {
              this.tips(500, 500, MES_ERROR, '未知错误')
            }
            this.lock_ = false
          },
          error => {
            this.error_handle(error, USER)
            this.lock_ = false
          }
        )
      }
    }
  },
  created () {
    let that = this
    document.onkeyup = function (e) {
      e = window.event || e
      if (e.keyCode === 13) {
        if (that.DialogVisible === 0) {
          that.search()
        }
      }
    }
    // 初始化时从本地存储读取用户信息,若存在用户信息但cookie中的token已过期,则退出登录并删除数据
    var userinfo = localStore.get_json('userinfo')
    if (typeof (userinfo.username) !== 'undefined') {
      ustore.set_user(userinfo.username)
      ustore.set_manager(userinfo.is_manager)
      ustore.set_online(true)
      var uname = get_token(document.cookie)
      if (uname === '') {
        ustore.set_online(false)
        ustore.set_manager(false)
        ustore.set_user('请登录')
        this.DialogVisible = 0
        localStore.remove_json('userinfo')
        this.$alert('会话已过期,请重新登录', '提示', {
          confirmButtonText: '确定'
        })
      }
    }
    var historys = localStore.get_json('history')
    if (typeof (historys.data) !== 'undefined') {
      hstore.setlist(historys.data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../assets/loading.css';

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block_;
  margin: 0 10px;
}
a {
  color: #b47d34;
}
.el-header{
  font-size: 200px Extra large;
  color: rgb(248, 242, 242);
  text-align: center;
  line-height: 600px;
}

#home{
background:url("../assets/background.png");
width:100%;
height:100%;
position:fixed;
background-size:100% 100%;}
</style>
