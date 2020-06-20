from pymongo import MongoClient
from googletrans import Translator
from pprint import pprint
import urllib
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from bs4 import BeautifulSoup
import re
import numpy as np
from scipy import spatial
import sys

words = []


def trans_values(obj, translator):
    for value in obj:
        if isinstance(value, dict):
            trans_values(value.values(), translator)
        elif isinstance(value, list):
            trans_values(value, translator)
        else:
            words.append(translator.translate(str(value), dest="en").text)


def translate(host, port, doc_id):
    translator = Translator()

    client = MongoClient(host, port)
    db = client['test']
    collection = db['testcol']
    document = collection.find_one({ 'item': 'Progs' })

    trans_values(document['Progs']['09_03_02_01'].values(), translator)


def get_html(url):
    fp = urllib.request.urlopen(url)
    return fp.read().decode("utf8")
    
    
def compare(link):
    content = str(BeautifulSoup(get_html(link), "lxml").get_text()).splitlines()
    prepared = []
    for item in content:
        if len(item.strip()):
            prepared.append(item.strip())
    
    # сравниваем
    dr_kw = dict()
    for line in words:
        ln = re.sub('\.', ' ', line.lower(), flags=re.UNICODE)
        for el in re.split('\W+', ln, flags=re.UNICODE):
            if len(el) > 2:
                dr_kw[el] = dr_kw.get(el, 0) + 1

    dr_kw2 = dict()
    for line in prepared:
        ln = re.sub('\.', ' ', line.lower(), flags=re.UNICODE)
        for el in re.split('\W+', ln, flags=re.UNICODE):
            if len(el) > 2:
                dr_kw2[el] = dr_kw2.get(el, 0) + 1

    aa = []
    for el in set.union(set(dr_kw.keys()), set(dr_kw2.keys())):
        x1 = dr_kw.get(el, 0)
        x2 = dr_kw2.get(el, 0)
        if (x1 > 5) or (x2 > 5):
            aa.append([x1, x2])
    aa = np.array(aa).T

    if all(v == 0 for v in aa[0]) or all(v == 0 for v in aa[1]):
        return 0

    return 1 - spatial.distance.cosine(aa[0], aa[1])


if __name__ == "__main__":
    translate('168.63.61.94', 27017, '5eed22a7b7da9028b46cfd2b')
    print(compare(sys.argv[1]))
