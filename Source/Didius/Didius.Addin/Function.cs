//
// Function.cs
//  
// Author:
//       Rasmus Pedersen <rasmus@akvaservice.dk>
// 
// Copyright (c) 2010 Rasmus Pedersen
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Collections.Generic;

using SorentoLib;

namespace Didius.Addin
{
	public class Function : SorentoLib.Addins.IFunction
	{
		#region Private Fields
		private List<string> _namespaces = new List<string> ();
		#endregion
		
		#region Constructor
		public Function ()
		{
			this._namespaces.Add ("didius");
		}
		#endregion
		
		#region Public Methods
		public bool IsProvided (string Namespace)
		{
			return this._namespaces.Exists (delegate (string o) {return (o == Namespace.ToLower ());});
		}
		
		public bool Process (SorentoLib.Session Session, string Fullname, string Method)
		{
			
			switch (Fullname.ToLower ())
			{
				#region Item
				case "didius.item":
					
					switch (Method.ToLower ())
					{
						case "imageupload":
							List<string> allowedfiletypes = new List<string> ();
							allowedfiletypes.Add ("image/jpeg");
							allowedfiletypes.Add ("image/png");
							allowedfiletypes.Add ("image/gif");

//							allowedfiletypes.Add ("application/pdf");
//							allowedfiletypes.Add ("image/gif");
														
							Console.WriteLine (Session.Request.QueryJar.Get ("image").BinaryContentType);

							if (allowedfiletypes.Contains (Session.Request.QueryJar.Get ("image").BinaryContentType))
							{
								SorentoLib.Media image = new SorentoLib.Media ("/media/didius/"+ Guid.NewGuid ().ToString (), Session.Request.QueryJar.Get ("image").BinaryData);
								image.Type = SorentoLib.Enums.MediaType.Restricted;
								image.Save ();
								
//								Session.Page.Variables.Add ("mediaid", image.Id);
//								Session.Page.Variables.Add ("mediasoftpath", image.Path);
//								Session.Page.Variables.Add ("uploadsuccess", "true");

								Session.Page.Lines.Add ("SUCCESS:"+ image.Id);
			
								return true;
							}
							
							Session.Page.Lines.Add ("ERROR");
							return true;
							
						default:
							return false;
					}
				#endregion
			}
			
			return false;
		}
		#endregion
	}
}
