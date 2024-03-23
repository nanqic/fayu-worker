import { eq } from 'drizzle-orm';
import { sqliteTable, text, integer, index, sqliteView } from 'drizzle-orm/sqlite-core';

export const fayuContent = sqliteTable('fayuContent', {
    id: integer('Id').primaryKey(),
    lineId: integer('LineId').notNull(),
    videoId: integer('VideoId').notNull(),
    startTime: text('StartTime').notNull(),
    text: text('Text').notNull(),
    words: text('Words').notNull(),
}, (table) => ({
    wordsIdx: index('wordsIdx').on(table.words),
}));

export const fayuTitle = sqliteTable('fayuTitle', {
    videoId: integer('VideoId').primaryKey(),
    title: text('Title').notNull(),
    date: text('Date'),
    series: text('Series')
});

// 视图需要手动创建
export const resultView = sqliteView("resultView").as((qb) => {
    return qb
        .select({
            lineId: fayuContent.lineId,
            startTime: fayuContent.startTime,
            text: fayuContent.text,
            words: fayuContent.words,
            title: fayuTitle.title,
            series: fayuTitle.series
        })
        .from(fayuContent)
        .leftJoin(fayuTitle, eq(fayuContent.videoId, fayuTitle.videoId));
});

export interface resultT {
    count: number;
    title: string | null;
    subtitles: unknown;
}