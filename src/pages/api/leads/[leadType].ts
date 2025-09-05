// Disable prerendering for dynamic route to avoid getStaticPaths requirement in static build
export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
	const { leadType } = params as { leadType?: string };
	// Return minimal payload or redirect; adjust as needed
	return new Response(
		JSON.stringify({ ok: true, leadType }),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		}
	);
};
