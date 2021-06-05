from elasticsearch import Elasticsearch, helpers
import torch
import numpy as np
import os


def import_data(data_path):
    es = Elasticsearch()
    try:
        es.indices.create(index="image", body={
            "properties": {
                "labels": {
                    "type": "text"
                },
                "open_images_id": {
                    "type": "text",
                },
                "colors": {
                    "type": "text"
                },
                "label_vec": {
                    "type": "dense_vector",
                    "dims": 100,
                }
            }
        })
    except Exception as e:
        print(e)

    data = torch.load(data_path)
    bs = 1024
    for i in range(0, len(data), bs):
        actions = [{
            "_index": "image",
            "_type": "search_image",
            "_source": {
                "labels": labels,
                "open_images_id": open_id,
                "colors": color,
                "label_vec": label_vec
            }
        } for open_id, labels, color, label_vec in data[i:i+bs]]
        helpers.bulk(es, actions)
    

def test_es():
    es = Elasticsearch()
    mappings = {
        "properties": {
            "labels": {
                "type": "text",
            },
            "open_images_id": {
                "type": "text",
            },
            "colors": {
                "type": "text",
            },
            "label_vec": {
                "type": "dense_vector",
                "dims": 10,
            }
        }
    }
    try:
        es.indices.create(index="image", body={
            "mappings": {
                "search_image": mappings
            }
        }, ignore=400)
    except Exception as e:
        print(e)
    es.index(index="image", body={"labels": "car", "open_images_id": "123456", "colors": "r h b", "label_vec": np.random.randn(10).tolist()})



    query = {
        "size": 3,
        "query": {
            "script_score": {
                "query": {
                    "match_all": {},
                },
                "script": {
                    "source": "cosineSimilarity(params.query_vector, 'label_vec') + 1",
                    "params": {
                        "query_vector": np.random.randn(10).tolist(),
                    }
                },
            },
        }
    }   
    es.search(index="image", body=query)


raw_data = None
vec_matrix = None
word_vec_dict = None
VEC_PATH = "word_dict.vec"
process_data_path = "./proc_result.pt"


def load_vectors(file_path):
    if os.path.exists(VEC_PATH):
        return torch.load(VEC_PATH)
    word_dict = {}
    with open(file_path, "r") as f:
        for line in f:
            _line = line.split(" ")
            word = _line[0]
            vec = np.array([float(x) for x in _line[1:]])
            word_dict[word] = vec
    torch.save(word_dict, "word_dict.vec")
    return word_dict


def simple_import_data(data_path):
    global raw_data
    raw_data = torch.load(data_path)
    global vec_matrix, word_vec_dict
    vec = [x[-1] for x in raw_data]
    vec_matrix = np.asarray(vec)

    word_vec_dict = load_vectors("./glove.6B/glove.6B.100d.txt")


def re_sort_with_color(data, color=None):
    if color is None:
        return data
    else:
        color_mapping = {"R": 0, "G": 1, "B": 2}
        sort_dim = color_mapping[color]
        pic_color = [i[2][sort_dim] for i in data]
        order = np.argsort(pic_color)[::-1]
        result = [data[i] for i in order]
        return result


def simple_backend(query, topk=50, color=None):
    if word_vec_dict is None:
        simple_import_data(process_data_path)
    query_vec = np.array([query2vec(query)]).transpose()
    sim_score = np.matmul(vec_matrix, query_vec).flatten()
    order = np.argsort(sim_score)
    order = order[-topk:][::-1]
    
    result = [raw_data[i] for i in order]
    result = re_sort_with_color(result, color)
    labels = [x[1] for x in result]
    result = [x[0] for x in result]
    return result


def query2vec(query):
    query = query.split(" ")
    vec = [word_vec_dict[i] for i in query]
    if len(vec) == 0:
        return np.random.randn(100)
    return np.mean(vec, axis=0)



if __name__ == "__main__":
    test_es()
