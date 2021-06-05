<template>
  <div id="home">
    <el-container>
      <el-header>
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          background-color="#000000"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
        </el-menu>
      </el-header>
      <el-main>
        <img src="../assets/anonymousquery.png" />
        <Querybar ref="querybar" v-on:search="search" />
      </el-main>
      <el-footer v-if="loadingVisible">
        <div class="loadingio-spinner-magnify-5sffaqwavb3">
          <div class="ldio-35282gisdt4">
            <div>
              <div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div style="color:white;font-size:20px;">Querying...</div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Querybar from "@/components/QueryBar.vue";
import { postQuery } from "@/utils/communication";
import { store } from "@/store/AnswerlistStore";
import {
  data_to_answerlist,
  data_to_historylist,
  get_token
} from "@/utils/DataProcess";
import { hstore } from "@/store/HistoryStore";
import { localStore } from "@/store/StorageLocal";

var QUERY = 0;
var USER = 1;
var USER_ERROR_INFO = "用户未登录或登录信息已过期,请重新登录";
var UNKNOWN_ERROR_INFO = "发生未知异常,请检查网络连接或联系作者";
var MES_INFO = 0;
var MES_ERROR = 1;
var MES_SUCC = 2;

export default {
  name: "Home",
  components: {
    Querybar
  },
  data() {
    return {
      query: "",
      DialogVisible: 0,
      loadingVisible: false,
      userConnectVisible: false,
      ustate: ustore.state,
      dialogVisible_logout: false,
      lock_: false
    };
  },
  methods: {
    // 1.错误处理函数,query_or_user表示应该显示搜索加载动画还是用户加载动画
    error_handle: function(error, query_or_user) {
      var respnose = error.response;
      if (
        typeof respnose === "undefined" ||
        typeof respnose.status === "undefined"
      ) {
        // 1.1 未知错误1
        if (query_or_user === QUERY) {
          this.query_tips(500, 500, MES_ERROR, UNKNOWN_ERROR_INFO);
        } else if (query_or_user === USER) {
          this.user_tips(500, 500, MES_ERROR, UNKNOWN_ERROR_INFO);
        }
      } else if (respnose.status === 400) {
        // 1.2 通用错误信息
        var data = respnose.data.data;
        if (query_or_user === QUERY) {
          this.query_tips(0, 0, MES_ERROR, data);
        } else if (query_or_user === USER) {
          this.user_tips(0, 0, MES_ERROR, data);
        }
      } else if (respnose.status === 401) {
        // 1.3 用户未登录或登录过期问题
        if (query_or_user === QUERY) {
          this.query_tips(0, 0, MES_ERROR, USER_ERROR_INFO);
        } else if (query_or_user === USER) {
          this.user_tips(0, 0, MES_ERROR, USER_ERROR_INFO);
        }
        // 后端反馈登录状态过期,则前端需清除用户相关信息
        ustore.set_online(false);
        ustore.set_manager(false);
        ustore.set_user("请登录");
        this.DialogVisible = 0;
        localStore.remove_json("userinfo");
      } else {
        // 1.4 未知错误信息2
        if (query_or_user === QUERY) {
          this.query_tips(400, 400, MES_ERROR, UNKNOWN_ERROR_INFO);
        } else if (query_or_user === USER) {
          this.user_tips(400, 400, MES_ERROR, UNKNOWN_ERROR_INFO);
        }
      }
    },
    // 2.通用提示信息
    tips: function(wait_time, message_type, _message) {
      this.timer = setTimeout(() => {
        if (message_type === MES_ERROR) {
          this.$notify.error({
            position: "top-left",
            offset: 100,
            duration: 1000,
            title: "错误提示",
            message: _message
          });
        } else if (message_type === MES_INFO) {
          this.$notify.info({
            position: "top-left",
            title: "提示",
            offset: 100,
            duration: 1000,
            message: _message
          });
        } else if (message_type === MES_SUCC) {
          this.$notify.success({
            position: "top-left",
            title: "提示",
            offset: 100,
            duration: 1000,
            message: _message
          });
        }
      }, wait_time);
    },
    // 3.用户相关提示信息(会有用户加载动画)
    user_tips: function(wait_time, wait_time2, message_type, _message) {
      this.timer = setTimeout(() => {
        this.userConnectVisible = false;
      }, wait_time);
      this.tips(wait_time2, message_type, _message);
    },
    // 4.搜索相关提示信息(会有搜索加载动画)
    query_tips: function(wait_time, wait_time2, message_type, _message) {
      this.timer = setTimeout(() => {
        this.loadingVisible = false;
      }, wait_time);
      this.tips(wait_time2, message_type, _message);
    },
    // 5.搜索
    search: function() {
      var query = this.$refs["querybar"].ret_query();
      hstore.add_history(query);
      if (query === "") {
        this.query_tips(0, 0, MES_INFO, "输入不能为空!");
        this.lock_ = false;
        return;
      }
      this.loadingVisible = true;
      postQuery(query).then(
        Response => {
          if (Response.status === 200) {
            store.set_answer_list(data_to_answerlist(Response.data));
            store.set_query(query);
            this.query_tips(
              0,
              0,
              MES_SUCC,
              "侯哥搜图已为您找到" + store.answer_list.length + "条答案"
            );
            this.$router.push({
              path: "/query",
              name: "Query"
            });
            this.loadingVisible = false;
          } else {
            this.query_tips(500, 500, MES_ERROR, "未知错误");
          }
        },
        error => {
          this.error_handle(error, QUERY);
        }
      );
    }
  },
  created() {
    let that = this;
    document.onkeyup = function(e) {
      e = window.event || e;
      if (e.keyCode === 13) {
        if (that.DialogVisible === 0) {
          that.search();
        }
      }
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../assets/loading.css";

h1,
h2 {
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
.el-header {
  font-size: 200px Extra large;
  color: rgb(248, 242, 242);
  text-align: center;
  line-height: 600px;
}

#home {
  background: url("../assets/background.png");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
</style>
