import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Query from '@/views/Query.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/query',
    name: 'Query',
    component: Query
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
