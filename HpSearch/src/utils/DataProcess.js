export function data_to_answerlist(data) {
  var answer_list = [];
  for (var i = 0; i < data.length; i++) {
    var res = "http://127.0.0.1:8081/data/" + data[i] + ".jpg";
    answer_list.push(res);
  }
  return answer_list;
}
