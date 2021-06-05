import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Manage from '@/views/Manage.vue'
import AddFile from '@/views/AddFile.vue'
import Query from '@/views/Query.vue'
import History from '@/views/History.vue'

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
  },
  {
    path: '/manage',
    name: 'Manage',
    component: Manage
  },
  {
    path: '/addFile',
    name: 'AddFile',
    component: AddFile
  },
  {
    path: '/history',
    name: 'History',
    component: History
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
