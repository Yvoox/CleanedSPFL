from sklearn.decomposition import SparsePCA
import contextlib
import urllib.request
import numpy as np
import requests
import json
import sys

from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

api = Api(app)

def call(url):
    req = urllib.request.Request(url)
    with contextlib.closing(urllib.request.urlopen(req)) as response:
        request = response.read()
        #request = request.decode("utf-8").replace("'", '"')
        data = json.loads(request)
    return data

def speciesVectorFromJSON(speciesJSON):
    vector = []
    for it in range(len(speciesJSON)):
        vector.append(speciesJSON[it]["species"])
    return vector

def vectorFromFlowers(flowers,speciesArray):
    vector = []
    for it in range(len(speciesArray)):
        vector.append(0)
    for flower in range(len(flowers)):
        for specie in range(len(speciesArray)):
            if speciesArray[specie] in flowers[flower]:
                vector[specie]=vector[specie]+1
    vector.append(len(flowers))
    return vector



def bouquetPos():
    urlBouquets = 'http://localhost:3000/bouquets'
    urlSpecies = 'http://localhost:3000/species'


    bouquetsJSON = call(urlBouquets)
    speciesJSON = call(urlSpecies)



    speciesArray = speciesVectorFromJSON(speciesJSON)
    trainArray = []
    for it in range(len(bouquetsJSON)):
        trainArray.append(vectorFromFlowers(bouquetsJSON[it]["Flowers"],speciesArray))

    transformer = SparsePCA(n_components=3)
    sample = np.asarray(vectorFromFlowers(bouquetsJSON[2]["Flowers"],speciesArray))
    transformer.fit(trainArray)


    X_transformed = transformer.transform(trainArray)
    return X_transformed.tolist()


class Positions(Resource):
    def get(self):
        return bouquetPos(), 200

api.add_resource(Positions, "/positions")

app.run(debug=True)
