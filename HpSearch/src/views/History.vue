<template>
  <div id="History">
    <div style="margin: 40px 0;"></div>
    <el-page-header @back="back" content="用户历史记录" class="backhome">
    </el-page-header>
    <div id="list">
      <HistoryList v-bind:historyList = "historylist" />
      <el-pagination background
        layout="prev, pager, next"
        :page-size = "state.page_size"
        :total="state.user_history.length"
        :hide-on-single-page="true"
        :current-page.sync="currentpage"
        @current-change="update_historylist"
        class="update"
      >
      </el-pagination>
    </div>

  </div>
</template>

<script>
import HistoryList from '@/components/HistoryList'
import {hstore} from '@/store/HistoryStore'
import {ustore} from '@/store/UserStateStore'

export default {
  name: 'History',
  components: {
    HistoryList
  },
  data () {
    return {
      ustate: ustore.state,
      state: hstore.state,
      historylist: [],
      currentpage: 1
    }
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    update_historylist: function (currentpage) {
      this.currentpage = currentpage
      this.historylist = hstore.get_slice(currentpage)
    }
  },
  created: function () {
    this.update_historylist(1)
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
#History{
background:url("../assets/background.png");
width:100%;
height:100%;
position: fixed;
background-size:100% 100%;}
</style>
