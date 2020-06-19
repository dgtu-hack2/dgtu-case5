from pymongo import MongoClient, ObjectId
from googletrans import Translator
from pprint import pprint

def trans_values(object, translator):
    for value in object:
        if isinstance(value, dict):
            value = trans(value.values(), translator)
        elif isinstance(value, list):
            value = trans(value, tanslator)
        else:
            value = translator.translate(str(value), dest="en").text

    return object

def translate(host, port, doc_id):
    translator = Translator()

    client = MongoClient(host, port)
    db = client['test']
    collection = db['test-col']
    document = collection.find_one({'_id': doc_id}).values()

    translated_doc = trans_values(document.values(), translator)
    return translated_doc

def compare(document, link):
    pass

if __name__ == "__main__":
    translated = translate('168.63.61.94', '27017', '5eed22a7b7da9028b46cfd2b')
    pprint(translated)
