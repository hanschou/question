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

import { Class, Form, FormsModule, StaticMenu, StaticMenuEntry } from "futureforms";
import { QuestionForm } from "../../forms/generated/Question";

export class FormList extends StaticMenu
{
	constructor()
	{
		super(FormList.data());
	}

	public async execute(path:string): Promise<boolean>
	{
		let form:Class<Form> = null;
		if (path == "/forms/template") form = QuestionForm;

		if (form) await FormsModule.showform(form);
		return(true);
	}

	private static data() : StaticMenuEntry
	{
		return(
		{
			id: "demo",
			display: "Demo",
			entries:
			[
				{
					id: "template",
					display: "Template",
					command: "/forms/template"
				}
			]
		});
	}
}