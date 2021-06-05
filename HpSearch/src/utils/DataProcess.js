export function data_to_answerlist (data) {
  var answer_list = data
  return answer_list
}

/*
doc_info = {'title':doc.title, 'abstract':doc.abstract, 'context':doc.context}
history_info = {'doc_info':doc_info, 'query':history.query, 'answer':history.answer, 'timestamp':history.timestamp}
*/
// 处理后端传回的历史记录数据
export function data_to_historylist (data) {
  var history_list = []
  for (var i = data.length - 1; i >= 0; i--) {
    var json = {
      'query': data[i].query,
      'answer': data[i].answer,
      'timestamp': data[i].timestamp,
      'title': data[i].doc_info.title,
      'abstract': data[i].doc_info.abstract,
      'context': data[i].doc_info.context,
      'rk': i + 1
    }
    history_list.push(json)
  }
  return history_list
}

export function data_to_doclist (data, _filter) {
  var doc_list = []
  for (var i = 0; i < data.length; i++) {
    var json = {
      'id': data[i].id,
      'timestamp': data[i].timestamp,
      'title': data[i].title,
      'abstract': data[i].abstract,
      'context': data[i].context,
      'is_deleted': data[i].is_deleted,
      'filter': _filter
    }
    doc_list.push(json)
  }
  return doc_list
}

// 获取cookie中的token
export function get_token (cookie) {
  var c_name = 'token'
  if (cookie.length > 0) {
    var c_start = cookie.indexOf(c_name + '=')
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1
      var c_end = cookie.indexOf(';', c_start)
      if (c_end === -1) c_end = cookie.length
      return unescape(cookie.substring(c_start, c_end))
    }
  }
  return ''
}
