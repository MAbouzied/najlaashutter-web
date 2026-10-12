import type { APIRoute } from 'astro';

/** Static fallback; Worker overrides on workers.dev / ads host. */
export const GET: APIRoute = () => {
  const body = `User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
