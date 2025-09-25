// Make this dynamic API route inert for static builds
import type { APIRoute } from 'astro';

export const prerender = true;
export function getStaticPaths() {
	return [] as const;
}

export const GET: APIRoute = async ({ params }) => {
	const { leadType } = params as { leadType?: string };
	return new Response(JSON.stringify({ ok: true, leadType }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
