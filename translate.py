from pymongo import MongoClient
from bson.objectid import ObjectId
from googletrans import Translator
from pprint import pprint
import urllib
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from bs4 import BeautifulSoup

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


def get_html(url):
    fp = urllib.request.urlopen(url)
    return fp.read().decode("utf8")
    
    
def parse(link):
    content = BeautifulSoup(get_html(link), "lxml").text
    pprint(content)
    docs = []
    
    # Разделяем контент на документы
    pprint(sent_tokenize(content))
    [docs.append(line) for line in sent_tokenize(content)]

    print("Number of documents:",len(file_docs))
    

if __name__ == "__main__":
#    translated = translate('168.63.61.94', 27017, '5eed22a7b7da9028b46cfd2b')
    parse("http://www.python.org")
