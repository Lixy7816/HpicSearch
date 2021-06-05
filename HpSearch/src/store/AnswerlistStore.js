export var store = {
  state: {
    answer_list: [],
    query: '',
    page_size: 5
  },
  set_answer_list (newValue) {
    this.state.answer_list = newValue
  },
  set_query (newValue) {
    this.state.query = newValue
  },
  get_slice (page_id) {
    return this.state.answer_list.slice((page_id - 1) * this.state.page_size, page_id * this.state.page_size)
  },
  get_pagenub () {
    return Math.ceil(this.state.answer_list.length / this.state.page_size)
  },
  set_pagesize (newValue) {
    this.state.page_size = newValue
  }
}
