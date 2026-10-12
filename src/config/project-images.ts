/**
 * Curated project photos — originals from WP backup (no resized duplicates).
 */
import p1 from '../assets/images/projects/WhatsApp-Image-2025-11-24-at-18.49.48-5.jpeg';
import p2 from '../assets/images/projects/WhatsApp-Image-2025-11-24-at-18.49.48-4.jpeg';
import p4 from '../assets/images/projects/WhatsApp-Image-2025-11-24-at-18.49.48-2.jpeg';
import p5 from '../assets/images/projects/WhatsApp-Image-2025-11-24-at-18.49.48-1.jpeg';
import p6 from '../assets/images/projects/WhatsApp-Image-2025-11-24-at-18.49.48.jpeg';
import p7 from '../assets/images/projects/WhatsApp-Image-2025-11-24-at-18.49.47-1.jpeg';
import p8 from '../assets/images/projects/WhatsApp-Image-2025-11-24-at-18.49.47.jpeg';
import logo from '../assets/brand/logo.png';

/** Raw WhatsApp project photo (no «من أعمالنا» overlay) — WP uploads/2024/03. */
import heroProject from '../assets/images/hero-project-raw.jpeg';

export const assetSources = {
  hero: {
    file: heroProject,
    source: 'uploads/2024/03/WhatsApp-Image-2024-03-06-at-3.28.45-PM.jpeg',
  },
  logo: {
    file: logo,
    source: 'themes/atira-classic/assets/img/najlaa-logo-icon-trimed.png',
  },
  projects: [
    {
      file: p1,
      alt: 'تركيب شتر نوافذ — مشروع من معرض نجلاء',
      source: 'uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48-5.jpeg',
    },
    {
      file: p2,
      alt: 'شتر رول على واجهة — من أعمال نجلاء',
      source: 'uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48-4.jpeg',
    },
    {
      file: p4,
      alt: 'شتر نوافذ — عمل منفذ',
      source: 'uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48-2.jpeg',
    },
    {
      file: p5,
      alt: 'شتر نوافذ خارجي — مشروع سكني',
      source: 'uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48-1.jpeg',
    },
    {
      file: p6,
      alt: 'مشروع شتر نوافذ نجلاء',
      source: 'uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.48.jpeg',
    },
    {
      file: p7,
      alt: 'تركيب شتر نوافذ',
      source: 'uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.47-1.jpeg',
    },
    {
      file: p8,
      alt: 'شتر نوافذ — مشروع منفذ',
      source: 'uploads/2025/11/WhatsApp-Image-2025-11-24-at-18.49.47.jpeg',
    },
  ],
} as const;

/** Gallery excludes hero image to avoid duplicate on the LP. */
export const projectGalleryImages = assetSources.projects;

/** Featured project for «لماذا نجلاء شتر؟» */
export const whyNajlaaFeatureImage = p2;
