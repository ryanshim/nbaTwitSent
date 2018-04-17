	
		// When the user clicks on <div>, open the popup
            function popupFunction(url, bodyName){
            				var xmlHttp = new XMLHttpRequest();
            				xmlHttp.open( "GET", url , false ); // false for synchronous request
            				xmlHttp.send( null );
            				setResponse(xmlHttp.responseText, bodyName);
            				return xmlHttp.responseText;
            }
            function setResponse(responseText, bodyName){
            	var responseJSON = $.parseJSON(responseText);
            	var tr;
				var tbody = document.getElementById(bodyName);
				$(tbody).empty();
                for (var i = 0; i < responseJSON.length; i++) {
                    tr = $('<tr/>');
            		tr.append("<td>" + responseJSON[i].num + "</td>");
            		tr.append("<td>" + responseJSON[i].name + "</td>");
            		tr.append("<td>" + responseJSON[i].pos + "</td>");
                    tr.append("<td>" + responseJSON[i].height + "</td>");
                    tr.append("<td>" + responseJSON[i].weight + "</td>");
            		var x = document.getElementById(bodyName);
            		$(x).append(tr);
                }
            }
			// When the user clicks on tab show details
				function tabFunction(url, tabName){
                      		var xmlHttp = new XMLHttpRequest();
                      		xmlHttp.open( "GET", url , false ); // false for synchronous request
                      		xmlHttp.send( null );
                      		settabResponse(xmlHttp.responseText, tabName);
                      		return xmlHttp.responseText;
                      }
                function settabResponse(response, tabName){
                      var responseJSON = $.parseJSON(response);
                      var tr;
					  var tbody = document.getElementById(tabName);
					  $(tbody).empty();
                      for (var i = 0; i < responseJSON.length; i++) {
                      tr = $('<tr/>');
                      tr.append("<td>" + responseJSON[i].team + "</td>");
                      tr.append("<td>" + responseJSON[i].w + "</td>");
                      tr.append("<td>" + responseJSON[i].l + "</td>");
                      tr.append("<td>" + responseJSON[i].pct + "</td>");
                      var t = document.getElementById(tabName);
                      $(t).append(tr);
                      }
                      }
