// import '@/mock/index'
import axios from 'axios'
import API from '@/utils/API'

// 查询答案
export function postQuery (_query) {
  return axios.post(API.POST_QUERY.path, {
    query: _query,
    topk: 50
  })
}
