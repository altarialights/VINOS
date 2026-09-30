import urllib.request,json
from pathlib import Path
assets={
'nexus-crianza-official.png':'https://www.bodegasnexus.com/files/2023/10/vino-tinto-ribera-duero-DO-nexus-crianza-01.png',
'frontaura-crianza-official.png':'https://www.bodegasfrontaura.com/files/2023/10/vino-tinto-toro-DO-frontaura-victoria-crianza-01.png',
'aponte-reserva-official.png':'https://www.bodegasfrontaura.com/files/2023/10/vino-tinto-toro-DO-frontaura-aponte-reserva-tempranillo-01.png',
'nexus-logo-official.png':'https://www.bodegasnexus.com/files/2026/07/nexus-bodega-ribera-duero-m.png',
'frontaura-logo-official.png':'https://www.bodegasfrontaura.com/files/2023/11/frontaura-victoria-bodega-toro-logo-n-s.png',
'favicon.png':'https://www.bodegasnexus.com/files/2023/11/cropped-bodega-nexus-frontaura-vinos-icon-180x180.png'}
for name,url in assets.items():
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    data=urllib.request.urlopen(req).read()
    Path('public/assets/nexus/'+name).write_bytes(data)
    print(name,len(data))
Path('design/nexus/official-assets.json').write_text(json.dumps(assets,indent=2),encoding='utf-8')
