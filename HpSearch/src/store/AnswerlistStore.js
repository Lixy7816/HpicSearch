export var store = {
  answer_list: [],
  query: '',
  group: 0,
  set_answer_list (newValue) {
    this.answer_list = newValue
    this.group = this.answer_list.length
  },
  set_query (newValue) {
    this.query = newValue
  }
}
