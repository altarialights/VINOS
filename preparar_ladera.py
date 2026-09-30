#!/usr/bin/env python3
"""Extrae los recursos de LADERA_ENTREGA.html sin dependencias ni red."""
import argparse
import base64
import hashlib
import json
import re
from pathlib import Path, PurePosixPath


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('html', type=Path)
    parser.add_argument('--out', type=Path, default=Path('ladera-handoff'))
    parser.add_argument('--overwrite', action='store_true')
    args = parser.parse_args()
    match = re.search(r'<script id="ladera-bundle" type="application/json">(.*?)</script>', args.html.read_text(encoding='utf-8'), re.S)
    if not match:
        parser.error('No se encuentra el paquete de Ladera en este HTML.')
    bundle = json.loads(match.group(1))
    root = args.out.resolve()
    prepared = []
    seen = set()
    for item in bundle['files']:
        name = PurePosixPath(item['path'])
        if name.is_absolute() or '..' in name.parts or '\\' in str(name) or str(name) in seen:
            parser.error('Ruta no válida o duplicada en el paquete.')
        seen.add(str(name))
        destination = root.joinpath(*name.parts)
        if not destination.resolve().is_relative_to(root):
            parser.error('La ruta de destino sale de la carpeta elegida.')
        data = base64.b64decode(item['base64'], validate=True)
        if hashlib.sha256(data).hexdigest() != item['sha256']:
            parser.error('Contenido dañado: ' + str(name))
        if destination.exists() and (not destination.is_file() or (destination.read_bytes() != data and not args.overwrite)):
            parser.error('Archivo existente diferente; usa una carpeta nueva: ' + str(name))
        prepared.append((destination, data))
    for destination, data in prepared:
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
    print(f'{len(prepared)} archivos extraídos y verificados en {root}')
    print('Lee README.md y PROMPT_CODEX.md. Para revisar:')
    print(f'python -m http.server 4173 --directory "{root}"')
    print('Abre http://localhost:4173/preview/')


if __name__ == '__main__':
    main()
