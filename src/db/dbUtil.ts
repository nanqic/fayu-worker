import { DrizzleD1Database } from "drizzle-orm/d1"
import { and, count, eq, like, sql } from "drizzle-orm"
import { fayuTitle, resultT, resultView } from "./schema"

const matchKeywords = (words: string[], searchWords: string[]) => {
    return searchWords.every(value => words.includes(value));
}

const buildQuery = (words: string[]): string => {
    let query = ``;

    // 根据数组的长度动态生成查询条件
    for (let i = 0; i < words.length; i++) {
        query += `Text LIKE '%${words[i]}%'`;

        // 如果不是数组的最后一个元素，则添加逻辑操作符
        if (i < words.length - 1) {
            query += " AND ";
        }
    }

    return query
}

export const getByWords = async (db: DrizzleD1Database, searchWords: string, page: number, pageSize: number): Promise<[number, resultT[]]> => {
    const words = searchWords.split(' ')
    const total = (await db.select({
        count: count()
    }).from(resultView)
        .where(sql.raw(`${buildQuery(words)}`))
        .groupBy(resultView.title)).length

    const result = await db.select({
        count: count(),
        title: resultView.title,
        series: resultView.series,
        subtitles: sql`JSON_GROUP_ARRAY(JSON_OBJECT('lineId', LineId, 'startTime', StartTime, 'text', Text))`
    }).from(resultView)
        .where(sql.raw(`${buildQuery(words)}`))
        .groupBy(resultView.title)
        .limit(pageSize)
        .offset((page - 1) * pageSize)

    return [total, result]
}
