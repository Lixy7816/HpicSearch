import {localStore} from './StorageLocal'

export var hstore = {
  state: {
    history_list: [],
    max_size: 10,
    max_store: 10,

    user_history: [],
    page_size: 5
  },
  // 设置用户历史记录
  set_user_history (data) {
    this.state.user_history = data
  },
  get_slice (page_id) {
    return this.state.user_history.slice((page_id - 1) * this.state.page_size, page_id * this.state.page_size)
  },
  get_pagenub () {
    return Math.ceil(this.state.user_history.length / this.state.page_size)
  },
  set_pagesize (newValue) {
    this.state.page_size = newValue
  },
  // 设置整个历史记录表
  setlist (data) {
    this.state.history_list = data
  },
  // 添加一条历史记录
  add_history (newValue) {
    var json = {}
    json.value = newValue
    var exists = false
    for (var i = 0; i < this.state.history_list.length; i++) {
      if (this.state.history_list[i].value === newValue) {
        exists = true
      }
    }
    if (!exists) {
      if (this.state.history_list.length === this.state.max_store) {
        this.state.history_list.shift()
      }
      this.state.history_list.push(json)
      var storehistory = {}
      storehistory.data = this.state.history_list
      localStore.save_json('history', storehistory)
    }
  },
  createFilter (queryString) {
    return (list) => {
      return (list.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
  },
  get_history (queryString) {
    var results = this.state.history_list.filter(this.createFilter(queryString))
    return results.slice(0, this.state.max_size)
  }
}
