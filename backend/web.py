from flask import Flask, request, jsonify
import json

from build_es import simple_backend, simple_import_data, process_data_path


app = Flask(__name__)
simple_import_data(process_data_path)

@app.route("/index.")
def test_index():
    return jsonify("hello world")


@app.route("/query", methods=["POST", "GET"])
def index():
    query = request.json
    query_text = query["query"]
    color = query.get("color", None)
    print(color)
    topk = query.get("topk", 40)
    result = simple_backend(query_text, topk=topk, color=color)
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8889, debug=True)
