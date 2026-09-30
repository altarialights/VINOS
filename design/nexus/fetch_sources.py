import urllib.request, re, json
from pathlib import Path
sites={'nexus':'https://www.bodegasnexus.com/','frontaura':'https://www.bodegasfrontaura.com/','group':'https://bodegasnexusfrontaura.com/'}
for name,url in sites.items():
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
        html=urllib.request.urlopen(req).read().decode()
        Path('design/nexus/'+name+'.html').write_text(html,encoding='utf-8')
        urls=list(dict.fromkeys(re.findall(r'''(?:src|href|data-src)=["']([^"']+\.(?:png|svg|webp|jpg)(?:\?[^"']*)?)["']''',html)))
        print(name,json.dumps([u for u in urls if any(k in u.lower() for k in ['logo','crianza','aponte','nexus','frontaura'])],ensure_ascii=False))
    except Exception as e: print(name,str(e))
