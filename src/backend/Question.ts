/*
  MIT License

  Copyright © 2023 Alex Høffner

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software
  and associated documentation files (the “Software”), to deal in the Software without
  restriction, including without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or
  substantial portions of the Software.

  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
  BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


import { FormsModule } from "../FormsModule";
import { BindValue, DataType, ParameterType, SQLStatement, StoredProcedure } from "futureforms";

export class Question
{
	public static async execVotesSQL(cpass:string) : Promise<string>
	{
		let row:any[] = null;
		let stmt:SQLStatement = new SQLStatement(FormsModule.DATABASE);

		stmt.sql =
		`
		SELECT qq.qid AS qid, qq.qn AS qn, votes, vup, vdn, COALESCE(vv.vote,0) AS myvo, qq.content AS content
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
		`;

		stmt.addBindValue(new BindValue("cpass",cpass,DataType.string));

		let success:boolean = await stmt.execute();
		if (success) row = await stmt.fetch();

		stmt.close();
		if (row)
			return(row[0]);

		return(null);
	}


	public static async procWithInOut(arg1:string) : Promise<number[]>
	{
		let out:number[] = [0,0];
		let func:StoredProcedure = new StoredProcedure(FormsModule.DATABASE);

		func.setName("funcWithInOut");

		func.addParameter("arg1",arg1,DataType.varchar);
		func.addParameter("out1",0,DataType.integer,ParameterType.inout);
		func.addParameter("out2",0,DataType.integer,ParameterType.inout);

		let success:boolean = await func.execute();

		if (success)
		{
			out[0] = func.getOutParameter("out1");
			out[1] = func.getOutParameter("out2");
		}

		return(out);
	}
}