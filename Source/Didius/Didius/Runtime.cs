// 
//  Runtime.cs
//  
//  Author:
//      Rasmus Pedersen (rvp@qnax.net)
// 
//  Copyright (c) 2012 QNAX ApS
// 

using System;

namespace Didius
{
	public static class Runtime
	{
		#region Public Static Fields
		#endregion
		
		#region Public Static Methods
		public static void Initialize ()
		{				
			// Remove current symlinks
			SNDK.IO.RemoveSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_content) + "didius");
			SNDK.IO.RemoveSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_html) + "didius");

			// Create symlinks
			SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "Didius/resources/content", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sConsole/resources/content/scms");
			SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sCMS/resources/htdocs", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sConsole/resources/includes/scms");
			SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sCMS/resources/xml", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sConsole/resources/xml/scms");


		}	
		#endregion
	}
}

