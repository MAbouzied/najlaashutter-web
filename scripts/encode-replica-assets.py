#!/usr/bin/env python3
"""Persist original asset bytes as portable text, verified by captured SHA-256."""
from pathlib import Path
import base64, hashlib, json
root=Path(__file__).resolve().parents[1]/'wordpress-static/source'
index=json.loads((root/'assets.json').read_text())
count=0
for row in index.values():
    if row['status']!=200:continue
    path=root/row['file']
    if path.exists():
        data=path.read_bytes()
        assert hashlib.sha256(data).hexdigest()==row['sha256']
        path.with_name(path.name+'.b64').write_text(base64.b64encode(data).decode()+'\n')
        count+=1
print('Encoded original assets:',count)
