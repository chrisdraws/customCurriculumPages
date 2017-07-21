// JavaScript Document

 

var pageCurriculum = document.querySelector(".curriculum"),
	isThisDevelopment = false;

	console.log("here");
	if((document.location.hash).indexOf("corporateCareerDevelopment") !== -1) { 
	
		pageCurriculum.setAttribute("id","careerDevelopment");
		

	} else if((document.location.hash).indexOf("academy") !== -1) { 
	
		pageCurriculum.setAttribute("id","academy"); 
		if((document.location.hash).indexOf("development") !== -1) {
			isThisDevelopment = true;
		}
	
	} else if((document.location.hash).indexOf("recruiter") !== -1) { 
	
		pageCurriculum.setAttribute("id","recruiter");
		 
		 
		 
		//document.querySelector(".socialMediaIcons").parentNode.insertBefore(document.querySelector(".announcements"),document.querySelector(".socialMediaIcons").nextElementSibling);
		 
		if((document.location.hash).indexOf("/divisionTraining") !== -1) { 
		
			document.querySelector(".additionalMod").style.display = "block";
	
	
		} 
	
	} else if((document.location.hash).indexOf("accountManager") !== -1) { 
	 	
		pageCurriculum.setAttribute("id","accountManager"); 
	
	} else if((document.location.hash).indexOf("leadershipDevelopment") !== -1) { 
	 	
		pageCurriculum.setAttribute("id","leadershipDevelopment"); 
	
	} else if((document.location.hash).indexOf("fieldCareerDevelopment") !== -1) { 
	 	
		pageCurriculum.setAttribute("id","leadershipDevelopment"); 
	
	} else { 
	
		//pageCurriculum.removeClass("recruiter accountManager"); 
		 
	}
	
	pageCurriculum.style.display = "block";
	
	var curriculumSelectionButtons2 = document.querySelectorAll(".curriculumSelection a");
	var firstTimeThrough = true;
	
	for(var l = 0; l < curriculumSelectionButtons2.length; l++) {
		var buttonHere = curriculumSelectionButtons2[l];
	 
		
		buttonHere.addEventListener("click", function(){
			
			//console.log("button clicked");
			var button = this,
				buttonClass = button.getAttribute("class");
			
			//console.log(buttonClass);	
			 if(isThisDevelopment && button.classList.contains("acad3")) {
				
				button.parentElement.classList.toggle("notActive");
				 
			 }
			if(!button.parentElement.classList.contains("selected") && !button.parentElement.classList.contains("notActive")) {	
				//console.log("here");
				button.parentNode.classList.toggle("selected");
				var siblingsOfParent = button.parentElement.parentElement.children;
				if(firstTimeThrough) {
					//console.log("firstTimeThrough");
					
					for(var i = 0; i < siblingsOfParent.length; i++) {
						
						var child = siblingsOfParent[i];
						 
						if(button.parentElement !== child) {
							
							//console.log(child);
							child.classList.toggle("selected");
							 
						}
						 
					}
					//firstTimeThrough = false;			
				}
				for(var j = 0; j < siblingsOfParent.length; j++) {
						
					 var child = siblingsOfParent[j];
					 
					if(button.parentElement !== child) {
						
						 if(child.classList.contains("selected")) {
							child.classList.toggle("selected");
						 }
						 
					}
						 
				}
				
				var modulesHolders = pageCurriculum.querySelectorAll(".modulesHolder");
				
				for(var k = 0; k < modulesHolders.length; k++) {
					var module = modulesHolders[k];
				 
					if(module.classList.contains(buttonClass)) {
					
						module.style.display = "block";
						
					} else {
						module.style.display = "none";
					}
				} 
				
			}
		});
	}
 
	
	
	document.querySelector("#basicPageObject").style.display = "block";
	
//jQuery is used below because it's required for the mCustomScrollbar and the Shadowbox makes use of it as well.
	
//setup scroll bar for announcements and resources holder if more items than fit in the box
var announcementHolder = $(".announcements .infoBody .announcementList"),
	resourcesHolder = $(".resources .resourcesList.rec");
	var grayHolder = $(".grayHolder ul");

 

grayHolder.mCustomScrollbar({
					scrollButtons:{
						enable:true
					},
					theme:"dark-2"
				});

 

announcementHolder.mCustomScrollbar({
					scrollButtons:{
						enable:true
					},
					theme:"dark-2"
				});
				
resourcesHolder.mCustomScrollbar({
					scrollButtons:{
						enable:true
					},
					theme:"dark-2"
				});
								
		
			
Shadowbox.init({
    
    onClose: function(){ 
	 
	if( $.support.cssFloat === false ) {
	$("#sb-container").css("display", "none");
	
	}
	
	
 }
}); 
				
				
(function createVideoPlayers() {
			 
			var useShadowBox = $(".useShadowBox"),
				oldVideoTemplate = '<div class="videoPlayer"><!--Start of Brightcove Player -->	<div style="display:none">	</div>	<!-- By use of this code snippet, I agree to the Brightcove Publisher T and C  found at https://accounts.brightcove.com/en/terms-and-conditions/.  -->	<object id="myExperience{{videoID}}" class="BrightcoveExperience ">	<param name="bgcolor" value="#FFFFFF" />	  <param name="width" value="720" />	<param name="wmode" value="transparent" />	<param name="height" value="405" />	<!-- With  a play bar and controls-->	<param name="playerID" value="1775590098001" />	<param name="playerKey" value="AQ~~,AAAAwFCyREk~,R6fcmQA_ySIWpZg9nFDhZmNK5rvTWkdy" />	<param name="isVid" value="true" />	<param name="dynamicStreaming" value="true" />	<param name="@videoPlayer" value="{{videoID}}" />	<param name="autoStart" value="true" />	<param name="isUI" value = "true" />	<!-- params for Universal Player API -->	<param name="includeAPI" value="true" />	<param name="secureConnections" value="true" />	<param name="secureHTMLConnections" value="true" />	</object>	<!--  This script tag will cause the Brightcove Players defined above it to be created as soon as the line is read by the browser. If you wish to have the player instantiated only after the rest of the HTML is processed and the page load is complete, remove the line. -->	<!-- End of Brightcove Player -->',
				videoTemplate ="<video id='VideoPlayer' data-video-id='{{videoID}}'style='width: 720px; height: 405px;' data-account='825987581001' data-player='rJ7jMPzx' data-embed='default' class='video-js' autoplay controls></video>",
				pdfTemplate="<object data='{{documentLink}}' type='application/pdf' width='100%' height='100%'><p>It appears you don't have a PDF plugin for this browser.   No biggie... you can <a href='{{documentLink}}'>click here to  download the PDF file.</a></p></object>",
				simulationTemplate="<object width='100%' height='100%' align='middle' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'><param id='paramSRC' value='{{simulationLink}}' name='movie'><param value='high' name='quality'><param value='#ffffff' name='bgcolor'><param value='true' name='play'><param value='true' name='loop'><param value='window' name='wmode'><param value='showall' name='scale'><param value='true' name='menu'><param value='false' name='devicefont'><param value='' name='salign'><param value='sameDomain' name='allowScriptAccess'><!--[if !IE]>--><object id='objectSRC' width='100%' height='100%' data='<%= dataToPass.simulationLink %>' type='application/x-shockwave-flash'><param id='paramSRC2' value='<%= dataToPass.simulationLink %>' name='movie'><param value='high' name='quality'><param value='#ffffff' name='bgcolor'><param value='true' name='play'><param value='true' name='loop'><param value='window' name='wmode'><param value='showall' name='scale'><param value='true' name='menu'><param value='false' name='devicefont'><param value='' name='salign'><param value='sameDomain' name='allowScriptAccess'><!--<![endif]--><a href='http://www.adobe.com/go/getflash'><img alt='Get Adobe Flash player' src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'> </a><!--[if !IE]>--></object><!--<![endif]--></object>";		
			 //adjust the shadowbox style to address overflow with the brightcove player in the box
			 function addStylesheetRules (rules) {
				 
				var styleEl = document.createElement('style'),
					styleSheet;
								
				
				// Append style element to head
				document.head.appendChild(styleEl);
							
				// Grab style sheet
				styleSheet = styleEl.sheet;
							
				for (var i = 0, rl = rules.length; i < rl; i++) {
								
								var j = 1, 
									rule = rules[i], 
									selector = rules[i][0], 
									propStr = '';
								
								// If the second argument of a rule is an array of arrays, correct our variables.
								if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
									
									rule = rule[1];
									j = 0;
								
								}
						
								for (var pl = rule.length; j < pl; j++) {
									
									var prop = rule[j];
									
									propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
									
								}
								
								
								// Insert CSS Rule
								console.log(selector);
								console.log(propStr);
								console.log(styleSheet.cssRules.length);
								styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
							}
							
						}
						
					    addStylesheetRules([['#sb-wrapper #sb-player.html',['overflow','hidden']]]);
			 
			 
		 //console.log(useShadowBox);
			$.each(useShadowBox, function(k,v) {
				var videoClick = $(v),
					height = 0,
					width = 0,
					type="",
					neededTemplate = "";
				 //console.log(useShadowBox);
				 videoClick.oldAddress = videoClick.attr("href");
				 
				 	//videoClick.removeAttr("href");
					
					var videoClickParent = videoClick.parent();
					
					if(videoClickParent.hasClass("video") || videoClick.hasClass("video")) {
							neededTemplate = videoTemplate;
							type= "video";
							videoClick.removeAttr("href");
					} else if(videoClickParent.hasClass("pdf")) {
						neededTemplate = pdfTemplate;	
						type = "document";
						 videoClick.removeAttr("href");
					} else if (videoClickParent.hasClass("powerpoint")) {
						 
						//neededTemplate = simulationTemplate;	
						//type = "simulation";
						 
					}
					
					
					
				  videoClick.click(function() {
					  //console.log("here");
					   var thisVideo = $(this),
					   template,
					   	dataToPass = {};
						 
					  if(type === "video") {
					  	 
						height = 405;
						width = 720;
						
						 dataToPass.videoID =  thisVideo.attr("class").replace("useShadowBox ","");
						 //console.log(dataToPass.videoID);
						 template = neededTemplate.replace(/{{videoID}}/g, dataToPass.videoID);
						 //console.log(template);
					  } else if( type === "document") {
						  
						  height = 650;
						  width=925;
						  dataToPass.documentLink = videoClick.oldAddress
						  template = neededTemplate.replace(/{{documentLink}}/g, dataToPass.documentLink);
					  } else if( type === "simulation") {
						  
						   //simulation is not currently in use and there is no template for it. 
						  height = 650;
						  width=925;
						  dataToPass.simulationLink = videoClick.oldAddress
					  }
					  		  
					  
					  
					  //dataToPass.videoID 
					 // dataToPass.documentLink 
					 // dataToPass.simulationLink  
					  
					   
	 
					 Shadowbox.open({
						 content: template,
						 player: "html",
						 height: height,
						 width: width ,
						 options: {
							 onOpen: function() {
								 console.log(this);
								  //console.log(template); 
								  console.log("onOpen"); 
								 $("#sb-wrapper-inner").css("overflow","visible");
								  $("#sb-player.html").css("overflow","hidden");
								  
								 
								  
								// console.log(brightcove); 
								  
							},
							onLoad: function() {
								console.log("onLoad");
							},
							onFinish: function() {
								// this appears to be called once the content has finished loading into the shadowbox
								console.log("onFinish"); 
								if(type === "video"){
									if(typeof bc !== "undefined" ) {
															
										bc(document.getElementById("VideoPlayer"));
								
									}
								}
								//$("#sb-player").css("overflow","hidden"); 
							} 
						 }
						 
					 });
					 
					   
				  });
				
				
				
			});
						
			
			//Shadowbox.setup("a.document");
			
			//Shadowbox.setup("a.simulation" );
			
		})();
		
 