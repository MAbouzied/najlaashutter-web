/** Central site configuration — single source for contact & tracking. */
export const site = {
  name: 'نجلاء شتر',
  nameEn: 'Najlaa Shutter',
  legalName: 'نجلاء شتر',
  description:
    'تركيب شتر نوافذ في جدة — شتر يدوي وكهربائي، داخلي وخارجي، بجودة عالية وتركيب احترافي.',
  url: 'https://najlaashutter.com',
  landingUrl: 'https://ads.najlaashutter.com',
  locale: 'ar_SA',
  language: 'ar',
  direction: 'rtl' as const,

  phone: {
    display: '+966 535 344 170',
    e164: '+966535344170',
    telHref: 'tel:+966535344170',
  },

  whatsapp: {
    e164: '966535344170',
    /** Default prefill for landing page (no pricing promise). */
    defaultMessage:
      'السلام عليكم، أرغب في استفسار عن شتر نوافذ في جدة. أرفق صورة للشباك أو المقاسات.',
    href(message?: string) {
      const text = encodeURIComponent(message ?? this.defaultMessage);
      return `https://wa.me/${this.e164}?text=${text}`;
    },
  },

  email: {
    address: 'info@najlaashutter.com',
    href: 'mailto:info@najlaashutter.com',
  },

  location: {
    city: 'جدة',
    region: 'مكة المكرمة',
    country: 'المملكة العربية السعودية',
    /** From existing contact page — verify exact storefront if needed. */
    shortLabel: 'جدة — حي غران',
    mapsUrl: 'https://maps.app.goo.gl/A5XTwRhtwWvPCETU6',
  },

  /**
   * Homepage / main-site service area (Jeddah + Makkah).
   * TODO: SERVICE AREA REQUIRES BUSINESS CONFIRMATION BEFORE PRODUCTION.
   * Do not broaden to “all Saudi Arabia” until confirmed. LP remains Jeddah-only.
   */
  serviceArea: {
    homepagePromo: 'تركيب شتر النوافذ في جدة ومكة',
    footerNote: 'تركيب شتر النوافذ في جدة ومكة',
    needsBusinessConfirmation: true as const,
  },

  /** Verified Google Business Profile (reviews sync deferred). */
  googleBusinessProfileUrl: 'https://maps.app.goo.gl/GLKGw6Q6KkzqDohA6',

  /** @deprecated Use serviceArea.homepagePromo */
  serviceAreaNote: 'تركيب شتر النوافذ في جدة ومكة',

  offers: {
    /** UNVERIFIED in audit — do not surface until confirmed. */
    freeInstallOver500Sar: false,
  },

  social: {
    /** Placeholder URLs from WP were generic; omit until real profiles are verified. */
    facebook: undefined as string | undefined,
    instagram: undefined as string | undefined,
    tiktok: undefined as string | undefined,
  },

  tracking: {
    gtmId: 'GTM-WXVGK7F4',
    ga4Id: 'G-RE7E53N9DJ',
    googleAdsId: 'AW-17774174461',
    /** Conversion labels for phone/WhatsApp — set after GTM/Ads verification. */
    conversionLabels: {
      phone: undefined as string | undefined,
      whatsapp: undefined as string | undefined,
    },
  },

  paths: {
    privacyPolicy: '/privacy-policy/',
    /** Legacy WP/Google Ads path — 301 to `/` at the edge. */
    landingJeddahLegacy: '/window-shutters-jeddah/',
    landingJeddah: '/',
  },
} as const;

export type SiteConfig = typeof site;
