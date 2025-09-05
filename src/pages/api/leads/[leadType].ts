// Make this dynamic API route inert for static builds
export const prerender = true;
export function getStaticPaths() {
	return [] as const;
}

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
	const { leadType } = params as { leadType?: string };
	return new Response(JSON.stringify({ ok: true, leadType }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
