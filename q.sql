CREATE OR REPLACE VIEW votes AS
SELECT qq.qid, qq.qn, votes, vup, vdn, COALESCE(vv.vote,0) AS myvo, qq.content
FROM (
	SELECT
		q.qid,
		q.qn,
		COALESCE(SUM(v.vote),0) AS votes,
		SUM(CASE COALESCE(v.vote, 0) WHEN  1 THEN 1 ELSE 0 END) AS vup,
		SUM(CASE COALESCE(v.vote, 0) WHEN -1 THEN 1 ELSE 0 END) AS vdn,
		q.content
	FROM question q
	LEFT OUTER JOIN vote v ON (v.qid=q.qid)
	WHERE q.deleted=0 AND q.cid=(SELECT cid FROM conference WHERE cpass='10life')
	GROUP BY q.qid, q.content
) AS qq
LEFT OUTER JOIN vote vv ON (vv.qid=qq.qid AND vv.aid=(SELECT aid FROM attendee WHERE apass='IAmGodNow'))
ORDER BY votes DESC, qq.qid ASC
;
SELECT * FROM votes;
