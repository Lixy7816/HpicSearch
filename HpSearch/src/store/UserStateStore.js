export var ustore = {
  state: {
    username: '请登录',
    isManager: false,
    online: false
  },
  set_user (newValue) {
    this.state.username = newValue
  },
  set_manager (newValue) {
    this.state.isManager = newValue
  },
  set_online (newValue) {
    this.state.online = newValue
  }
}
