/**
 * Planned Astro routes for WP menu items (inner pages ship after homepage approval).
 */
export const homePaths = {
  home: '/',
  about: '/about/',
  contact: '/contact-us/',
  projects: '/our-work/',
  faq: '/faq/',
  services: '/services/',
  blog: '/blog/',
  privacy: '/privacy-policy/',
  service: (slug: string) => `/services/${slug}/`,
  blogPost: (slug: string) => `/blog/${slug}/`,
} as const;

const pageIdToPath: Record<number, string> = {
  20: homePaths.home,
  24: homePaths.about,
  26: homePaths.contact,
  28: homePaths.projects,
  296: homePaths.faq,
  3: homePaths.privacy,
};

const postIdToPath: Record<number, string> = {
  145: homePaths.service('window-shutters-with-remote-control'),
  82: homePaths.service('smart-shutter-windows'),
  86: homePaths.service('interior-window-shutters'),
  88: homePaths.service('external-window-shutters'),
  84: homePaths.service('manual-shutter'),
};

/** Resolves WP menu item to a future-friendly path (may 404 until Phase 2C+). */
export function menuItemHref(item: {
  type: string;
  object: string;
  objectId: number;
  url: string;
}): string {
  if (item.url && item.url.startsWith('http')) return item.url;
  if (item.object === 'page' && pageIdToPath[item.objectId]) {
    return pageIdToPath[item.objectId];
  }
  if (item.object === 'post' && postIdToPath[item.objectId]) {
    return postIdToPath[item.objectId];
  }
  if (item.object === 'category' && item.objectId === 7) return homePaths.services;
  if (item.object === 'category' && item.objectId === 1) return homePaths.blog;
  return homePaths.home;
}
