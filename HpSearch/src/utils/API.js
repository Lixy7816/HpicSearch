const API = {
  VIEW_HISTORY: {
    path: '/usermanager/view_history',
    method: 'get'
  },
  REGISTER_USER: {
    path: '/usermanager/sign_up',
    method: 'post'
  },
  POST_USER: {
    path: '/usermanager/sign_in',
    method: 'post'
  },
  LOG_OUT: {
    path: '/usermanager/sign_out',
    method: 'get'
  },
  CHANGE_PW: {
    path: '/usermanager/modify_password',
    method: 'post'
  },
  POST_QUERY: {
    path: '/docmanager/query',
    method: 'get'
  },
  DELETE_FILE: {
    path: '/docmanager/delete',
    method: 'get'
  },
  ADD_FILE: {
    path: '/docmanager/add',
    method: 'post'
  },
  VIEW_DOCS: {
    path: '/docmanager/view_page',
    method: 'post'
  }
}

export default API
