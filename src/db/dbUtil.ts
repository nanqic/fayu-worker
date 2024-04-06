import { DrizzleD1Database } from "drizzle-orm/d1"
import { and, count, eq, inArray, sql } from "drizzle-orm"
import { fayuContent, resultT, resultView } from "./schema"

function findIdContext(arr: number[]) {
    const resultSet: Set<number> = new Set();

    arr.forEach((num: number) => {
        resultSet.add(num);
        if (num > 2) {
            resultSet.add(num - 1);
            resultSet.add(num - 2);
        }
        resultSet.add(num + 1);
        resultSet.add(num + 2);
    });

    // 将Set转换为数组，并返回
    return Array.from(resultSet).sort((a, b) => a - b); // 排序结果
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

    let result = await db.select({
        count: count(),
        videoId: resultView.videoId,
        title: resultView.title,
        series: resultView.series,
        subtitles: sql`JSON_GROUP_ARRAY(JSON_OBJECT('lineId', LineId, 'startTime', StartTime, 'text', Text))`
    }).from(resultView)
        .where(sql.raw(`${buildQuery(words)}`))
        .groupBy(resultView.title)
        .limit(pageSize)
        .offset((page - 1) * pageSize)

    let index = 0;
    for (const { count, videoId, subtitles } of result) {
        if (videoId && count <= 3) {
            let lines: number[] = JSON.parse(subtitles + '').map((x: any) => x.lineId)
            let allSubtitles = await db.select({
                lineId: fayuContent.lineId,
                startTime: fayuContent.startTime,
                text: fayuContent.text
            }).from(fayuContent)
                .where(and(inArray(fayuContent.lineId, findIdContext(lines)), eq(fayuContent.videoId, videoId)))

            result[index].subtitles = JSON.stringify(allSubtitles);
            result[index].count = allSubtitles.length;
        }
        index++
    }

    return [total, result]
}
