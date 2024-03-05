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

import content from './Question.html';

import { BaseForm } from '../../BaseForm';
import { Question as DataSource } from '../../datasources/Question';
import { Block, EventType, FormEvent, TableSorter, datasource, formevent } from 'futureforms';


@datasource("fromclause",DataSource)

export class QuestionForm extends BaseForm
{
	//private sorter:TableSorter;

	constructor()
	{
		super(content);
		this.title = "Question";
		//this.sorter = new TableSorter(this);
	}

	@formevent({type: EventType.PostViewInit})
	public async postview() : Promise<boolean>
    {
      this.refreshVoting();
      return(true);
    }
 
   
    private refreshVoting()
    {
      this.reQuery("Question");
      setTimeout(() =>
      {
         this.refreshVoting();
      }, 30000);
    }
	
	/** Trigger template */
	@formevent({type: EventType.WhenValidateField, block: "some-block", field: "some-field"})
	public async validateField(event:FormEvent) : Promise<boolean>
	{
		let field:string = event.field;
		let block:Block = this.getBlock(event.block);

		let value:any = block.getValue(field);
		console.log("validate "+field+" - "+value);

		return(true);
	}

	/** Sorting, referenced by labels in html */
	//public async sort(block:string, column:string) : Promise<boolean>
	//{
	//	return(this.sorter.toggle(block,column).sort(block));
	//}
}