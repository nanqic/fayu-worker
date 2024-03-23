# 法语搜索

## 数据库操作
- 生成SQL `pnpm generate`
- 初始化表 
    + 本地 `wrangler d1 execute fayu --local --file=./drizzle/0000_simple_mole_man.sql`
    + 远程 `wrangler d1 execute fayu --remote --file=./drizzle/0000_simple_mole_man.sql`
- 导入数据
 `wrangler d1 execute fayu --local --file='../split_words/schema/title.sql'`
- 查询
`wrangler d1 execute fayu --local --command "select * from fayuTitle";`
