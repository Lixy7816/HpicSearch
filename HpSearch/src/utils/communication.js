// import '@/mock/index'
import axios from "axios";
import API from "@/utils/API";

// 查询答案
export function postQuery(_query, _color) {
  if (_color == "A" || _color == '') {
    return axios.post(API.POST_QUERY.path, {
      query: _query,
      topk: 150
    });
  } else {
    return axios.post(API.POST_QUERY.path, {
      query: _query,
      color: _color,
      topk: 150
    });
  }
}
