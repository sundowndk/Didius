initialize : function ()
{
	app.auctions.set ();
},

set : function ()
{
	app.auctions.refresh ();
},

refresh : function ()
{
	var onDone = 	function (auctions)
					{
						var tree = document.getElementById ("auctions");
						var children = document.createElement('treechildren');		
						tree.appendChild (children);

						for (index in auctions)
						{
							var auction = auctions[index];

							var item = document.createElement('treeitem');	
							children.appendChild (item)
						
							var row = document.createElement('treerow');
							item.appendChild (row);

							var cell = document.createElement('treecell');
							cell.setAttribute ('label', auction["no"]);
							row.appendChild(cell);			
							
							var cell = document.createElement('treecell');
							cell.setAttribute ('label', auction["title"]);
							row.appendChild(cell);			
						}				
						
						tree.disabled = false;
					};

	didius.auction.list ({async: true, onDone: onDone});
}


