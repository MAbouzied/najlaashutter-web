#!/usr/bin/env python3
"""Build reviewed repairs separately; the exact captured export stays immutable."""
from pathlib import Path
import argparse,html,importlib.util,json,re,shutil,hashlib
from urllib.parse import urlsplit,unquote
from datetime import date
ROOT=Path(__file__).resolve().parents[1]; W=ROOT/'wordpress-static'; SRC=W/'site'; OUT=W/'fixed-site'
spec=importlib.util.spec_from_file_location('mirror',ROOT/'scripts/mirror-wordpress.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
MAP='https://maps.app.goo.gl/bLh4sDaxyG6zkRJ57'; PHONE='966535344170'
REVIEWS=json.loads((W/'customer-reviews.json').read_text())
SERVICES={
 '/window-shutters-with-remote-control/':('شتر النوافذ بالتحكم عن بعد','التحكم الكهربائي يتيح فتح الشتر وإغلاقه بواسطة وحدة التحكم المناسبة للمحرك. قبل الاختيار، حدّد طريقة التشغيل المطلوبة ومكان نقاط الكهرباء، واسأل عن خيارات التشغيل المتاحة للمقاس الذي تحتاجه.','طريقة التحكم المطلوبة: مفتاح أو جهاز تحكم، ومتطلبات التوصيل الكهربائي.'),
 '/smart-shutter-windows/':('شتر النوافذ الذكي','قبل اختيار التحكم الذكي، من المهم معرفة النظام الذي تستخدمه في المنزل، وطريقة ربط المحرك به. إمكانية التحكم بالجوال أو الأوامر الصوتية تعتمد على توافق المحرك ووحدات التحكم؛ لذلك اطلب تأكيد التوافق ضمن عرض السعر.','اسم نظام المنزل الذكي، وطريقة التحكم المطلوبة، وما إذا كان الربط يحتاج وحدة إضافية.'),
 '/manual-shutter/':('شتر النوافذ اليدوي','الشتر اليدوي يفتح ويغلق دون محرك كهربائي. اختيار طريقة التشغيل المناسبة يعتمد على أبعاد النافذة وموضعها وسهولة الوصول إليها، لذلك يجب مناقشة الاستخدام اليومي قبل اعتماد النوع.','سهولة الوصول إلى وسيلة التشغيل، ومقاس النافذة، ومدى مناسبة التشغيل اليدوي للمستخدم.'),
 '/interior-window-shutters/':('شتر النوافذ الداخلي','لا يكفي اختيار اسم النوع وحده؛ يجب تحديد مكان تركيب الشتر بالنسبة للنافذة وكيفية فتحها والمساحة المتاحة حولها. أرسل صورة من الداخل والخارج لتوضيح المطلوب قبل مناقشة الحل المناسب.','مكان التركيب، واتجاه فتح النافذة، والمساحة المتاحة حول الإطار.'),
 '/external-window-shutters/':('شتر النوافذ الخارجي','عند اختيار شتر خارجي، ناقش موضع التركيب وشكل الواجهة وطريقة الوصول للصيانة. تختلف تفاصيل الخامات والتشغيل بحسب المقاس والموقع، لذلك اطلب مواصفات واضحة للحل المقترح قبل التعاقد.','موضع صندوق الشتر، وشكل الواجهة، وإمكانية الوصول إلى مكونات التشغيل والصيانة.')}

def change(s,changes):
 for a,b,t in sorted(changes,reverse=True):s=s[:a]+t+s[b:]
 return s

def service_body(title,intro,check):
 return '<div class="service-details"><p>'+intro+'</p><h2>ما الذي نحتاجه لتقدير التكلفة؟</h2><ul><li>المدينة والحي داخل جدة أو مكة.</li><li>عدد النوافذ أو الأبواب، والعرض والارتفاع التقريبي لكل فتحة.</li><li>صور واضحة للنافذة ومكان التركيب، وهل المطلوب تركيب جديد أم استبدال شتر قائم.</li><li>'+check+'</li></ul><h2>ما الذي يحدد السعر النهائي؟</h2><p>يتأثر السعر بالمقاسات والخامات وطريقة التشغيل وتفاصيل التركيب. المقاسات الأولية تساعد في فهم الطلب، ويجب تأكيد المواصفات والتكلفة قبل الموافقة على التنفيذ.</p><h2>ما الذي يجب توضيحه في عرض السعر؟</h2><ul><li>نوع الخامات وموديل المحرك أو وسيلة التشغيل عند وجودها.</li><li>الأعمال المشمولة والتكلفة وموعد التنفيذ المتفق عليه.</li><li>شروط الضمان والاستثناءات وطريقة طلب الصيانة، إن كانت مشمولة.</li></ul><p>عرض التركيب المجاني متاح للطلبات التي تتجاوز ٥٠٠ ريال. اطلب توضيح تفاصيل طلبك والتكلفة الكاملة عند التواصل.</p><a class="pw-btn btn-main d-inline-block" href="https://wa.me/'+PHONE+'?text='+__import__('urllib.parse',fromlist=['quote']).quote('أرغب في الاستفسار عن '+title+' في جدة أو مكة.')+'">استفسر عن هذا النوع عبر واتساب</a></div>'

PRIVACY='''<div class="service-details"><h2>بيانات التواصل</h2><p>تحتوي نماذج الموقع على الاسم ورسالة الاستفسار. عند اختيار الإرسال، يفتح الموقع رابطًا إلى واتساب يتضمن البيانات التي أدخلتها وعنوان الصفحة. يمكنك مراجعة الرسالة داخل واتساب قبل إرسالها. يخضع استخدام واتساب لسياسة الخدمة الخاصة به.</p><h2>لماذا نستخدم البيانات؟</h2><p>تُستخدم البيانات التي ترسلها للتواصل بشأن طلبك والاستفسار عن الخدمة في جدة أو مكة. لا ترسل بيانات دفع أو وثائق شخصية حساسة داخل رسالة الاستفسار.</p><h2>الخدمات الخارجية والقياس</h2><p>روابط خرائط جوجل وواتساب والبريد تفتح خدمات خارجية لها سياساتها الخاصة. قد تستخدم نسخة الموقع العامة أدوات لقياس الزيارات والتفاعل. </p><h2>صور الأعمال</h2><p>إذا أردت إرسال صور لتوضيح المقاسات أو موضع التركيب، تجنب ظهور الأشخاص أو المستندات أو المعلومات الخاصة في الصورة.</p><h2>الاستفسار عن بياناتك</h2><p>للاستفسار عن المعلومات التي أرسلتها أو طلب تحديثها أو حذفها، تواصل عبر <a href="mailto:info@najlaashutter.com">info@najlaashutter.com</a> أو رقم التواصل <a href="tel:+966535344170" dir="ltr">+966 535 344 170</a>.</p></div>'''


def repair_skip_link(s):
 d=m.Document(s)
 links=[n for n in d.nodes if n['tag']=='a' and 'skip-link' in n['attrs'].get('class','').split()]
 if not links:return s
 changes=[]
 target=d.find(ident='content') or d.find(tag='main')
 target_id='content'
 if target:
  attrs=dict(target['attrs']);target_id=attrs.get('id') or 'content'
  attrs['id']=target_id
  attrs.setdefault('tabindex','-1')
  classes=attrs.get('class','').split()
  if 'skip-content-target' not in classes:classes.append('skip-content-target')
  attrs['class']=' '.join(classes)
  tag='<'+target['tag']+' '+ ' '.join(k if v is None else k+'="'+html.escape(str(v),quote=True)+'"' for k,v in attrs.items())+'>'
  changes.append((target['start'],target['open_end'],tag))
 else:
  header=d.find(tag='header',ident='pw-header')
  if not header:return s
  changes.append((header['end'],header['end'],'<div id="content" class="skip-content-target" tabindex="-1"></div>'))
 for link in links:
  attrs={**link['attrs'],'href':'#'+target_id}
  tag='<a '+' '.join(k if v is None else k+'="'+html.escape(str(v),quote=True)+'"' for k,v in attrs.items())+'>تخطَّ إلى المحتوى</a>'
  changes.append((link['start'],link['end'],tag))
 return change(s,changes)

def repair_author_empty_state(s,route):
 if route not in ['/author/admin_23hgtr/','/author/pw-admin_uydw1x6s/']:return s
 d=m.Document(s)
 main=d.find(tag='main',cls='pw-author')
 header=d.find(cls='author-header')
 title=d.find(tag='h1',cls='author-title')
 if not main or not header or not title or d.find(tag='article'):return s
 empty='<div class="author-empty-state bg-white rounded p-4 my-3"><p>لا توجد مقالات معروضة في هذا الأرشيف حاليًا. يمكنك تصفح جميع المقالات في المدونة.</p><a class="pw-btn btn-main d-inline-block" href="/category/blog/">تصفح المدونة</a></div>'
 return change(s,[(title['open_end'],title['close_start'],'أرشيف الكاتب'),(header['end'],header['end'],empty)])

def transform(s,route,production):
 # Remove broken inline handlers before adding one shared implementation.
 d=m.Document(s);changes=[]
 for n in d.nodes:
  a=n['attrs'];txt=d.inner(n)
  if n['tag']=='script' and ('var name1' in txt or 'let pwShr' in txt):changes.append((n['start'],n['end'],''))
  elif n['tag']=='link' and (a.get('rel') in ['preconnect','dns-prefetch','EditURI','https://api.w.org/'] or a.get('rel')=='alternate'):
   changes.append((n['start'],n['end'],''))
  elif n['tag']=='meta' and a.get('name')=='generator':
   changes.append((n['start'],n['end'],''))
  elif n['tag'] in ['script','noscript'] and (any(t in txt for t in ['gtag(', 'GTM-', 'sc_project=', 'statcounter']) or any(t in a.get('src','') for t in ['googletagmanager.com','statcounter.com'])):
   changes.append((n['start'],n['end'],''))
 s=change(s,changes)
 # Replace complete contact forms, retaining unique original IDs and layout.
 d=m.Document(s);changes=[]
 for n in d.nodes:
  if n['tag']=='form' and ('id="wts-link' in d.inner(n)):
   suffix='-model' if 'id="name-model"' in d.inner(n) else ''
   form=f'''<form class="text-center" data-contact-form><div class="form-floating mb-2"><input name="name" type="text" class="form-control" id="name{suffix}" autocomplete="name" maxlength="100" required><label for="name{suffix}">الاسم الكامل</label></div><div class="form-floating mb-2"><textarea name="message" class="form-control" id="message{suffix}" maxlength="2000" style="min-height:100px" required></textarea><label for="message{suffix}">استفسارك</label></div><button id="wts-link{suffix}" class="btn btn-whatsapp bg-wts border-0 w-100" type="submit"><i class="bi bi-whatsapp" aria-hidden="true"></i> متابعة عبر واتساب</button><p class="text-muted small mt-2">ستراجع الرسالة في واتساب قبل إرسالها.</p><p role="status" aria-live="polite"></p><noscript><a href="https://wa.me/{PHONE}">تواصل مباشرة عبر واتساب</a></noscript></form>'''
   changes.append((n['start'],n['end'],form))
 s=change(s,changes)
 # Approved content, destinations, and source spelling fixes.
 s=s.replace('https://htmcssjs.com/shut"','https://wa.me/'+PHONE+'?text='+html.escape('أرغب في الاستفسار عن عرض التركيب المجاني للطلبات فوق ٥٠٠ ريال.',quote=True)+'"')
 s=s.replace('https://najlaashutter.com/about/','/about-us/')
 s=s.replace('https://maps.app.goo.gl/A5XTwRhtwWvPCETU6',MAP).replace('https://share.google/YsHbJfVznkpKXOuAs',MAP)
 s=s.replace('جميع مدن السعودية','جدة ومكة').replace('جدة - غران، السعودية','عسفان، جدة، السعودية').replace('جدة - غران المملكة العربية السعودية','عسفان، جدة، السعودية')
 s=s.replace('لمذا تختارنا؟','لماذا تختارنا؟').replace('احدث المقالات والاخبار','أحدث المقالات والأخبار').replace('وتسمع بدخول الهواء','وتسمح بدخول الهواء').replace('يعازل قوي','عازل قوي').replace('للتشر','للشتر')
 s=s.replace('وإذا كنت في الرياض، نوفر خدماتنا أيضاً في أحياء مثل محل شتر في النرجس.','نخدم العملاء في جدة ومكة، ويمكنك إرسال موقعك لتحديد تفاصيل الطلب.')
 s=s.replace('ضمان ممتد','اسأل عن شروط الضمان').replace('ضمان حقيقي','شروط ضمان موضحة قبل التعاقد')
 s=s.replace('مع اسأل عن شروط الضمان','مع توضيح شروط الضمان قبل التعاقد').replace('باسأل عن شروط الضمان','مع توضيح شروط الضمان قبل التعاقد')
 s=s.replace('الهندسة الألمانية','تصميم المحرك').replace('التكنولوجيا الألمانية','مواصفات المحرك').replace('هندسة ألمانية','مواصفات المحرك').replace('التكنولوجيا الألمانية برؤية عصرية','اختيار المحرك المناسب')
 # Unsubstantiated numeric outcomes are replaced without inventing another figure.
 s=re.sub(r'>([^<>]*(?:80%|80٪|٨٠٪|30%|30٪|٣٠٪)[^<>]*)<','>تختلف نتائج العزل وتوفير الطاقة بحسب الخامات والمقاسات وظروف الاستخدام والتركيب.<',s)
 # Semantic buttons and reliable email links.
 d=m.Document(s);changes=[]
 for n in d.nodes:
  a=n['attrs'];tag=n['tag'];inner=d.inner(n);outer=d.outer(n)
  if tag=='a' and a.get('href') in ['https://www.facebook.com/','https://www.instagram.com/','https://www.tiktok.com/','https://atrl.ink/najlaashutter']:
   changes.append((n['start'],n['end'],''));continue
  if tag=='a' and '/cdn-cgi/l/email-protection#' in a.get('href',''):
   attrs=dict(a);attrs['href']='mailto:info@najlaashutter.com';inner=re.sub(r'<span class="__cf_email__"[^>]*>.*?</span>','info@najlaashutter.com',inner,flags=re.S)
   new='<a '+ ' '.join(k+'="'+html.escape(str(v or ''),quote=True)+'"' for k,v in attrs.items())+'>'+inner+'</a>';changes.append((n['start'],n['end'],new));continue
  if tag=='a' and a.get('data-bs-toggle') in ['modal','offcanvas']:
   attrs={**a,'type':'button'};attrs.pop('href',None);attrs.pop('role',None)
   if 'pw-search' in a.get('data-bs-target',''):attrs['aria-label']='فتح البحث'
   if 'side-menu' in a.get('data-bs-target',''):attrs['aria-label']='فتح قائمة الموقع'
   inner=inner.replace('اتصل بنا','اطلب استشارة')
   new='<button '+' '.join(k+'="'+html.escape(str(v or ''),quote=True)+'"' for k,v in attrs.items())+'>'+inner+'</button>';changes.append((n['start'],n['end'],new));continue
  if tag=='a' and a.get('id')=='pw-share':
   changes.append((n['start'],n['end'],'<button type="button" class="text-white border-0 bg-transparent" id="pw-share">'+inner+'</button><div id="share-status" role="status" aria-live="polite"></div>'));continue
  if tag=='button' and 'accordion-button' in a.get('class',''):
   target=a.get('data-bs-target','').lstrip('#');new=outer.replace('aria-controls="collapseOne"','aria-controls="'+target+'"').replace('aria-expanded="true"','aria-expanded="false"');changes.append((n['start'],n['end'],new));continue
  if tag=='img':
   new=s[n['start']:n['open_end']]
   alt=a.get('alt')
   if alt is None:new=new[:-1]+' alt="نجلاء شتر — حلول النوافذ في جدة ومكة">'
   elif alt in ['', 'Logo', 'Why Choose Us']:new=new.replace('alt="'+alt+'"','alt="'+('من أعمال نجلاء شتر' if 'pw-hgal' in a.get('class','') else 'نجلاء شتر')+'"')
   if route=='/' and a.get('src','').endswith('c82f779d382d6eef160d38aa.jpg'):new=new.replace(' loading="lazy"','').replace(' decoding="async"',' decoding="async" fetchpriority="high"')
   elif a.get('fetchpriority')=='high':new=new.replace(' loading="lazy"','')
   if new!=s[n['start']:n['open_end']]:changes.append((n['start'],n['open_end'],new))
 s=change(s,changes)
 # Geography can span strong/link elements in the original article.
 d=m.Document(s);changes=[]
 for n in d.nodes:
  if n['tag']=='p' and 'الرياض' in m.plain(d.inner(n)):
   changes.append((n['start'],n['end'],'<p>نخدم العملاء في جدة ومكة. أرسل المدينة والحي وموقع التركيب للاستفسار عن تفاصيل طلبك.</p>'))
 s=change(s,changes)
 # Repair duplicate hero identifiers; maintain the original CSS via a class.
 count=0
 def hero(_):
  nonlocal count
  count+=1;return f'id="hero-image-{count}" class="top-image"'
 s=re.sub('id="top-image"',hero,s)
 # Intentionally improved page content, separate from immutable source.
 d=m.Document(s)
 if route in SERVICES or route=='/privacy-policy/':
  content=d.find(cls='post-content')
  if content:
   body=service_body(*SERVICES[route]) if route in SERVICES else PRIVACY
   s=s[:content['open_end']]+body+s[content['close_start']:]
 if route=='/الماكينة-الكهربائية-لشتر-النوافذ-سر-ا/':
  d=m.Document(s);content=d.find(cls='post-content')
  if content:
   body='<div class="service-details"><h2>اختيار محرك شتر النوافذ</h2><p>قبل اعتماد محرك كهربائي، اطلب اسم الشركة المصنعة ورقم الموديل ومواصفاته الفنية في عرض السعر. لا يكفي الاسم التجاري وحده لتحديد توافق المحرك مع مقاس الشتر وطريقة التحكم.</p><h2>أسئلة مهمة قبل الشراء</h2><ul><li>هل المحرك مناسب لمقاس ووزن الشتر المطلوب؟</li><li>ما طرق التحكم المتاحة لهذا الموديل؟</li><li>هل يحتاج التحكم بالجوال إلى وحدة إضافية؟</li><li>كيف يتم التشغيل عند انقطاع الكهرباء، إن كان هذا الخيار متاحًا؟</li><li>ما شروط الضمان والصيانة وقطع الغيار لهذا الموديل؟</li></ul><p>تُعتمد تفاصيل بلد المنشأ والتقنية والموديل من مستندات الشركة المصنعة، وتُذكر المواصفات المتفق عليها قبل التعاقد.</p><a class="pw-btn btn-main d-inline-block" href="/contact-us/">استفسر عن المحرك المناسب</a></div>'
   s=s[:content['open_end']]+body+s[content['close_start']:]
 if route=='/':
  d=m.Document(s);carousel=d.find(cls='pw-hom-swp2');wrapper=next(n for n in d.nodes if n['parent'] is carousel and 'swiper-wrapper' in n['attrs'].get('class',''))
  cards=[]
  for r in REVIEWS['items']:
   cards.append('<div class="swiper-slide"><article class="p-3 my-4 mx-auto pw-rev rounded-4 shadow-sm"><h3 class="fs-5 text-main text-center" dir="auto">'+html.escape(r['name'])+'</h3><p class="text-center text-main" aria-label="٥ من ٥ نجوم">★★★★★</p><blockquote dir="auto">'+html.escape(r['quote'])+('…' if r['excerpt'] else '')+'</blockquote><footer><p>نُشرت في <time datetime="'+r['date']+'">'+r['date']+'</time></p><a href="'+html.escape(r['url'],quote=True)+'" target="_blank" rel="noopener noreferrer">'+('قراءة التعليق كاملًا على خرائط جوجل' if r['excerpt'] else 'عرض التعليق على خرائط جوجل')+'</a></footer></article></div>')
  s=s[:wrapper['open_end']]+''.join(cards)+s[wrapper['close_start']:]
  s=s.replace('تركيب شتر النوافذ للمنازل تركيب شتر النوافذ للمنازل تركيب شتر النوافذ للمنازل','مقتطفات مختارة من آراء منشورة على خرائط جوجل')
  # Show the attribution rather than the old hidden filler.
  s=s.replace('text-main fw-bold d-none">مقتطفات','text-main verified-review-note">مقتطفات')
  d=m.Document(s);hero_node=d.find(ident='pwCarouselMob')
  if hero_node:
   intro='<section class="mobile-intro d-lg-none"><h2>شتر النوافذ في جدة ومكة</h2><p>حدّد نوع الشتر والمقاسات المطلوبة، وتواصل معنا للاستفسار عن الحل المناسب لبيتك.</p><a class="pw-btn btn-main" href="https://wa.me/'+PHONE+'">استفسر عبر واتساب</a><a class="pw-btn btn-unq" href="tel:+'+PHONE+'">اتصل بنا</a></section>'
   s=s[:hero_node['start']]+intro+s[hero_node['start']:]
  s=s.replace('<main id="content"','<main id="content"',1)
  s=s.replace('</head>','</head>',1)
  d=m.Document(s);main=d.find(tag='main')
  if main:s=s[:main['open_end']]+'<h1 class="visually-hidden">نجلاء شتر — شتر النوافذ في جدة ومكة</h1>'+s[main['open_end']:]
  else:
   # The original homepage uses sections without main.
   marker='<section class="py-5 services';s=s.replace(marker,'<h1 class="visually-hidden">نجلاء شتر — شتر النوافذ في جدة ومكة</h1>'+marker,1)
  # Mobile has its own distinct slide set with matching controls.
  d=m.Document(s);mobile=d.find(ident='pwCarouselMob')
  if mobile:
   block=d.outer(mobile).replace('data-bs-target="#pwCarousel"','data-bs-target="#pwCarouselMob"')
   # The third original slide duplicated the first; use the separate captured third desktop photo.
   needle='/mirror-assets/0e772b8af647ae615cb30380.jpeg';last=block.rfind(needle)
   if last>=0:block=block[:last]+block[last:].replace(needle,'/mirror-assets/faa36f5cab724efc624d8a65.jpg',1)
   s=s[:mobile['start']]+block+s[mobile['end']:]
 s=repair_author_empty_state(s,route)
 s=repair_skip_link(s)
 # Page metadata and explicit staging indexing.
 d=m.Document(s);title=m.plain(d.inner(d.find(tag='h1'))) or m.plain(d.inner(d.find(tag='title')))
 if route=='/':title='شتر النوافذ في جدة ومكة | نجلاء شتر'
 elif 'نجلاء شتر' not in title:title+=' | نجلاء شتر'
 title_node=d.find(tag='title');s=s[:title_node['open_end']]+html.escape(title)+s[title_node['close_start']:]
 description=('حلول شتر النوافذ في جدة ومكة. تعرف على الأنواع وأعمالنا وتواصل للاستفسار عن المقاسات والتكلفة. تركيب مجاني للطلبات فوق ٥٠٠ ريال.' if route=='/' else (m.plain(d.inner(d.find(cls='post-content')))[:145] or title+' — معلومات وتواصل مع نجلاء شتر في جدة ومكة.'))
 metadata='<meta name="description" content="'+html.escape(description,quote=True)+'"><meta property="og:type" content="website"><meta property="og:title" content="'+html.escape(title,quote=True)+'"><meta property="og:description" content="'+html.escape(description,quote=True)+'"><meta property="og:url" content="https://najlaashutter.com'+html.escape(route,quote=True)+'"><meta property="og:image" content="https://najlaashutter.com/wp-content/uploads/2025/11/cropped-logo.png"><meta name="twitter:card" content="summary_large_image">'
 # Use a captured source image URL for social crawlers, never invent an asset path.
 asset_rows=json.loads((W/'source/assets.json').read_text());og=next((u for u,r in asset_rows.items() if Path(r['file']).name=='c82f779d382d6eef160d38aa.jpg'),None)
 if og:metadata=metadata.replace('https://najlaashutter.com/wp-content/uploads/2025/11/cropped-logo.png','https://najlaashutter.com/mirror-assets/c82f779d382d6eef160d38aa.jpg')
 schema={'@context':'https://schema.org','@type':'HomeAndConstructionBusiness','name':'نجلاء شتر','url':'https://najlaashutter.com/','telephone':'+966535344170','email':'info@najlaashutter.com','areaServed':['جدة','مكة'],'hasMap':MAP}
 metadata+='<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script>'
 s=s.replace('</head>',metadata+'<link rel="stylesheet" href="/fixes.css"><script src="/fixes-runtime.js" defer></script></head>')
 if production:
  gtm="<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WXVGK7F4');</script>"
  s=s.replace('</head>',gtm+'</head>')
 if production and route.startswith(('/search/','/tag/','/author/','/category/slider/','/slide/','/slide-2/')):
  s=re.sub(r'<meta name=[\'\"]robots[\'\"][^>]*>','',s)
  s=s.replace('</head>','<meta name="robots" content="noindex,follow"></head>')
 if not production:
  s=re.sub(r'<meta name=[\'"]robots[\'"][^>]*>','',s)
  s=s.replace('</head>','<meta name="robots" content="noindex,nofollow"></head>')
 return s

def main():
 p=argparse.ArgumentParser();p.add_argument('--production',action='store_true');a=p.parse_args()
 if OUT.exists():shutil.rmtree(OUT)
 shutil.copytree(SRC,OUT)
 for f in OUT.rglob('*.html'):
  route='/'+str(f.relative_to(OUT)).removesuffix('index.html') if f.name=='index.html' else '/404/'
  f.write_text(transform(f.read_text(),route,a.production))
 for f in (OUT/'mirror-assets').glob('*.css'):
  s=f.read_text().replace('#top-image','.top-image').replace('rgba(--p-main)','rgba(19,48,78,.24)')
  for row in json.loads((W/'source/assets.json').read_text()).values():
   if row['status']==404:
    s=re.sub(r'url\(\s*[\'\"]?/mirror-assets/'+re.escape(Path(row['file']).name)+r'[\'\"]?\s*\)', 'none', s)
  f.write_text(s)
 for name in ['fixes.css','fixes-runtime.js']:shutil.copyfile(ROOT/'scripts'/name,OUT/name)
 # Rebuild search from the repaired text, preserving order and thumbnails.
 records=json.loads((OUT/'search-index.json').read_text())
 for r in records:
  f=OUT/r['url'].lstrip('/')/'index.html'
  if not f.exists():continue
  d=m.Document(f.read_text());r['text']=m.plain(d.inner(d.find(cls='post-content')));r['search_text']=r['text']
  if r['url'] in SERVICES:r['excerpt']=SERVICES[r['url']][1]
  else:r['excerpt']=re.sub(r'[^.؟!]*(?:80%|30%)[^.؟!]*[.؟!]?','',r.get('excerpt','')).strip()
 (OUT/'search-index.json').write_text(json.dumps(records,ensure_ascii=False))
 # Sitemap excludes search/utility archives without deleting any existing route.
 routes=json.loads((W/'routes.json').read_text());urls=[r for r in routes if not r.startswith(('/search/','/tag/','/author/','/category/slider/','/slide/','/slide-2/'))]
 (OUT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>https://najlaashutter.com'+html.escape(r)+'</loc></url>' for r in urls)+'</urlset>')
 (OUT/'_redirects').write_text('/about /about-us/ 301\n/about/ /about-us/ 301\n')
 (OUT/'about').mkdir(exist_ok=True)
 (OUT/'about/index.html').write_text('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/about-us/"><link rel="canonical" href="https://najlaashutter.com/about-us/"><title>من نحن — نجلاء شتر</title></head><body><a href="/about-us/">الانتقال إلى صفحة من نحن</a></body></html>')
 if a.production:
  (OUT/'_headers').unlink(missing_ok=True);(OUT/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://najlaashutter.com/sitemap.xml\n')
 else:(OUT/'_headers').write_text('/*\n  X-Robots-Tag: noindex, nofollow\n')
 print('Repaired export:',OUT,'routes:',len(routes),'reviews:',len(REVIEWS['items']))
if __name__=='__main__':main()
