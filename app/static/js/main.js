	$(document).ready(function () {
                      	$('#horizontalTab').easyResponsiveTabs({
                      		type: 'default', //Types: default, vertical, accordion           
                      		width: 'auto', //auto or any width like 600px
                      		fit: true   // 100% fit in a container
                      	});
                      });
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
			// function for schedule
            function scheduleFunction(url, schName){
            				var xmlHttp = new XMLHttpRequest();
            				xmlHttp.open( "GET", url , false ); // false for synchronous request
            				xmlHttp.send( null );
            				setscheduleResponse(xmlHttp.responseText, schName);
            				return xmlHttp.responseText;
            }
            function setscheduleResponse(response, schName){
            	var responseJSON = $.parseJSON(response);
            	var tr;
				var tbody = document.getElementById(schName);
				$(tbody).empty();
                for (var i = 0; i < responseJSON.length; i++) {
                    tr = $('<tr/>');
            		tr.append("<td>" + responseJSON[i].date + "|" + responseJSON[i].time + "</td>");
            		tr.append("<td>" + responseJSON[i].h_team + "</td>");
                    tr.append("<td>" + responseJSON[i].h_score + "</td>");
                    tr.append("<td>" + responseJSON[i].v_team + "</td>");
					tr.append("<td>" + responseJSON[i].v_score + "</td>");
            		var s = document.getElementById(schName);
            		$(s).append(tr);
                }
            }
			//function for standings.html file 
			function stdFunction(url, stdName){
            				var xmlHttp = new XMLHttpRequest();
            				xmlHttp.open( "GET", url , false ); // false for synchronous request
            				xmlHttp.send( null );
            				setstdResponse(xmlHttp.responseText, stdName);
            				return xmlHttp.responseText;
            }
            function setstdResponse(response, stdName){
            	var responseJSON = $.parseJSON(response);
            	var tr;
				var tbody = document.getElementById(stdName);
				$(tbody).empty();
                for (var i = 0; i < responseJSON.length; i++) {
                    tr = $('<tr/>');
            		tr.append("<td>" + responseJSON[i].team + "</td>");
            		tr.append("<td>" + responseJSON[i].conf + "</td>");
            		tr.append("<td>" + responseJSON[i].w + "</td>");
                    tr.append("<td>" + responseJSON[i].l + "</td>");
                    tr.append("<td>" + responseJSON[i].pct + "</td>");
            		var s = document.getElementById(stdName);
            		$(r).append(tr);
                }
            }
 
