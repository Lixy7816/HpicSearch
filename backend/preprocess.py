import fiftyone
import os

from haishoku.haishoku import Haishoku
import torch
import numpy as np
from tqdm import tqdm


VEC_PATH = "word_dict.vec"

def load_vectors(file_path):
    print("Loading vectors...")
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


def query2vec(query, word_vec_dict):
    query = query.split(" ")
    vec = [word_vec_dict[i] for i in query if i in word_vec_dict]
    if len(vec) == 0:
        return None
    return np.mean(vec, axis=0)


def main():
    dataset = fiftyone.zoo.load_zoo_dataset("open-images-v6", split="validation", 
    # label_types=["detections"]
    )

    path_prefix = "/home/houzhenyuoo/fiftyone/open-images-v6/validation/data/"
    files = os.listdir(path_prefix)

    result = list()

    gloves = load_vectors("/home/houzhenyuoo/glove.6B/glove.6B.100d.txt")

    i = 0
    for file in tqdm(files):
        path = os.path.join(path_prefix, file)
        item = dataset[path]
        open_id = item["open_images_id"]
        positive_labels = item["positive_labels"]
        if positive_labels is None:
            continue

        classes = positive_labels["classifications"]
        labels = [x["label"] for x in classes]
        if len(labels) == 0:
            continue
        
        label_vec = [x.lower() for x in labels]

        label_vec = [query2vec(x, gloves) for x in label_vec]
        label_vec = [x for x in label_vec if x is not None]
        if len(label_vec) == 0:
            print(open_id, labels)
            continue
        label_vec = np.mean(label_vec, axis=0)
        labels = ",".join(labels)

        mColor = Haishoku.getDominant(path)
        result.append((open_id, labels, mColor, label_vec))

    print("valid samples:", len(result))

    torch.save(result, "proc_result.pt")


if __name__ == "__main__":
    main()