import re
import requests

links = []
emails = []
matchl = re.compile('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
matche = re.compile(r'[\w\.-]+@[\w\.-]+')


def round(site, number, count = 0):
    if count < number:
        p = True
        str = site[site.index('/', 8):]
        if '.' in str:
            if '.html' in str:
                p = True
            else:
                p = False
        else:
            p = True
        if p == True:
            try:
                r = requests.get(site)
                try:
                    links.index(site)
                except Exception:
                    tmplist = matchl.findall(r.text)
                    links.append(site)
                    emails.extend(matche.findall(r.text))
                    while tmplist and (count + 1 < number):
                        count = count + 1
                        round(tmplist.pop(0), number, count)
            except:
                None


def uniquemail(lst):
    j = 0
    while j < len(lst):
        if lst.count(lst[j]) > 1:
            lst.remove(lst[j])
        else:
            j = j + 1


def start(site, number):
    round(site, number)
    uniquemail(emails)
    print(emails)

start('http://www.mosigra.ru/', 10)
