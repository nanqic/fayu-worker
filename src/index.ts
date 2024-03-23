import { drizzle } from "drizzle-orm/d1";
import { getByWords } from "./db/dbUtil";
import { resultView } from "./db/schema";
import { count, like, sql } from "drizzle-orm";

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

			return Response.json({
				total,
				pageSize,
				page,
				data
			});
		}

		// let total = (await db.select({
		// 	count: count()
		// }).from(resultView)
		// 	.where(like(resultView.words, '%本性%'))
		// 	.groupBy(resultView.title)).length
		// return Response.json({ len: total });

		return Response.json(routes);
	},
};
