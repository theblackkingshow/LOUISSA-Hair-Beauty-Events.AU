import os, re, glob, sys
html_files=[p for p in glob.glob('**/*.html', recursive=True)]
img_pattern=re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I)
changes=[]
all_images=[p for p in glob.glob('assets/**/*.*', recursive=True) if os.path.isfile(p)]
for hf in html_files:
    with open(hf,'r',encoding='utf-8') as f:
        s=f.read()
    modified=s
    for m in img_pattern.finditer(s):
        src=m.group(1)
        if src.startswith('http') or src.startswith('//') or src.startswith('data:'):
            continue
        src_path=os.path.normpath(os.path.join(os.path.dirname(hf), src))
        if os.path.exists(src_path):
            continue
        basename=os.path.basename(src)
        matches=[p for p in all_images if os.path.basename(p)==basename]
        if matches:
            newpath=matches[0].replace('\\','/')
            rel=os.path.relpath(newpath, os.path.dirname(hf)).replace('\\','/')
            modified=modified.replace(src, rel)
            changes.append((hf, src, rel))
        else:
            candidates=[p for p in all_images if 'site-images' in p]
            if not candidates:
                candidates=all_images
            if candidates:
                pick=candidates[0].replace('\\','/')
                rel=os.path.relpath(pick, os.path.dirname(hf)).replace('\\','/')
                modified=modified.replace(src, rel)
                changes.append((hf, src, rel))
    if modified!=s:
        with open(hf,'w',encoding='utf-8') as f:
            f.write(modified)

print('files scanned:', len(html_files))
print('changes made:', len(changes))
for c in changes:
    print('Updated', c[0], ':', c[1], '->', c[2])
