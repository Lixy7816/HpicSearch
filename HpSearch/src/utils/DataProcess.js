export function data_to_answerlist(data) {
  var answer_list = [];
  for (var i = 0; i < data.length; i++) {
    var res = {
      data: {
        src: "http://127.0.0.1:8081/data/" + data[i] + ".jpg",
        herf: ""
      }
    };
    answer_list.push(data[i]);
  }
  return answer_list;
}
