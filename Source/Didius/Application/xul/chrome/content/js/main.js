
didius.runtime.initialize ();


document.addEventListener("DOMContentLoaded", showMore, false)


function quit (aForceQuit)
{
  var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
    getService(Components.interfaces.nsIAppStartup);

  // eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
  // process if there is unsaved data. eForceQuit will quit no matter what.
  var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                  Components.interfaces.nsIAppStartup.eAttemptQuit;
  appStartup.quit(quitSeverity);
}

function showMore() 
{

//window.frames["myFrame"].focus();
//window.frames["myFrame"].print();

var customers = didius.customer.list ();

var a = document.getElementById ("customers");

var children = document.createElement('treechildren');	
a.appendChild (children)

for (index in customers)
{
	var customer = customers[index];

	var item = document.createElement('treeitem');	
	children.appendChild (item)
	
	var row = document.createElement('treerow');
	item.appendChild (row);

	var cell = document.createElement('treecell');
	cell.setAttribute ('label', customer["name"]);
	row.appendChild(cell);
		
	//a.appendChild(item);
	
}

var auctions = didius.auction.list ();

var b = document.getElementById ("auctions");

var children = document.createElement('treechildren');	
b.appendChild (children)

for (index in auctions)
{
	var auction = auctions[index];

	var item = document.createElement('treeitem');	
	children.appendChild (item)
	
	var row = document.createElement('treerow');
	item.appendChild (row);

	var cell1 = document.createElement('treecell');
	cell1.setAttribute ('label', auction["no"]);
	row.appendChild(cell1);

	var cell2 = document.createElement('treecell');
	cell2.setAttribute ('label', auction["title"]);
	row.appendChild(cell2);

		
	//a.appendChild(item);
	
}



//for (var i = 0; i < gems.length; i++)
  //  {
//        var row = document.createElement('listitem');
    //    var cell = document.createElement('listcell');
  //      cell.setAttribute('label', gems[i].gem);
//        row.appendChild(cell);

    //    cell = document.createElement('listcell');
  //      cell.setAttribute('label',  gems[i].Price );
//        row.appendChild(cell);

  //      theList.appendChild(row);
//    }


}