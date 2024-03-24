import { drizzle } from "drizzle-orm/d1";
import { getByWords } from "./db/dbUtil";

export const headers = {
	'Access-Control-Allow-Origin': '*',
	'Cache-Control': 'public, max-age=604800', // 缓存一周
};

export interface Env {
	DB: D1Database
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const db = drizzle(env.DB);
		const url = new URL(request.url)
		const routes = url.pathname.split('/')

		if (routes.length >= 3 && routes[1] === 'search') {
			const keywords = decodeURI(routes[2])
			const page = parseInt(routes[3]) || 1
			const pageSize = 5
			const [total, data] = await getByWords(db, keywords, page, pageSize)

			return new Response(JSON.stringify({
				total,
				pageSize,
				page,
				data
			}), { headers });
		}

		return Response.json(routes);
	},
};
