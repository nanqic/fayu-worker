import { DrizzleD1Database } from "drizzle-orm/d1"
import { and, eq, like } from "drizzle-orm"
import { resultT, resultView } from "./schema"

const matchKeywords = (words: string[], searchWords: string[]) => {
    return searchWords.every(value => words.includes(value));
}

export const getByWords = async (db: DrizzleD1Database, searchWords: string): Promise<resultT[]> => {
    const words = searchWords.split(' ')
    const result =
        words.length === 1 ?
            await db.select().from(resultView)
                .where(like(resultView.text, `%${words[0]}%`)) :
            await db.select().from(resultView)
                .where(and(
                    like(resultView.words, `%${words[0]}%`),
                    like(resultView.words, `%${words[1]}%`)
                ))

    return result
}
