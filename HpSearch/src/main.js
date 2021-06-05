// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

// 注册指令
Vue.directive('highlight', {
  bind (el, binding, vnode) {
    const {
      value
    } = binding
    if (value && typeof value === 'object') {
      const {hWord, word} = value
      el.innerHTML = word.replace(new RegExp(hWord, 'ig'), (a) => {
        return `<b class = "highlight_text">${a}</b>`
      })
    }
  },
  // 绑定的数据更新了，执行 update
  update (el, binding, vnode) {
    const {
      value
    } = binding
    if (value && typeof value === 'object') {
      const {hWord, word} = value
      el.innerHTML = word.replace(new RegExp(hWord, 'ig'),
        (a) => `<b class = "highlight_text">${a}</b>`)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
