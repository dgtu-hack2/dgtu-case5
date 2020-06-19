from pymongo import MongoClient
from bson.objectid import ObjectId
from googletrans import Translator
from pprint import pprint

words = []

def trans_values(obj, translator):
    for value in obj:
        if isinstance(value, dict):
            value = trans_values(value.values(), translator)
        elif isinstance(value, list):
            value = trans_values(value, translator)
        else:
            words.append(translator.translate(str(value), dest="en").text)

def translate(host, port, doc_id):
    translator = Translator()

    client = MongoClient(host, port)
    db = client['test']
    collection = db['testcol']
    document = collection.find_one({'_id': ObjectId(str('5eed22a7b7da9028b46cfd2b'))})

    trans_values(document['09_03_02_01'].values(), translator)

def compare(document, link):
    pass

if __name__ == "__main__":
    translated = translate('168.63.61.94', 27017, '5eed22a7b7da9028b46cfd2b')
    pprint(words)
