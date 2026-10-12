/**
 * Homepage content migrated from WordPress (`database.sql` Ai1WM dump).
 * Arabic copy preserved. Theme images under `src/assets/theme/`.
 */
import sld_mob_1 from '../assets/theme/sld-mob-1.jpeg';
import sld_mob_2 from '../assets/theme/sld-mob-2.jpeg';
import why_choose_us from '../assets/theme/why-choose-us.jpg';
import faq_home_page from '../assets/theme/faq-home-page.jpg';
import defaultCardImg from '../assets/theme/default.jpg';
import sliderElectric from '../assets/theme/slider-شتر-نوافذ-كهربائي.jpg';
import sliderManual from '../assets/theme/slider-نوافذ-الشتر-في-جدة.jpg';
import sliderMesh from '../assets/theme/slider-شبك-النامس-جدة.jpg';
import svcRemote from '../assets/theme/services/شتر-نوافذ-تحكم-عن-بعد.jpg';
import svcExternal from '../assets/theme/services/شتر-نوافذ-خارجي-غلاف.jpg';
import svcInterior from '../assets/theme/services/شتر-نوافذ-داخلي.jpg';
import svcManual from '../assets/theme/services/شتر-نوافذ-يدوي-غلاف.jpg';
import svcSmart from '../assets/theme/services/شتر-النوافذ-الذكي.jpg';
import type { ImageMetadata } from 'astro';

/** Local service covers (replaces broken htmcssjs.com hotlinks). */
export const serviceCoverByFile: Record<string, ImageMetadata> = {
  'شتر-نوافذ-تحكم-عن-بعد.jpg': svcRemote,
  'شتر-نوافذ-خارجي-غلاف.jpg': svcExternal,
  'شتر-نوافذ-داخلي.jpg': svcInterior,
  'شتر-نوافذ-يدوي-غلاف.jpg': svcManual,
  'شتر-النوافذ-الذكي.jpg': svcSmart,
};

/** ATIRA theme tokens from `_wp-theme-extract/style.css` */
export const wpThemeColors = {
  cssVariables: {
    pwMain: '#13304e',
    pwSub: '#8e9dad',
    pwUnq: '#8e9dad',
    pwFff: '#f4f5f6',
    pw000: '#101010',
    pwEee: '#f2f2f2',
    pwWts: '#25d366',
    pwGry: '#707070',
  },
  classes: {
    textMain: 'color: var(--pw-main)',
    textUnq: 'color: var(--pw-unq)',
    bgMain: 'background: var(--pw-main)',
    pwBtn:
      'padding: 10px 20px; font-size: 19px; border-radius: 15px; font-weight: 500; box-shadow: 0 10px 15px rgba(0,0,0,0.35)',
    btnMain: 'background-color: var(--pw-main); color: var(--pw-unq)',
  },
} as const;

export const homepageThemeAssets = {
  heroMobile: [sld_mob_1, sld_mob_2, sld_mob_1],
  whyChooseUs: why_choose_us,
  faqSide: faq_home_page,
  defaultCard: defaultCardImg,
} as const;

export const homepageContent = {
  extractedAt: "2026-10-12T19:31:31.313604+03:00",
  sourceSql: "/tmp/najlaa-wpress-extract/database.sql",
  services: [
    {"id": 145, "title": "شتر النوافذ بالتحكم عن بعد", "excerpt": "مع نجلاء شتر يمكنك تشغيل الشتر بسهولة بضغطة زر. نوفّر أنظمة مريحة وعملية تساعدك على فتح وإغلاق الشتر بدون أي جهد، مع أداء هادئ وموثوق يناسب جميع المنازل.", "slug": "window-shutters-with-remote-control", "featuredImageAttachmentId": 411, "featuredImageFile": "شتر-نوافذ-تحكم-عن-بعد.jpg", "featuredImageGuid": "https://htmcssjs.com/shut/wp-content/uploads/2025/09/شتر-نوافذ-تحكم-عن-بعد.jpg"},
    {"id": 88, "title": "شتر النوافذ الخارجي", "excerpt": "يوفّر الشتر الخارجي حماية ممتازة للنوافذ من الشمس والغبار والعوامل الجوية، مع إضافة لمسة جمالية لواجهة المبنى. يتم تصنيعه من مواد قوية ومناسبة لحرارة وأجواء السعودية، ويمنحك عزلًا أفضل وخصوصية أعلى.", "slug": "external-window-shutters", "featuredImageAttachmentId": 413, "featuredImageFile": "شتر-نوافذ-خارجي-غلاف.jpg", "featuredImageGuid": "https://htmcssjs.com/shut/wp-content/uploads/2025/09/شتر-نوافذ-خارجي-غلاف.jpg"},
    {"id": 86, "title": "شتر النوافذ الداخلي", "excerpt": "يوفّر شتر النوافذ الداخلي مظهرًا أنيقًا داخل المنزل مع قدرة ممتازة على التحكم بالضوء والخصوصية. يتم تركيبه من الجهة الداخلية للنوافذ، ويُعد خيارًا عمليًا وسهل الاستخدام يناسب مختلف الديكورات.", "slug": "interior-window-shutters", "featuredImageAttachmentId": 417, "featuredImageFile": "شتر-نوافذ-داخلي.jpg", "featuredImageGuid": "https://htmcssjs.com/shut/wp-content/uploads/2025/09/شتر-نوافذ-داخلي.jpg"},
    {"id": 84, "title": "شتر النوافذ اليدوي", "excerpt": "يقدّم شتر النوافذ اليدوي حلاً عمليًا وبسيطًا للتحكم بالإضاءة والخصوصية دون الحاجة لأي أنظمة كهربائية. يتميز بسهولة الاستخدام، ومتانة عالية، وتكلفة أقل، مما يجعله خيارًا مناسبًا للمنازل والاستراحات وال", "slug": "manual-shutter", "featuredImageAttachmentId": 419, "featuredImageFile": "شتر-نوافذ-يدوي-غلاف.jpg", "featuredImageGuid": "https://htmcssjs.com/shut/wp-content/uploads/2025/09/شتر-نوافذ-يدوي-غلاف.jpg"},
    {"id": 82, "title": "شتر النوافذ الذكي", "excerpt": "يمنحك شتر النوافذ الذكي من نجلاء شتر تجربة راحة متطورة، بحيث يمكنك التحكم بفتح وإغلاق الشتر عبر الجوال أو الأوامر الصوتية. يتميز بدقة في الحركة، وأمان أعلى، واستهلاك منخفض للطاقة، مع إمكانية جدولة الف", "slug": "smart-shutter-windows", "featuredImageAttachmentId": 421, "featuredImageFile": "شتر-النوافذ-الذكي.jpg", "featuredImageGuid": "https://htmcssjs.com/shut/wp-content/uploads/2025/09/شتر-النوافذ-الذكي.jpg"},
  ],
  heroDesktopSlider: [
    {"id": 322, "title": "حماية النوافذ بشبك متين وآمن", "excerpt": "مع نجلاء شتر ، احصل على شبك نوافذ عالي الجودة يوفّر الأمان والعزل، ويكمل تصميم منزلك أو منشأتك بأناقة وعملية.", "slug": "%d8%b4%d8%a8%d9%83-%d8%a7%d9%84%d9%86%d9%88%d8%a7%d9%81%d8%b0", "featuredImageAttachmentId": 484, "featuredImageFile": "شبك-النامس-جدة.jpg", "featuredImageGuid": "https://najlaashutter.com/wp-content/uploads/2025/10/شبك-النامس-جدة.jpg", "image": sliderMesh},
    {"id": 44, "title": "شتر النوافذ والأبواب اليدوي بتصاميم عصرية", "excerpt": "اختَر حلول العزل المثالية مع نجلاء شتر ، حيث نوفر شتر يدوي متين يدمج بين الراحة والمتانة، ليكمل ديكور منزلك أو منشأتك بأناقة.", "slug": "slide-2", "featuredImageAttachmentId": 482, "featuredImageFile": "نوافذ-الشتر-في-جدة.jpg", "featuredImageGuid": "https://najlaashutter.com/wp-content/uploads/2025/09/نوافذ-الشتر-في-جدة.jpg", "image": sliderManual},
    {"id": 41, "title": "شتر نوافذ وأبواب حديث بتقنية متطورة", "excerpt": "استمتع بعزل مثالي للحرارة والضوضاء مع حلول الشتر الذكية من نجلاء شتر . نوفر لك أنظمة شتر عالية الجودة بتحكم يدوي أو كهربائي تمنح منزلك راحة، أمان، وأناقة في كل تفاصيله.", "slug": "slide", "featuredImageAttachmentId": 483, "featuredImageFile": "شتر-نوافذ-كهربائي.jpg", "featuredImageGuid": "https://najlaashutter.com/wp-content/uploads/2025/09/شتر-نوافذ-كهربائي.jpg", "image": sliderElectric},
  ],
  blogRecent: [
    {"id": 515, "title": "أفضل أنواع شتر النوافذ في جدة: دليل الأسعار، التركيب، وفوائد الشتر العازل 2026", "excerpt": "هل سئمت من ضجيج الشوارع وحرارة الصيف المتسربة عبر النوافذ؟ اكتشف السر وراء راحة منازل جدة العصرية مع 'نجلاء للشتر'. من الشتر الكهربائي الذكي بمحركات سونفي إلى الحلول العازلة للصوت والغبار، نقدم لك دليلاً شاملاً يجمع بين الأمان والجمال. استعرض أفضل أنواع الشتر بجدة، وتعرف على الأسعار وأحدث عروض التركيب لعام 2026. اجعل منزلك واحة من الهدوء بضغطة زر واحدة", "slug": "%d8%a3%d9%81%d8%b6%d9%84-%d8%a3%d9%86%d9%88%d8%a7%d8%b9-%d8%b4%d8%aa%d8%b1-%d8%a7%d9%84%d9%86%d9%88%d8%a7%d9%81%d8%b0-%d9%81%d9%8a-%d8%ac%d8%af%d8%a9-%d8%af%d9%84%d9%8a%d9%84-%d8%a7%d9%84%d8%a3%d8%b3", "date": "2026-02-08 12:16:08"},
    {"id": 511, "title": "أفضل شركة تركيب شتر في جدة | رول شتر للنوافذ بأسعار تنافسية | نجلاء شتر", "excerpt": "هل تبحث عن الهدوء والخصوصية داخل منزلك؟ اكتشف حلول نجلاء شتر في جدة المتكاملة. نوفر لك أرقى أنظمة الشتر الكهربائي واليدوي المصممة خصيصاً لمقاومة رطوبة وحرارة جدة العالية. عزل حراري بنسبة تصل إلى 80%، حماية قصوى من الغبار، ومحركات عالمية بضمان ممتد. لا تساوم على راحتك، واستمتع بأفضل أسعار الشتر بجدة مع خدمة تركيب احترافية وضمان حقيقي. اضغط هنا واحصل على مقايسة مجانية لمنزلك الآن!\"", "slug": "%d8%a3%d9%81%d8%b6%d9%84-%d8%b4%d8%b1%d9%83%d8%a9-%d8%aa%d8%b1%d9%83%d9%8a%d8%a8-%d8%b4%d8%aa%d8%b1-%d9%81%d9%8a-%d8%ac%d8%af%d8%a9-%d8%b1%d9%88%d9%84-%d8%b4%d8%aa%d8%b1-%d9%84%d9%84%d9%86%d9%88", "date": "2026-02-04 08:25:14"},
    {"id": 507, "title": "الدليل الشامل لأفضل أنواع الشتر في جدة 2026: رفاهية الأتمتة وكفاءة العزل القصوى", "excerpt": "تعتبر مدينة جدة، عروس البحر الأحمر، من أكثر المدن التي تتطلب حلولاً ذكية للنوافذ والواجهات، نظراً لطبيعتها الساحلية وارتفاع درجات الحرارة والرطوبة. هنا يأتي دور مؤسسة نجلاء شتر لتقديم الحل الأمثل الذي يجمع بين الحماية، العزل، والجمال المعماري. في هذا الدليل، سنغوص في تفاصيل أفضل أنواع الشتر المتوفرة في سوق جدة لعام 2026 وكيفية اختيار الأنسب لمنزلك أو مشروعك التجاري.", "slug": "%d8%a7%d9%84%d8%af%d9%84%d9%8a%d9%84-%d8%a7%d9%84%d8%b4%d8%a7%d9%85%d9%84-%d9%84%d8%a3%d9%81%d8%b6%d9%84-%d8%a3%d9%86%d9%88%d8%a7%d8%b9-%d8%a7%d9%84%d8%b4%d8%aa%d8%b1-%d9%81%d9%8a-%d8%ac%d8%af%d8%a9-2", "date": "2026-01-29 11:16:30"},
    {"id": 502, "title": "الدقة في العمل", "excerpt": "دقة في العمل: سر تميز \"نجلاء للشتر\" في تقديم حلول النوافذ بجدة في عالم التصميم المعماري الحديث، لم تعد النوافذ مجرد فتحات للتهوية والإضاءة، بل أصبحت عنصراً أساسياً في توفير الأمان، العزل، والخصوصية. و", "slug": "%d8%a7%d9%84%d8%af%d9%82%d8%a9-%d9%81%d9%8a-%d8%a7%d9%84%d8%b9%d9%85%d9%84", "date": "2026-01-26 07:01:31"},
    {"id": 493, "title": "الماكينة الكهربائية لشتر النوافذ: سر الرفاهية والأمان في \"نجلاء للشتر بجدة\"", "excerpt": "تحول \"الشتر\" في منازلنا بمدينة جدة من مجرد وسيلة للحماية إلى جزء أساسي من المنظومة الذكية للمنزل العصري. ولم يعد البحث مقتصرًا على جودة شرائح الألمنيوم فحسب، بل بات التركيز الأكبر على \"القلب النابض\" ل", "slug": "%d8%a7%d9%84%d9%85%d8%a7%d9%83%d9%8a%d9%86%d8%a9-%d8%a7%d9%84%d9%83%d9%87%d8%b1%d8%a8%d8%a7%d8%a6%d9%8a%d8%a9-%d9%84%d8%b4%d8%aa%d8%b1-%d8%a7%d9%84%d9%86%d9%88%d8%a7%d9%81%d8%b0-%d8%b3%d8%b1-%d8%a7", "date": "2026-01-12 17:57:00"},
    {"id": 490, "title": "شرائح شتر النوافذ في جدة", "excerpt": "شرائح شتر النوافذ في جدة: دليلك الشامل بين شريحة الفوم الإسبانية والشريحة المفرغة السعودية تعتبر أنظمة شتر النوافذ حلاً أساسياً لمنازل مدينة جدة ، حيث تجتمع الرطوبة العالية مع درجات الحرارة المرتفعة. ", "slug": "%d8%b4%d8%b1%d8%a7%d8%a6%d8%ad-%d8%b4%d8%aa%d8%b1-%d8%a7%d9%84%d9%86%d9%88%d8%a7%d9%81%d8%b0-%d9%81%d9%8a-%d8%ac%d8%af%d8%a9", "date": "2026-01-08 12:18:42"},
  ],
  faqs: [{"question": "كم يدوم الشتر عادة؟", "answer": "مع التركيب الصحيح والصيانة الدورية، يستمر الشتر لسنوات طويلة مع الحفاظ على جودته ومظهره."}, {"question": "هل يوفر الشتر عزلًا للضوضاء؟", "answer": "نعم، يساعد الشتر على تقليل الضوضاء الخارجية، مما يخلق بيئة هادئة داخل المنزل أو المكتب."}, {"question": "هل يزيد الشتر من أمان المنزل؟", "answer": "نعم، يوفر الشتر الخارجي حاجزًا إضافيًا يمنع الاقتحام ويساهم في زيادة الأمان داخل منزلك أو مكتبك."}],
  /** Legacy WP ACF duplicates — not rendered; use GoogleReviewsSlot instead. */
  reviewsLegacyDoNotRender: [] as { name: string; text: string }[],
  projectGallery: [{"attachmentId": 400, "file": "WhatsApp-Image-2025-11-24-at-18.49.48-5.jpeg", "guid": "https://htmcssjs.com/shut/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48-5.jpeg", "alt": ""}, {"attachmentId": 401, "file": "WhatsApp-Image-2025-11-24-at-18.49.48-4.jpeg", "guid": "https://htmcssjs.com/shut/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48-4.jpeg", "alt": ""}, {"attachmentId": 402, "file": "WhatsApp-Image-2025-11-24-at-18.49.48-3.jpeg", "guid": "https://htmcssjs.com/shut/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48-3.jpeg", "alt": ""}, {"attachmentId": 403, "file": "WhatsApp-Image-2025-11-24-at-18.49.48-2.jpeg", "guid": "https://htmcssjs.com/shut/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48-2.jpeg", "alt": ""}, {"attachmentId": 404, "file": "WhatsApp-Image-2025-11-24-at-18.49.48-1.jpeg", "guid": "https://htmcssjs.com/shut/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48-1.jpeg", "alt": ""}, {"attachmentId": 405, "file": "WhatsApp-Image-2025-11-24-at-18.49.48.jpeg", "guid": "https://htmcssjs.com/shut/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48.jpeg", "alt": ""}, {"attachmentId": 406, "file": "WhatsApp-Image-2025-11-24-at-18.49.47-1.jpeg", "guid": "https://htmcssjs.com/shut/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.47-1.jpeg", "alt": ""}, {"attachmentId": 407, "file": "WhatsApp-Image-2025-11-24-at-18.49.47.jpeg", "guid": "https://htmcssjs.com/shut/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.47.jpeg", "alt": ""}],
  navMenus: {
    "main-nav": [{"id": 468, "title": "الرئيسية", "url": "", "type": "post_type", "object": "page", "objectId": 20, "parentId": 0, "menuOrder": 1, "menus": ["main-nav"]}, {"id": 34, "title": "الخدمات", "url": "", "type": "taxonomy", "object": "category", "objectId": 7, "parentId": 0, "menuOrder": 2, "menus": ["main-nav"]}, {"id": 31, "title": "أعمالنا", "url": "", "type": "post_type", "object": "page", "objectId": 28, "parentId": 0, "menuOrder": 8, "menus": ["main-nav"]}, {"id": 9, "title": "المدونة", "url": "", "type": "taxonomy", "object": "category", "objectId": 1, "parentId": 0, "menuOrder": 9, "menus": ["main-nav"]}, {"id": 300, "title": "الأسئلة الشائعة", "url": "", "type": "post_type", "object": "page", "objectId": 296, "parentId": 0, "menuOrder": 10, "menus": ["main-nav"]}, {"id": 33, "title": "من نحن", "url": "", "type": "post_type", "object": "page", "objectId": 24, "parentId": 0, "menuOrder": 11, "menus": ["main-nav"]}, {"id": 32, "title": "تواصل معنا", "url": "", "type": "post_type", "object": "page", "objectId": 26, "parentId": 0, "menuOrder": 12, "menus": ["main-nav"]}, {"id": 154, "title": "شتر النوافذ بالتحكم عن بعد", "url": "", "type": "post_type", "object": "post", "objectId": 145, "parentId": 34, "menuOrder": 3, "menus": ["main-nav"]}, {"id": 158, "title": "شتر النوافذ الذكي", "url": "", "type": "post_type", "object": "post", "objectId": 82, "parentId": 34, "menuOrder": 4, "menus": ["main-nav"]}, {"id": 156, "title": "شتر النوافذ الداخلي", "url": "", "type": "post_type", "object": "post", "objectId": 86, "parentId": 34, "menuOrder": 5, "menus": ["main-nav"]}, {"id": 155, "title": "شتر النوافذ الخارجي", "url": "", "type": "post_type", "object": "post", "objectId": 88, "parentId": 34, "menuOrder": 6, "menus": ["main-nav"]}, {"id": 157, "title": "شتر النوافذ اليدوي", "url": "", "type": "post_type", "object": "post", "objectId": 84, "parentId": 34, "menuOrder": 7, "menus": ["main-nav"]}],
    "side-menu": [{"id": 35, "title": "الرئيسية", "url": "", "type": "post_type", "object": "page", "objectId": 20, "parentId": 0, "menuOrder": 1, "menus": ["side-menu"]}, {"id": 39, "title": "الخدمات", "url": "", "type": "taxonomy", "object": "category", "objectId": 7, "parentId": 0, "menuOrder": 2, "menus": ["side-menu"]}, {"id": 213, "title": "شتر النوافذ بالتحكم عن بعد", "url": "", "type": "post_type", "object": "post", "objectId": 145, "parentId": 0, "menuOrder": 3, "menus": ["side-menu"]}, {"id": 220, "title": "شتر النوافذ الذكي", "url": "", "type": "post_type", "object": "post", "objectId": 82, "parentId": 0, "menuOrder": 4, "menus": ["side-menu"]}, {"id": 215, "title": "شتر النوافذ الداخلي", "url": "", "type": "post_type", "object": "post", "objectId": 86, "parentId": 0, "menuOrder": 5, "menus": ["side-menu"]}, {"id": 214, "title": "شتر النوافذ الخارجي", "url": "", "type": "post_type", "object": "post", "objectId": 88, "parentId": 0, "menuOrder": 6, "menus": ["side-menu"]}, {"id": 216, "title": "شتر النوافذ اليدوي", "url": "", "type": "post_type", "object": "post", "objectId": 84, "parentId": 0, "menuOrder": 7, "menus": ["side-menu"]}, {"id": 36, "title": "أعمالنا", "url": "", "type": "post_type", "object": "page", "objectId": 28, "parentId": 0, "menuOrder": 9, "menus": ["side-menu"]}, {"id": 40, "title": "المدونة", "url": "", "type": "taxonomy", "object": "category", "objectId": 1, "parentId": 0, "menuOrder": 10, "menus": ["side-menu"]}, {"id": 38, "title": "من نحن", "url": "", "type": "post_type", "object": "page", "objectId": 24, "parentId": 0, "menuOrder": 11, "menus": ["side-menu"]}, {"id": 37, "title": "تواصل معنا", "url": "", "type": "post_type", "object": "page", "objectId": 26, "parentId": 0, "menuOrder": 12, "menus": ["side-menu"]}],
    "foot-menu": [{"id": 221, "title": "سياسة الخصوصية", "url": "", "type": "post_type", "object": "page", "objectId": 3, "parentId": 0, "menuOrder": 1, "menus": ["foot-menu"]}, {"id": 98, "title": "من نحن", "url": "", "type": "post_type", "object": "page", "objectId": 24, "parentId": 0, "menuOrder": 2, "menus": ["foot-menu"]}, {"id": 97, "title": "تواصل معنا", "url": "", "type": "post_type", "object": "page", "objectId": 26, "parentId": 0, "menuOrder": 3, "menus": ["foot-menu"]}],
    "foot-1": [{"id": 100, "title": "الخدمات", "url": "", "type": "taxonomy", "object": "category", "objectId": 7, "parentId": 0, "menuOrder": 1, "menus": ["foot-1"]}, {"id": 199, "title": "أعمالنا", "url": "", "type": "post_type", "object": "page", "objectId": 28, "parentId": 0, "menuOrder": 2, "menus": ["foot-1"]}, {"id": 202, "title": "المدونة", "url": "", "type": "taxonomy", "object": "category", "objectId": 1, "parentId": 0, "menuOrder": 3, "menus": ["foot-1"]}, {"id": 201, "title": "من نحن", "url": "", "type": "post_type", "object": "page", "objectId": 24, "parentId": 0, "menuOrder": 4, "menus": ["foot-1"]}, {"id": 200, "title": "تواصل معنا", "url": "", "type": "post_type", "object": "page", "objectId": 26, "parentId": 0, "menuOrder": 5, "menus": ["foot-1"]}, {"id": 440, "title": "سياسة الخصوصية", "url": "", "type": "post_type", "object": "page", "objectId": 3, "parentId": 0, "menuOrder": 6, "menus": ["foot-1"]}],
    "foot-2": [{"id": 204, "title": "شتر النوافذ بالتحكم عن بعد", "url": "", "type": "post_type", "object": "post", "objectId": 145, "parentId": 0, "menuOrder": 1, "menus": ["foot-2"]}, {"id": 211, "title": "شتر النوافذ الذكي", "url": "", "type": "post_type", "object": "post", "objectId": 82, "parentId": 0, "menuOrder": 2, "menus": ["foot-2"]}, {"id": 206, "title": "شتر النوافذ الداخلي", "url": "", "type": "post_type", "object": "post", "objectId": 86, "parentId": 0, "menuOrder": 3, "menus": ["foot-2"]}, {"id": 205, "title": "شتر النوافذ الخارجي", "url": "", "type": "post_type", "object": "post", "objectId": 88, "parentId": 0, "menuOrder": 4, "menus": ["foot-2"]}, {"id": 207, "title": "شتر النوافذ اليدوي", "url": "", "type": "post_type", "object": "post", "objectId": 84, "parentId": 0, "menuOrder": 5, "menus": ["foot-2"]}],
  },
} as const;

export type HomepageContent = typeof homepageContent;
