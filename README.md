# 法语搜索

## 数据库操作
- 生成SQL `pnpm generate`
- 初始化表 
    + 本地 `wrangler d1 execute fayu --local --file=./drizzle/0000_simple_mole_man.sql`
    + 远程 `wrangler d1 execute fayu --remote --file=./drizzle/0000_simple_mole_man.sql`
- 导入数据
 `wrangler d1 execute fayu --remote --file='../split_words/subtitles/titles.sql'`
- 创建视图
``` sql
CREATE VIEW resultView AS SELECT fayuContent.LineId, fayuContent.StartTime, fayuContent.Text, fayuContent.Words, fayuTitle.Title, fayuTitle.VideoId, fayuTitle.Series FROM fayuContent LEFT JOIN fayuTitle ON fayuContent.VideoId = fayuTitle.VideoId;
```
- 查询
`wrangler d1 execute fayu --remote --command="select * from fayuTitle";`
