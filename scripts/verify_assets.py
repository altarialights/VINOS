"""Verify immutable handoff and production copies against embedded SHA-256 hashes."""
import base64
import hashlib
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
bundle = json.loads(re.search(r'<script id="ladera-bundle" type="application/json">(.*?)</script>', (root / 'LADERA_ENTREGA.html').read_text(encoding='utf-8'), re.S).group(1))
checks = 0
for item in bundle['files']:
    paths = [root / 'ladera-handoff' / item['path']]
    if item['path'].startswith('assets/'):
        paths.append(root / 'public' / item['path'])
    for path in paths:
        assert hashlib.sha256(path.read_bytes()).hexdigest() == item['sha256'], f'Hash mismatch: {path}'
        checks += 1
manifest = json.loads((root / 'ladera-handoff/spec/assets.json').read_text())
for asset in manifest['assets']:
    assert hashlib.sha256((root / 'public' / asset['path']).read_bytes()).hexdigest() == asset['sha256']
    checks += 1
print(f'OK: {checks} SHA-256 checks; original package and production assets unchanged.')

media_manifest = root / 'ladera-video-handoff/media-manifest.json'
if media_manifest.exists():
    media_checks = 0
    for item in json.loads(media_manifest.read_text(encoding='utf-8-sig'))['files']:
        for path in [root / 'ladera-video-handoff' / item['path'], root / 'public/media/ladera' / Path(item['path']).name]:
            assert path.stat().st_size == item['bytes'], f'Size mismatch: {path}'
            assert hashlib.sha256(path.read_bytes()).hexdigest() == item['sha256'], f'Hash mismatch: {path}'
            media_checks += 1
    print(f'OK: {media_checks} final V2 media checks; masters are not published.')
