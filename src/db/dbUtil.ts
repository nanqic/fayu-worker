import { DrizzleD1Database } from "drizzle-orm/d1"
import { and, count, eq, like, sql } from "drizzle-orm"
import { fayuTitle, resultT, resultView } from "./schema"

const matchKeywords = (words: string[], searchWords: string[]) => {
    return searchWords.every(value => words.includes(value));
}

export const getByWords = async (db: DrizzleD1Database, searchWords: string, page: number, pageSize: number): Promise<[number, resultT[]]> => {
    const words = searchWords.split(' ')
    const total =
        words.length === 1 ?
            (await db.select({
                count: count()
            }).from(resultView)
                .where(like(resultView.text, `%${words[0]}%`))
                .groupBy(resultView.title)).length
            :
            (await db.select({
                count: count()
            }).from(resultView)
                .where(and(
                    like(resultView.words, `%${words[0]}%`),
                    like(resultView.words, `%${words[1]}%`)
                ))
                .groupBy(resultView.title)).length

    const result =
        words.length === 1 ?
            await db.select({
                count: count(),
                title: resultView.title,
                subtitles: sql`JSON_GROUP_ARRAY(JSON_OBJECT('lineId', LineId, 'startTime', StartTime, 'text', Text))`
            }).from(resultView)
                .where(like(resultView.text, `%${words[0]}%`))
                .groupBy(resultView.title)
                .limit(pageSize)
                .offset((page - 1) * pageSize)
            :
            await db.select({
                count: count(),
                title: resultView.title,
                subtitles: sql`JSON_GROUP_ARRAY(JSON_OBJECT('lineId', LineId, 'startTime', StartTime, 'text', Text))`
            }).from(resultView)
                .where(and(
                    like(resultView.words, `%${words[0]}%`),
                    like(resultView.words, `%${words[1]}%`)
                ))
                .groupBy(resultView.title)
                .limit(pageSize)
                .offset((page - 1) * pageSize)

    return [total, result]
}
