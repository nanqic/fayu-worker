import { drizzle } from "drizzle-orm/d1";
import { getByWords } from "./db/dbUtil";

export interface Env {
	DB: D1Database
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const db = drizzle(env.DB);
		const url = new URL(request.url)
		const routes = url.pathname.split('/')

		if (routes.length === 3 && routes[1] === 'search') {
			const keywords = decodeURI(routes[2])

			return Response.json(await getByWords(db, keywords));
		}

		return Response.json(routes);
	},
};
