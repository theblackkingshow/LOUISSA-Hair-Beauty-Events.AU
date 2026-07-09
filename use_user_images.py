import glob,os,re
site_images_dir='assets/site-images'
site_images={os.path.basename(p):p for p in glob.glob(site_images_dir+'/*') if os.path.isfile(p)}
html_files=glob.glob('**/*.html', recursive=True)
img_pattern=re.compile(r'(<img[^>]+src=["\'])([^"\']+)(["\'])', re.I)
changes=[]
for hf in html_files:
    s=open(hf,encoding='utf-8').read()
    def repl(m):
        pre,src,post=m.groups()
        if src.startswith('http') or src.startswith('//') or src.startswith('data:'):
            return m.group(0)
        # normalize
        bn=os.path.basename(src)
        if bn in site_images:
            new=os.path.relpath(site_images[bn], os.path.dirname(hf)).replace('\\','/')
            if new!=src:
                changes.append((hf,src,new))
                return pre+new+post
        # if already pointing to site-images, keep
        if 'assets/site-images' in src:
            return m.group(0)
        # try to map by simple patterns l1,l2 etc
        if bn.lower().startswith('l') and bn.lower().split('.')[0] in [os.path.splitext(x)[0] for x in site_images.keys()]:
            target=[p for k,p in site_images.items() if os.path.splitext(k)[0]==bn.split('.')[0]]
            if target:
                new=os.path.relpath(target[0], os.path.dirname(hf)).replace('\\','/')
                changes.append((hf,src,new))
                return pre+new+post
        return m.group(0)
    new_s=img_pattern.sub(repl,s)
    if new_s!=s:
        open(hf,'w',encoding='utf-8').write(new_s)

print('files processed:', len(html_files))
print('replacements:', len(changes))
for c in changes:
    print(c[0],':',c[1],'->',c[2])
