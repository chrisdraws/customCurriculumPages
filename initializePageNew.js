var curriculumDataObject = curriculumDataObject || {};
(curriculumPageHolderObject = function curriculumPageHolderObject(passedObject) {
	var innerObject = {
		promiseScript: "js/libs/promise/es6-promise.auto.js",
		stylesToLoad: ['style/curriculumPage/customCurriculumBootstrap.css', 'style/jquery.mCustomScrollbar.css', 'style/simplebar.css', 'style/shadowbox.css', 'style/{{pageType}}/{{pageType}}.css', 'style/{{opcoName}}/{{pageType}}.css'],
		jsonFilesToLoad: [],
		scriptsToLoad: ["https://players.brightcove.net/825987581001/rJ7jMPzx_default/index.min.js", "js/libs/jquery/jquery-1.11.2.min.js", "js/libs/bootstrap/bootstrap.js", "js/libs/scrollBar/jquery.mousewheel.min.js", "js/libs/scrollBar/jquery.mCustomScrollbar.js", "js/libs/simplebar/simplebar.js", "js/libs/shadowbox/shadowbox.js"],
		mainContent: "<div class='curriculumPageError'><h4>Sorry Page Error!</h4><p>Sorry a problem occurred while loading the page content please notify your PLMS Admin.</p></div>",
		loadInOrderCounter: 0,
		stylesOrderMaters: false,
		totalLoadedcss: 0,
		jsonOrderMaters: false,
		totalLoadedjson: 0,
		scriptsOrderMaters: true,
		totalLoadedjs: 0,
		resourceLocation: "",
		pageLocationName: '#basicPageObject',
		pageLocation: '',
		blocksToUse: [],
		opcoName: '',
		category: "",
		pageType: "",
		routes: { // currently not supported
			"": "getInfo",
			":variable1": "getInfo", //  run the function getInfo using the value of :variable1
			":variable1/:variable2": "getInfo", //  run the function getInfo using the value of :variable1 and :variable2
			":variable1/:variable2/:variable3": "getInfo" //  run the function getInfo using the value of :variable1, :variable2, and :variable3
		},
		getInfo: function getInfo(variable1, variable2, variable3) {
			// new way to start page
			var mainObject = this;

			mainObject.category = variable3;
			mainObject.pageType = variable1;
			mainObject.opcoName = variable2;

			if (document.location.hostname === "localhost" || document.location.href.indexOf("_Projects/_eLearning") !== -1) {
				mainObject.resourceLocation = "../../";
			} else {
				mainObject.resourceLocation = "https://tek-professional-development.com/cornerstoneResources/storage/";
			}

			mainObject.processDefaultsNew(mainObject, function () {

				// FIX - this is also in the initialize() function

				mainObject.blocks.mainObject = mainObject;

				mainObject.isThisIE(function () {
					mainObject.loadExternalFile(mainObject.resourceLocation + mainObject.promiseScript, "js", "", function () {
						buildPageLocal();
					});
				}, buildPageLocal);

				function buildPageLocal() {
					console.log("Here inside buildPageLocal");
					mainObject.buildPage(function () {

						var cssStylesLoad = mainObject.getResources(mainObject.stylesToLoad, 'css', mainObject.stylesOrderMaters);
						var jsonLoad = mainObject.getResources(mainObject.jsonFilesToLoad, 'json', mainObject.jsonOrderMaters);
						var jsLoad = mainObject.getResources(mainObject.scriptsToLoad, 'js', mainObject.scriptsOrderMaters);

						cssStylesLoad.then(function () {
							console.log("cssStylesLoad complete");
							return jsonLoad;
						}).then(function () {
							console.log("jsonLoad complete");
							return jsLoad;
						}).then(function () {
							console.log("jsLoad complete");
							mainObject.activatePage(mainObject);
						});
					});
				}

				// FIX -- END
			});
		},
		injectIntoPage: function injectIntoPage(locationToLoad, contentToLoad) {

			console.log(locationToLoad);
			if (locationToLoad) {
				locationToLoad.insertAdjacentHTML('beforeEnd', contentToLoad);
			}
		},
		grabLocationDom: function grabLocationDom(locationName) {
			//should always be one location

			return document.querySelectorAll(locationName)[0];
		},
		buildPage: function buildPage(callback) {
			var mainObject = this;

			mainObject.pageLocation = mainObject.grabLocationDom(mainObject.pageLocationName);
			mainObject.pageLocation.innerHTML = "";
			// this gets set to "block" in the initialize.js file and this is probably "#basicPageObject"
			mainObject.pageLocation.style.display = "none";

			// this is the shell of the page.. . . maybe it should also be a block, but it has to be the first block. .  because it holds all the blocks
			mainObject.pageLocation.appendChild(mainObject.blocks.pageFrame.initialize(mainObject));

			//mainObject.injectIntoPage(curriculum,mainObject.mainContent);

			// this is building out the whole page dom and inserting it into the page, they happen in the order they are in the arry of blocksToUse
			mainObject.blocksToUse.forEach(function (blockName) {
				if (mainObject.blocks[blockName]) {
					mainObject.blocks[blockName].initialize(mainObject);
				}
			});

			console.log("here");

			//this call back applies all the functionality to the buidout of the page.
			callback();
		},
		blocks: {
			mainObject: "",
			makePageDomNew: function makePageDomNew(htmlTemplate) {
				var returnData = document.createElement('div');

				returnData.innerHTML = htmlTemplate;

				return returnData.firstChild;
			},
			makePageDom: function makePageDom(initialObject) {

				var newDomInitial;

				function makePageDomNew(passedObject, divToAttachTo) {

					console.log(newDomInitial);
					var newDom;

					for (var key in passedObject) {
						if (passedObject.hasOwnProperty(key)) {
							console.log(key);
							console.log(passedObject[key]);

							if (key !== "children") {
								newDom = document.createElement(key);
								newDom.id = passedObject[key][0];
								newDom.className = passedObject[key][1];
							}
						}
					}
					if (typeof newDomInitial === "undefined") {
						newDomInitial = newDom;
					}

					if (divToAttachTo) {
						divToAttachTo.appendChild(newDom);
					}

					if (passedObject.children) {
						passedObject.children.forEach(function (child) {
							makePageDomNew(child, newDom);
						});
					}
				}
				makePageDomNew(initialObject);
				return newDomInitial;
			},
			buildGoogleCode: function buildGoogleCode(title, areaObjectName, mainObjectCategory, mainObjectPageType) {

				return 'onclick=" if(ga !== \'\' ) { ga(\'send\', \'event\', \'click - ' + mainObjectCategory + ' - ' + mainObjectPageType + '\', \'' + areaObjectName + ' Clicked\', \'' + title + '\', 5, true); } "';
			},
			pageFrame: {
				// this is the framework of the page, these are all the classes for the divs


				initialize: function initialize(mainObject) {

					var blocksObject = mainObject.blocks,
					    pageFrame = this,
					    returnData = "";

					var htmlTemplates = { curriculumPage: '<div id="" class="curriculum">\n\t\t\t\t\t\t\t\t\t\t<div id="" class="leftColumn col-md-9 col-sm-9">\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="intro"></div>\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="mainContent"></div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div id="" class="rightColumn col-md-3 col-sm-3">\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="resources"></div>\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="competencies grayHolder"></div>\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="announcements"></div>\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="careerPlanning"></div>\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="externalResources"></div>\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="needhelp"></div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div id="" class="clear"></div>\n\t\t\t\t\t\t\t\t\t</div>',
						categoryPage: '<div id="" class="categoryPage curriculum col-md-12 col-sm-12">\n\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="titleBanner col-md-12 col-sm-12"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="topContent col-md-12 col-sm-12">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="carousel col-md-8 col-sm-8">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="featured col-md-4 col-sm-4">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="browseContent col-md-12 col-sm-12"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="clear"></div>\n\t\t\t\t\t\t\t\t\t\t\t</div>'
					};
					console.log(mainObject.pageType);
					returnData = blocksObject.makePageDomNew(htmlTemplates[mainObject.pageType]);
					console.log(returnData);
					if (mainObject.opcoName === "aerotek" && (mainObject.category === "leadershipDevelopment" || mainObject.category === "careerDevelopment")) {

						var rightColumn = returnData.querySelector(".rightColumn"),
						    leftColumn = returnData.querySelector(".leftColumn");

						leftColumn.classList.remove("col-md-9");
						leftColumn.classList.remove("col-sm-9");
						leftColumn.classList.add("col-md-8");
						leftColumn.classList.add("col-sm-8");

						rightColumn.classList.remove("col-md-3");
						rightColumn.classList.remove("col-sm-3");
						rightColumn.classList.add("col-md-4");
						rightColumn.classList.add("col-sm-4");
					}

					return returnData;
				}

			},
			titleBanner: {
				location: ".titleBanner",
				initialize: function initialize(mainObject) {
					var titleBannerObject = this,
					    mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    titleInfo = titleBannerObject.data.pages[mainObject.category],
					    newPageContent = '<div class=\'titleHolder ' + mainObject.category + '\'>';

					if (titleInfo.imgSrc) {
						newPageContent += '<img src="' + mainObject.resourceLocation + titleInfo.imgSrc + '" /> ';
					} else {
						newPageContent += '<h2>' + titleInfo.title + '</h2>\n\t\t\t\t\t\t\t\t\t\t\t<h4>' + titleInfo.subTitle + '</h4>';
					}

					newPageContent += '</div>';

					newPageContent = blockObject.makePageDomNew(newPageContent);
					mainObject.grabLocationDom(titleBannerObject.location).appendChild(newPageContent);
				},
				data: {}
			},
			carousel: {
				location: ".carousel",
				initialize: function initialize(mainObject) {
					var carouselObject = this,
					    mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    oldPageContent = '<div class=\'frameHolder\'class="carousel slide" data-ride="carousel" >\n\t\t\t\t\t\t\t\t<div class=\'frames\'>\n\t\t\t\t\t\t\t\t\t<div class=\'frame\'>\n\t\t\t\t\t\t\t\t\t\t<a href="">\n\t\t\t\t\t\t\t\t\t\t\t<div class="content"></div>\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\'frame\'>\n\t\t\t\t\t\t\t\t\t\t<a href="">\n\t\t\t\t\t\t\t\t\t\t\t<div class="content"></div>\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\'frame\'>\n\t\t\t\t\t\t\t\t\t\t<a href="">\n\t\t\t\t\t\t\t\t\t\t\t<div class="content"></div>\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\'frame\'>\n\t\t\t\t\t\t\t\t\t\t<a href="">\n\t\t\t\t\t\t\t\t\t\t\t<div class="content"></div>\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\'frame\'>\n\t\t\t\t\t\t\t\t\t\t<a href="">\n\t\t\t\t\t\t\t\t\t\t\t<div class="content"></div>\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\'buttons\'>\n\t\t\t\t\t\t\t\t\t<div class="button"></div>\n\t\t\t\t\t\t\t\t\t<div class="button"></div>\n\t\t\t\t\t\t\t\t\t<div class="button"></div>\n\t\t\t\t\t\t\t\t\t<div class="button"></div>\n\t\t\t\t\t\t\t\t\t<div class="button"></div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="title">\n\t\t\t\t\t\t\t\t\t<h3>Title Title Title Title</h3>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>',
					    newPageContent = '<div id="myCarousel" class="carousel slide" data-ride="carousel">\n\t\t\t\t\t\t\t\t  <!-- Indicators -->\n\t\t\t\t\t\t\t\t  <ol class="carousel-indicators">';

					var carouselIndicators = '',
					    carouselContent = '',
					    slides = carouselObject.data.pages[mainObject.category].slides;

					slides.forEach(function (slide, index) {
						carouselIndicators += '<li data-target="#myCarousel" data-slide-to="' + index + '" ';

						if (index === 0) {
							carouselIndicators += ' class="active"';
						}

						carouselIndicators += '></li>';

						carouselContent += '<div class="item';

						if (index === 0) {
							carouselContent += ' active';
						}

						carouselContent += '">\n\t\t\t\t\t\t\t\t\t  <a target="_blank" class="submittedResource ' + slide.type + '" href="' + slide.link + '"  ' + blockObject.buildGoogleCode(slide.title, carouselObject.name, mainObject.category, mainObject.pageType) + '>';

						var imgSrc = "";
						if (slide.imgSrc !== "") {
							imgSrc = slide.imgSrc;
						}
						if (imgSrc.indexOf("//") !== -1) {} else {

							imgSrc = mainObject.resourceLocation + imgSrc;
						}

						carouselContent += '<div class="content"><img src="' + imgSrc + '"/></div>\n\t\t\t\t\t\t\t\t\t\t\t<div class="title">\n\t\t\t\t\t\t\t\t\t\t\t\t<h3>' + slide.title + '</h3>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>';
					});

					newPageContent += carouselIndicators + '\n\t\t\t\t\t\t\t\t\t\t\t</ol>\n\n\t\t\t\t\t\t\t\t  <!-- Wrapper for slides -->\n\t\t\t\t\t\t\t\t  <div class="carousel-inner">\n\t\t\t\t\t\t\t\t\t' + carouselContent + '\t\t\t\n\t\t\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t   \n\t\t\t\t\t\t\t\t</div>';

					newPageContent = blockObject.makePageDomNew(newPageContent);

					mainObject.grabLocationDom(carouselObject.location).appendChild(newPageContent);
				},
				data: {}
			},
			featured: {
				location: ".featured",
				initialize: function initialize(mainObject) {
					var featuredObject = this,
					    mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    newPageContent = '<div class=\'featuredList\'>\n\t\t\t\t\t\t\t\t<div class=\'listTitle\'>\n\t\t\t\t\t\t\t\t\t<h3>Featured Items</h3>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\'list\'>\n\t\t\t\t\t\t\t\t\t<ul>';

					var features = featuredObject.data.pages[mainObject.category].features;
					// build list items
					features.forEach(function (feature, index) {
						var imgSrc = "img/categoryPage/comingSoon.png";
						newPageContent += '<li class="resourceItem">\n\t\t\t\t\t\t\t\t\t\t\t<a target="_blank" class=\'submittedResource ' + feature.type + '\' href=\'' + feature.link + '\'  ' + blockObject.buildGoogleCode(feature.title, featuredObject.name, mainObject.category, mainObject.pageType) + '>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="thumbnailImage">';
						if (feature.imgSrc !== "") {
							imgSrc = feature.imgSrc;
						}
						if (imgSrc.indexOf("//") !== -1) {} else {

							imgSrc = mainObject.resourceLocation + imgSrc;
						}
						newPageContent += '<img src="' + imgSrc + '" /></div>\n\t\t\t\t\t\t\t\t\t\t\t\t<p class="description">' + feature.title + '</p>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t</li>';
					});

					newPageContent += '</ul>\n\t\t\t\t\t\t\t\t</div>';

					//build suggestion box NOTE - this should be it's own block, but for ease of first time creation, I'm putting it here.

					var suggestion = featuredObject.data.pages[mainObject.category].suggestion;

					newPageContent += '<div class="suggestion">\n\t\t\t\t\t\t\t\t\t<ul class=\'nav nav-tabs\'>\n\t\t\t\t\t\t\t\t\t\t \n\t\t\t\t\t\t\t\t\t\t<li class="dropdown ">\n\t\t\t\t\t\t\t\t\t\t\t<a class="dropdown-toggle" data-toggle="dropdown" href="#">' + suggestion.header + '\n\t\t\t\t\t\t\t\t\t\t\t<span class="caret"></span></a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu">\n\t\t\t\t\t\t\t\t\t\t\t  <li class="header">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="title">' + suggestion.title + ' </span>\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="description">' + suggestion.message + '</span>\n\t\t\t\t\t\t\t\t\t\t\t  </li>';

					var randomEmail = suggestion.emails[Math.floor(Math.random() * suggestion.emails.length)];

					newPageContent += '<li><a href="mailto:' + randomEmail.email + '?cc=skuehn@teksystems.com&subject=APPademics Submission Request&body=Hello,%0A %0A Web address or attachment: %0A %0A Why is this important: %0A %0A What is the target category:%0A %0A %0A %0A"   ' + blockObject.buildGoogleCode(randomEmail.name + " Recipeient", "Content Curator Email ", mainObject.category, mainObject.pageType) + '>' + randomEmail.name + '</a></li>';

					newPageContent += '</ul>\n\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t</div>';

					newPageContent = blockObject.makePageDomNew(newPageContent);

					mainObject.grabLocationDom(featuredObject.location).appendChild(newPageContent);
					// this will add in the suggestion block
					//blockObject.suggestion.initialize(mainObject);
				},
				data: {}
			},
			suggestion: {
				location: "",
				initialize: function initialize(mainObject) {

					var suggestionObject = this,
					    mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    suggestionData = mainObject.blocks.featured.data.pages[mainObject.category].suggestion;

					var newPageContent = '<div class="suggestion">\n\t\t\t\t\t\t\t\t\t<ul class=\'nav nav-tabs\'>\n\t\t\t\t\t\t\t\t\t\t \n\t\t\t\t\t\t\t\t\t\t<li class="dropdown ">\n\t\t\t\t\t\t\t\t\t\t\t<a class="dropdown-toggle" data-toggle="dropdown" href="#">' + suggestion.header + '\n\t\t\t\t\t\t\t\t\t\t\t<span class="caret"></span></a>\n\t\t\t\t\t\t\t\t\t\t\t<ul class="dropdown-menu">\n\t\t\t\t\t\t\t\t\t\t\t  <li class="header">\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="title">' + suggestion.title + ' </span>\n\t\t\t\t\t\t\t\t\t\t\t\t<span class="description">' + suggestion.message + '</span>\n\t\t\t\t\t\t\t\t\t\t\t  </li>';

					var randomEmail = suggestion.emails[Math.floor(Math.random() * suggestionEmails.length)];

					newPageContent += '<li><a href="mailto:' + randomEmail.email + '?cc=skuehn@teksystems.com" ' + blockObject.buildGoogleCode(randomEmail.name + " Recipeient", "Content Curator Email ", mainObject.category, mainObject.pageType) + '>' + randomEmail.name + '</a></li>';

					newPageContent += '</ul>\n\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</div>';

					mainObject.grabLocationDom(featuredObject.location).appendChild(newPageContent);
				}
			},
			browseContent: {
				location: ".browseContent",
				initialize: function initialize(mainObject) {
					var browseContentObject = this,
					    mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    browseData = browseContentObject.data.pages[mainObject.category],
					    menuContent = '',
					    browseContent = '',
					    newPageContent = '<div class=\'browseHolder\'>\n\t\t\t\t\t\t\t\t<div class=\'title\'>\n\t\t\t\t\t\t\t\t\t<h3>' + browseData.title + '</h3>\n\t\t\t\t\t\t\t\t</div>';

					browseData.categories.forEach(function (category, index) {

						menuContent += '<li class="' + category.shortName;

						if (index === 0) {
							menuContent += ' active';
						}

						menuContent += '">';
						if (category.subCategories) {
							// build submenu, NOTE current there should be no subcategories, there is not good layout for it in the browse area

							category.subCategories.forEach(function (subCategory, index2) {

								menuContent += '<li class=\'dropdown ' + category.shortName;

								if (index === 0) {
									menuContent += ' active';
								}

								menuContent += '\'>\n\t\t\t\t\t\t\t\t\t\t\t\t<a class=\'dropdown-toggle\' data-toggle=\'dropdown\' href=\'#\'>' + category.title + '\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\'caret\'></span></a>\n\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\'dropdown-menu\'>\n\t\t\t\t\t\t\t\t\t\t\t\t  <li class=\'' + subCategory.shortName + '\'><a href=\'#\'>' + subCategory.title + ' </a></li>\n\t\t\t\t\t\t\t\t\t\t\t\t  <li class=\'' + subCategory.shortName + '\'><a href=\'#\'>' + subCategory.title + ' </a></li>\n\t\t\t\t\t\t\t\t\t\t\t\t  <li class=\'' + subCategory.shortName + '\'><a href=\'#\'>' + subCategory.title + ' </a></li> \n\t\t\t\t\t\t\t\t\t\t\t\t</ul>';
							});
						} else {
							// no submenu

							menuContent += '<a>' + category.title + '</a>';
						}
						menuContent += '</li>';

						// NOTE no support for subcategories
						browseContent += '<div class=\'category ' + category.shortName + '\'>\n\t\t\t\t\t\t\t\t\t\t<h4>' + category.title + '</h4>\n\t\t\t\t\t\t\t\t\t\t<div class=\'resourcesHolder\'>';
						if (category.resources) {
							category.resources.forEach(function (resource, index) {

								browseContent += '<div class=\'resource\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<a href=\'' + resource.link + '\' class=\'submittedResource ' + resource.type + '\' target=\'_blank\' ' + blockObject.buildGoogleCode(resource.title, browseContentObject.name, mainObject.category, mainObject.pageType) + '><!-- NOTE need to add title:after for "..." -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'thumbnail\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'thumbnailImage\'>';
								var imgSrc = "img/categoryPage/comingSoon.png";
								if (resource.imgSrc !== "") {
									imgSrc = resource.imgSrc;
								}
								if (imgSrc.indexOf("//") !== -1) {} else {

									imgSrc = mainObject.resourceLocation + imgSrc;
								}

								browseContent += '<img src="' + imgSrc + '" /></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="title"><p>' + resource.title + '</p><span class="type">' + resource.type + '</span><span class="time">' + resource.length + '</span></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>';
							});
						}

						browseContent += '\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>';
					}

					/* <li class="active">
     		<a href=''>Anatomy of an Application</a>
     	</li>
     	<li><a href="#">Build vs Buy</a></li>
     	<!-- <li class="dropdown">
     		<a class="dropdown-toggle" data-toggle="dropdown" href="#">Category 2
     		<span class="caret"></span></a>
     		<ul class="dropdown-menu">
     		  <li><a href="#">Sub Topic </a></li>
     		  <li><a href="#">Sub Topic </a></li>
     		  <li><a href="#">Sub Topic </a></li> 
     		</ul>
     	</li> -->
     	<li><a href="#">Life cycle of an Application</a></li>
     	<li><a href="#">Methodology of Software Development</a></li>
     	<li><a href="#">Development Languages</a></li>
     	<!-- <li class="dropdown">
     		<a class="dropdown-toggle" data-toggle="dropdown" href="#">Category 5
     		<span class="caret"></span></a>
     		<ul class="dropdown-menu">
     
     				  <li><a href="#">Sub Topic </a></li>
     		  <li><a href="#">Sub Topic </a></li>
     		  <li><a href="#">Sub Topic </a></li> 
     		</ul>
     	</li> -->
     	<li><a href="#">Customer Impact</a></li>
     	<li><a href="#">Consultant Impact</a></li>
     	<!-- <li class="dropdown">
     		<a class="dropdown-toggle" data-toggle="dropdown" href="#">Category 7
     		<span class="caret"></span></a>
     		<ul class="dropdown-menu">
     		  <li><a href="#">Sub Topic </a></li>
     		  <li><a href="#">Sub Topic </a></li>
     		  <li><a href="#">Sub Topic </a></li> 
     		</ul>
     	</li> -->
     	<li><a href="#">How to Message</a></li> */

					);newPageContent += '<div class=\'menu\'>\n\t\t\t\t\t\t\t\t\t<ul class=\'nav nav-tabs\'>\n\t\t\t\t\t\t\t\t\t\t' + menuContent + '\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\'categoriesHolder\'>\n\t\t\t\t\t\t\t\t\t\t' + browseContent + '\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\n\n\t\t\t\t\t\t\t</div>';

					newPageContent = blockObject.makePageDomNew(newPageContent);

					mainObject.grabLocationDom(browseContentObject.location).appendChild(newPageContent);
				},
				data: {}
			},
			intro: {
				location: ".intro",
				initialize: function initialize(mainObject) {
					var mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    introObject = this,
					    buildObject = '<div id="" class="holder infoBox">\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="title">\n\t\t\t\t\t\t\t\t\t\t\t\t<h3 id="" class="pageTitle">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span id="" class=""></span>\n\t\t\t\t\t\t\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<div id="" class="infoBody">\n\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="video">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<a id="" class="useShadowBox">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="videoThumbnailHolder">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="playbutton"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="videoThumbnail">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<img id="" class="">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="videoTitleHolder">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h4 id="" class="videoTitle"></h4>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="description"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div id="" class="resourcesWelcome"></div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>';

					var newPageContent = blockObject.makePageDomNew(buildObject);

					// get the data

					var pageData = introObject.data.pages[mainObject.category];

					newPageContent.querySelector(".pageTitle span").className = pageData.name;
					newPageContent.querySelector(".pageTitle span").innerHTML = pageData.title;
					if (pageData.introVideo) {
						newPageContent.querySelector(".video").classList.add(pageData.name);
						newPageContent.querySelector(".video a.useShadowBox").classList.add(pageData.introVideo.videoID);
						newPageContent.querySelector(".video .videoThumbnail img").src = pageData.introVideo.thumbnail;
						newPageContent.querySelector(".video .videoTitle").innerHTML = pageData.introVideo.title;
					} else {
						newPageContent.querySelector(".video").style.display = "none";
					}
					var descriptionVar = newPageContent.querySelector(".description");

					descriptionVar.classList.add(pageData.name);

					if (pageData.description) {
						pageData.description.forEach(function (description) {

							var newDom = document.createElement("p");

							newDom.innerHTML = description;

							descriptionVar.appendChild(newDom);
						});
					}
					var resourcesVar = newPageContent.querySelector(".resourcesWelcome"),
					    pageContent = "";

					if (pageData.resources) {

						var audience = "";

						pageContent += blockObject.processSubModules(pageData.resources, blockObject, audience);

						resourcesVar.insertAdjacentHTML('beforeend', pageContent);
					}
					if (mainObject.grabLocationDom(introObject.location)) {
						mainObject.grabLocationDom(introObject.location).appendChild(newPageContent);
					}
				},
				data: {}
			},
			mainContent: {
				location: ".mainContent",
				initialize: function initialize(mainObject) {
					var mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    mainContentObject = this,
					    pageContent = "",
					    pageData = mainContentObject.data.pages[mainObject.category];

					pageContent = '<div class=\'holder infoBox\'>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\'curriculumSelection ' + pageData.name + ' col-md-12 col-sm-12\'>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'holder\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\'selection\'>';

					pageData.sections.forEach(function (section) {
						var selected = "",
						    active = "";
						if (section === pageData.sections[0]) {
							selected = "selected";
						}
						if (section.notActive) {
							active = "notActive";
						}

						pageContent += '<li class=\'option ' + selected + ' ' + active + '\'> <a class=\'' + section.name + '\'>' + section.title + '</a></li>';
					});

					pageContent += '</ul>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>';
					pageData.sections.forEach(function (section) {

						pageContent += '<div class=\'modulesHolder col-md-12 col-sm-12 ' + section.name + '\'>';

						if (section.modules && section.modules.length > 0) {

							section.modules.forEach(function (module) {

								var curriculumIntro = "";

								if (module === section.modules[0]) {
									curriculumIntro = "curriculumIntro";
								}

								pageContent += '<div class=\'module ' + curriculumIntro + '\'>\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'title\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h4>' + module.title + '\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>' + module.subTitle + '</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</h4>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'moduleInfo\'>';
								var audience = "";

								pageContent += blockObject.processSubModules(module.subModules, blockObject, audience);

								pageContent += '</div>';

								if (module.additionalModules) {
									module.additionalModules.forEach(function (additionalMod) {

										var additionalModule = additionalMod;

										pageContent += '<div class=\'divisionalMod additionalMod col-md-12 col-sm-12\'>\t\t\t\t\t\t\t\t\t\t\t\t<h4>' + additionalModule.title + '</h4>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'subModule col-md-12 col-sm-12\'>';

										if (additionalModule.description) {
											pageContent += '<div class=\'description col-md-12 col-sm-12\'>';
											additionalModule.description.forEach(function (description) {
												pageContent += '<p>' + description + '</p>';
											});
											pageContent += '</div>';
										}

										pageContent += '<div class=\'col-md-12 col-sm-12\'>';

										if (additionalModule.groupContent) {

											var groupContent = additionalModule.groupContent;

											groupContent.forEach(function (group) {

												var colWidth = "";

												if (groupContent.length === 2) {

													colWidth = "col-md-6 col-sm-6";
												} else if (groupContent.length === 3) {

													colWidth = "col-md-4 col-sm-4";
												} else if (groupContent.length === 4) {

													colWidth = "col-md-3 col-sm-3";
												} else {}
												pageContent += '<div class=\'singleColumn ' + colWidth + '\'>';

												if (group.title) {
													pageContent += '<h4>' + group.title + '</h4>';
												}
												if (group.description) {
													pageContent += '<div class=\'description\'>';
													group.description.forEach(function (description) {
														pageContent += '<p>' + description + '</p>';
													});
													pageContent += '</div>';
												}
												if (group.resources) {

													pageContent += '<div class=\'resourcesHolder col-md-12 col-sm-12\' ><ul>';
													group.resources.forEach(function (resource) {

														var audience = "";
														if (group.audience) {
															audience = group.audience;
														}
														var passedResources = {
															"resource": resource,
															"mainObject": mainObject,
															"audience": audience
														};

														pageContent += blockObject.resourceCreator(passedResources);
													});

													pageContent += '</ul></div>';
												}

												pageContent += '</div>';
											});
										}
										console.log(additionalModule);
										if (additionalModule.singleContent) {
											console.log("here singleContent");
											var singleContent = additionalModule.singleContent;

											pageContent += '<div class=\'resourcesHolder\' >';

											if (singleContent.resources) {

												pageContent += '<ul class=\'resourcesList doubleColumn\'>';

												singleContent.resources.forEach(function (resource) {

													var audience = "";
													if (singleContent.resources.audience) {
														audience = singleContent.resources.audience;
													}
													var passedResources = {
														"resource": resource,
														"mainObject": mainObject,
														"audience": audience
													};

													pageContent += blockObject.resourceCreator(passedResources);
												});
											}

											pageContent += '</div>';
										}

										pageContent += '<div class=\'clear\'></div></div></div></div>';
									});
								}

								pageContent += '</div>';
							});
						}
						if (pageData.sharedModules) {

							//-- START --  this is to specifically build out an alphabetical selection option in the top module to allow the page to scroll to that section.  to use the function mainObject.scrollToElement this functionality should be setup in the mainObject.activatePage
							var arrayOfAlpha = {};
							pageContent += '<div style=\'display: block;\' class=\'module alphabeticalSelection\'><h5>';

							var audience = "";
							if (section.audience) {
								audience = section.audience;
							}

							pageData.sharedModules.forEach(function (module, index) {
								console.log(audience);
								console.log(module.audiences);
								console.log(module.audiences.indexOf(audience));
								console.log(!module.audiences.indexOf(audience));
								if (module.title && module.audiences.indexOf(audience) !== -1) {
									var title = module.title;

									if (!arrayOfAlpha[title.charAt(0)]) {
										arrayOfAlpha[title.charAt(0)] = title;

										if (index !== 0) {
											pageContent += ' - ';
										} else {}
										pageContent += '<span rel=\'' + title.replace(/ /g, '_').replace(/&amp;/g, "_") + '\'>' + title.charAt(0) + '</span>';
									}
								}
							});
							pageContent += '</h5>\n\t\t\t\t\t\t\t\t\t\t\t</div>';

							// -- END

							pageData.sharedModules.forEach(function (module) {

								if (module.audiences.indexOf(audience) !== -1) {
									var curriculumIntro = "";

									if (module === pageData.sharedModules[0]) {
										curriculumIntro = "curriculumIntro";
									}

									pageContent += '<div class=\'module ' + curriculumIntro + ' ' + module.title.replace(/ /g, '_').replace(/&amp;/g, "_") + '\'>\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'title\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h4>' + module.title + '\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>' + module.subTitle + '</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</h4>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'moduleInfo\'>';

									pageContent += blockObject.processSubModules(module.subModules, blockObject, audience);

									pageContent += '</div>\n\n\n\t\t\t\t\t\t\t\t\t\t\t\t</div>';
								}
							});
						}

						pageContent += '</div>';
					});

					pageContent += '<div class=\'clear\'></div></div><div class=\'clear\'></div>';

					mainObject.injectIntoPage(mainObject.grabLocationDom(mainContentObject.location), pageContent);
				},
				data: {}
			},
			resourceCreator: function resourceCreator(passedResources) {
				var resource = "",
				    audience = "",
				    mainObject = "",
				    useResource = true;
				if (passedResources.resource) {
					resource = passedResources.resource;
				}
				if (passedResources.audience) {
					audience = passedResources.audience;
				}
				if (passedResources.mainObject) {
					mainObject = passedResources.mainObject;
				}
				if (!resource.notActive) {

					if (resource.audiences) {
						if (resource.audiences.indexOf(audience) !== -1) {} else {

							useResource = false;
						}
					}
				} else {

					useResource = false;
				}

				var pageContent = "";

				if (useResource) {
					if (resource.type === "description") {
						pageContent += '<li class=\'' + resource.type + 'Resource\'>' + resource.text + '</li>';
					} else {

						var urlPath = "",
						    launchTypes = {
							launchTraining: "/DeepLink/ProcessRedirect.aspx?module=launchtraining&lo=",
							learningObjectDetails: "/DeepLink/ProcessRedirect.aspx?module=lodetails&lo=",
							registerAndLaunch: "/DeepLink/ProcessRedirect.aspx?module=loRegisterAndLaunch&lo="

						},
						    launchType = [];

						if (resource.type === "instructor course") {
							// Launch Training  "/DeepLink/ProcessRedirect.aspx?module=launchtraining&lo="
							// Learning Object Details  "/DeepLink/ProcessRedirect.aspx?module=lodetails&lo="
							// Register User and Launch Training "/DeepLink/ProcessRedirect.aspx?module=loRegisterAndLaunch&lo="
							launchType = launchTypes.learningObjectDetails;
							if (resource.launch) {
								launchType = launchTypes[resource.launch];
							}
							urlPath = launchType + resource.loid;
						} else if (resource.type === "course") {
							launchType = launchTypes.registerAndLaunch;
							if (resource.launch) {
								launchType = launchTypes[resource.launch];
							}
							urlPath = launchType + resource.loid;
						} else if (resource.type === "checkList") {

							urlPath = resource.urlLoc;
						} else if (resource.urlLoc.indexOf("//") !== -1) {
							urlPath = resource.urlLoc;
						} else {
							urlPath = mainObject.resourceLocation + resource.urlLoc;
						}

						var newOrOld = "";

						if (resource.date) {

							newOrOld = mainObject.resourceMoreThanXDaysOld(resource.date, 30);
						}
						var shadowBox = "dontUseShadowBox";

						if (resource.useShadowBox) {

							shadowBox = "useShadowBox";
						} else {}
						var description = resource.description || "",
						    videoID = resource.videoID || "";

						pageContent += '<li class=\'resource ' + resource.type + ' ' + newOrOld + '\'><a href=\'' + urlPath + '\' class=\'' + shadowBox + ' ' + videoID + '\' title=\'' + description + '\' target=\'' + resource.target + '\'>' + resource.title + '</a></li>';

						pageContent += " ";
					}
				}
				return pageContent;
			},
			processSubModules: function processSubModules(subModules, blockObject, audience) {

				var pageContent = "";

				subModules.forEach(function (subMod) {

					var subMod2 = subMod.type2 || "",
					    subModWidth = subMod.width || "";

					pageContent += '<div class=\'' + subMod.type + subMod2 + ' ' + subModWidth + '\'>';

					if (subMod.title) {

						pageContent += '<h5>' + subMod.title;
						if (subMod.type === "description") {
							pageContent += ':';
						}
						pageContent += '</h5>';
					}

					if (subMod.type === "description") {
						if (subMod.text) {
							pageContent += '<p>' + subMod.text + '</p>';
						}
						if (subMod.goals) {

							pageContent += '<ul class=\'goalList\'>';

							subMod.goals.forEach(function (goal) {

								pageContent += '<li>' + goal.text + '</a></li>';
							});

							pageContent += '</ul>';
						}
					} else if (subMod.type === "resources") {

						pageContent += '<ul class=\'' + subMod.type + 'List  ' + subMod.width + '\'>';

						if (subMod.resources) {

							subMod.resources.forEach(function (resource) {

								var passedResources = {
									"resource": resource,
									"mainObject": blockObject.mainObject,
									"audience": audience

								};

								pageContent += blockObject.resourceCreator(passedResources);
							});
						}

						pageContent += '</ul>';
					}
					if (subMod.note) {
						pageContent += '<div class=\'note\'>' + subMod.note + '</div>';
					}

					pageContent += '</div>';
				});

				return pageContent;
			},
			resources: {
				location: ".resources",
				initialize: function initialize(mainObject) {
					var mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    resourcesObject = this;
					if (resourcesObject.data[mainObject.category]) {
						var resourcesData = resourcesObject.data[mainObject.category],
						    pageContent = '<div class=\'holder infoBox\'>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'title\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<h4 class=\'pageTitle\'>' + resourcesData.title + '</h4>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'infoBody\'>';
						if (resourcesData.description) {
							pageContent += '<p class=\'description\'>' + resourcesData.description + '</p>';
						}
						pageContent += '<ul class=\'resourcesList rec\'>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\'' + mainObject.category + '\'>';
						var audience = "";
						resourcesData.resources.forEach(function (resource) {
							var passedResources = {
								"resource": resource,
								"mainObject": mainObject,
								"audience": audience

							};

							pageContent += blockObject.resourceCreator(passedResources);
						});

						pageContent += '</div>\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>';

						mainObject.injectIntoPage(mainObject.grabLocationDom(resourcesObject.location), pageContent);
					}
					//+mainObject.category+
				},
				data: {}
			},
			competencies: {

				location: ".competencies",
				initialize: function initialize(mainObject) {

					if (this.data.audience.indexOf(mainObject.category) !== -1) {

						var mainObject = mainObject,
						    blockObject = mainObject.blocks,
						    competenciesObject = this,
						    pageContent = '<div class=\'holder infoBox ' + mainObject.category + '\'>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'title\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<h4 class=\'pageTitle\'>Competencies &amp; Trainings</h4>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'infoBody\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ul>';

						competenciesObject.data.competencies.forEach(function (competency) {

							if (competency.audience.indexOf(mainObject.category) !== -1) {

								pageContent += '<li class\'link\'><a title=\'\' href=\'' + competency.url + '\' target=\'_blank\'>' + competency.title + '</a></li>';
							}
						});

						pageContent += '</ul>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>';

						mainObject.injectIntoPage(mainObject.grabLocationDom(competenciesObject.location), pageContent);
					}
				},
				data: {}
			},
			careerPlanning: {

				location: ".careerPlanning",
				initialize: function initialize(mainObject) {

					if (this.data.audience.indexOf(mainObject.category) !== -1) {

						var mainObject = mainObject,
						    blockObject = mainObject.blocks,
						    careerPlanningObject = this,
						    pageContent = '<div class=\'holder infoBox ' + mainObject.category + '\'>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'title\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<h4 class=\'pageTitle\'>Career Planning</h4>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'infoBody\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p>Leverage this section to learn more about different career options that may be a good fit for you.</p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h5>Career Paths</h5>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p>View different career paths employees in our company have taken. Career paths are updated quarterly and feature one employee from each region, SS&O and Corporate.</p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a target=\'_blank\' href=\'http://allegislearning.allegisgroup.com/aerotek/career_path/index.html\'><span class=\'glyphicon glyphicon-arrow-right\'></span>Career Path Page</a>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h5>Job Descriptions</h5>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p>Access a list of Aerotek job descriptions.</p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a target=\'_blank\' href=\'https://allegiscloud.sharepoint.com/sites/aeronet/mylifeandcareer/hr/Pages/JobDescriptions.aspx\'><span class=\'glyphicon glyphicon-arrow-right\'></span>Job Descriptions</a>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h5>Current Allegis Career Opportunities</h5>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p>Click to access a list of current job openings within Allegis Group.</p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a target=\'_blank\' href=\'https://allegiscloud.sharepoint.com/sites/aeronet/mylifeandcareer/jobs/Pages/default.aspx?Company\'><span class=\'glyphicon glyphicon-arrow-right\'></span>Allegis Career Opportunities</a>';

						if (mainObject.category === "careerDevelopment") {
							pageContent += '<h5>Corporate Refresher</h5>\n\t\t\t\t\t\t\t\t\t\t\t<p>Whether you are tenured in your role or just want to sharpen your knowledge, click here for a corporate refresher course.</p>\n\t\t\t\t\t\t\t\t\t\t\t<a target=\'_blank\' href=\'https://myapps.microsoft.com/signin/Cornerstone/9e7052a4d923460b9ce2f75182f33445?RelayState=%252fDeepLink%252fProcessRedirect.aspx%253fmodule%253dlodetails%2526lo%253d976fabe3-7ce8-4020-b701-79142883725f\'><span class=\'glyphicon glyphicon-arrow-right\'></span>Corporate Refresher Course</a>';
						}
						pageContent += '</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>';

						mainObject.injectIntoPage(mainObject.grabLocationDom(careerPlanningObject.location), pageContent);
					}
				},
				data: []
			},
			announcements: {

				location: ".announcements",
				initialize: function initialize(mainObject) {
					var mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    announcementsObject = this,
					    pageContent = "<div class='holder infoBox'>";
					pageContent += "<div class='title'>";
					pageContent += "<h4 class='pageTitle'>Announcements</h4>";
					pageContent += "</div>";
					pageContent += "<div class='infoBody'>";
					pageContent += "<ul class='announcementList'>";

					announcementsObject.data.forEach(function (announcement) {
						// NOTE  should change this so the data structure for each object is the same  So the data structure should be a group of announcements for an audience. . . . at least I think. . . it kinda changes. .  oh well
						if (announcement.audience === mainObject.category) {
							pageContent += '<li class=\'announcement ' + announcement.oldNew + ' ' + announcement.audience + '\'>\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\'date\'>' + announcement.date + '</span>\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\'content\'> ' + announcement.content + '</span>\n\t\t\t\t\t\t\t\t\t\t\t</li>';
						}
					});

					pageContent += '</ul>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>';

					mainObject.injectIntoPage(mainObject.grabLocationDom(announcementsObject.location), pageContent);
				},
				data: []

			},
			externalResources: {

				location: ".externalResources",
				initialize: function initialize(mainObject) {
					var mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    externalResourcesObject = this,
					    objectData = externalResourcesObject.data;
					if (objectData.audience.indexOf(mainObject.category) !== -1) {

						var pageTitle = "External Resources";

						// NOTE -- should this have the date restructured where the external resources are split into different categories??  Or just the titles?  hmm, not sure. .

						if (objectData.titles && objectData.titles[mainObject.category]) {

							pageTitle = objectData.titles[mainObject.category];
						}
						var pageContent = '<div class=\'holder infoBox ' + mainObject.category + '\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'title\'>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h4 class=\'pageTitle\'>' + pageTitle + '</h4>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\'infoBody\'>';

						if (objectData.socialMediaIcons && objectData.socialMediaIcons.audience.indexOf(mainObject.category) !== -1) {

							pageContent += '<ul class=\'socialMedia\'>';
							objectData.socialMediaIcons.icons.forEach(function (socialMedia) {

								pageContent += '<li class=\'icon ' + socialMedia.name + '\'>\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a title=\'' + socialMedia.title + '\' href=\'' + socialMedia.linkTarget + '\' target=\'_blank\'></a>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</li>';
							});
							pageContent += '</ul>';
						}
						if (objectData.externalResourcesNoIcons && objectData.externalResourcesNoIcons.audience.indexOf(mainObject.category) !== -1) {

							pageContent += '<ul>';
							objectData.externalResourcesNoIcons.resources.forEach(function (exResource) {

								pageContent += '<li class=\'noIcon ' + exResource.name + '\'><a title=\'' + exResource.title + '\' href=\'' + exResource.linkTarget + '\' target=\'_blank\'>' + exResource.title + '</a></li>';
							});
							pageContent += '</ul>';
						}

						if (objectData.externalResourcesGrouped && objectData.externalResourcesGrouped.audience.indexOf(mainObject.category) !== -1) {

							objectData.externalResourcesGrouped.groups.forEach(function (thisGroup) {

								if (thisGroup.audience.indexOf(mainObject.category) !== -1) {
									pageContent += '<h5>' + thisGroup.title + '</h5>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul>';
									thisGroup.resources.forEach(function (exResource) {

										pageContent += '<li class=\'noIcon ' + exResource.name + '\'><a title=\'' + exResource.title + '\' href=\'' + exResource.linkTarget + '\' target=\'_blank\'>' + exResource.title + '</a></li>';
									});
									pageContent += '</ul>';
								}
							});
						}

						pageContent += '</div>\n\t\t\t\t\t\t\t\t\t\t</div>';

						mainObject.injectIntoPage(mainObject.grabLocationDom(externalResourcesObject.location), pageContent);
					}
				},
				data: []
			},
			needHelp: {

				location: ".needhelp",
				initialize: function initialize(mainObject) {
					var mainObject = mainObject,
					    blockObject = mainObject.blocks,
					    needHelpObject = this,
					    pageContent = "";

					needHelpObject.data.forEach(function (needHelp) {

						var needHelpTitle = needHelp.title || "Questions?",
						    needHelpDescription = needHelp.description || "Don't see what you need here?  Send us a quick email with your questions or comments.";

						pageContent += '<div class=\'holder infoBox ' + needHelp.audience + '\'>\n\n\n\n\t\t\t\t\t\t\t\t\t\t\t<h4>' + needHelpTitle + '</h4>\n\t\t\t\t\t\t\t\t\t\t\t<p>' + needHelpDescription + '</p>\n\t\t\t\t\t\t\t\t\t\t\t<h4 class=\'email ' + needHelp.audience + '\'>\n\t\t\t\t\t\t\t\t\t\t\t\t<a href=\'mailto:' + needHelp.email + '?subject=Questions about ' + needHelp.pageTitle + '\' > Email Us!</a>\n\t\t\t\t\t\t\t\t\t\t\t</h4>\n\t\t\t\t\t\t\t\t\t</div>';
					});

					console.log("here");
					mainObject.injectIntoPage(mainObject.grabLocationDom(needHelpObject.location), pageContent);
				},
				data: []
			}
		},
		activatePage: function activatePage() {
			// NOTE -- all parts of this that address specific areas of the page or "blocks" should be broken up and added as an additional function that is called by each blocks initialize function, so that the functionallity for a block is tied to that block. 
			var mainObject = this;
			var pageCurriculum = document.querySelector(".curriculum"),
			    isThisDevelopment = false;

			//console.log("here");

			var setPageID = function func(areaToSet) {

				var docLocHash = document.location.hash;

				if (docLocHash.indexOf("corporateCareerDevelopment") !== -1) {

					areaToSet.setAttribute("id", "careerDevelopment");
				} else if (docLocHash.indexOf("academy") !== -1) {

					areaToSet.setAttribute("id", "academy");
					if (docLocHash.indexOf("development") !== -1) {
						isThisDevelopment = true;
					}
				} else if (docLocHash.indexOf("learningJourney") !== -1) {

					areaToSet.setAttribute("id", "learningJourney");
				} else if (docLocHash.indexOf("recruiter") !== -1) {

					areaToSet.setAttribute("id", "recruiter");

					//document.querySelector(".socialMediaIcons").parentNode.insertBefore(document.querySelector(".announcements"),document.querySelector(".socialMediaIcons").nextElementSibling);

					if (docLocHash.indexOf("/divisionTraining") !== -1) {

						document.querySelector(".divisionalMod").style.display = "block";
					}
					if (docLocHash.indexOf("/linkedin") !== -1) {

						document.querySelector(".linkedinMod").style.display = "block";
					}
				} else if (docLocHash.indexOf("accountManager") !== -1) {

					areaToSet.setAttribute("id", "accountManager");
				} else if (docLocHash.indexOf("leadershipDevelopment") !== -1) {

					areaToSet.setAttribute("id", "leadershipDevelopment");
				} else if (docLocHash.indexOf("fieldCareerDevelopment") !== -1) {

					areaToSet.setAttribute("id", "leadershipDevelopment");
				} else if (docLocHash.indexOf("fsg") !== -1) {

					areaToSet.setAttribute("id", "fsg");
				} else {

					//pageCurriculum.removeClass("recruiter accountManager");

				}
				return func;
			}(pageCurriculum);

			pageCurriculum.style.display = "block";

			var curriculumSelectionButtons2 = document.querySelectorAll(".curriculumSelection a");
			var firstTimeThrough = true;

			for (var l = 0; l < curriculumSelectionButtons2.length; l++) {
				var buttonHere = curriculumSelectionButtons2[l];

				buttonHere.addEventListener("click", function () {

					//console.log("button clicked");
					var button = this,
					    buttonClass = button.getAttribute("class");

					//console.log(buttonClass);
					if (isThisDevelopment && button.classList.contains("acad5")) {

						button.parentElement.classList.toggle("notActive");
					}

					if (!button.parentElement.classList.contains("selected") && !button.parentElement.classList.contains("notActive")) {

						//console.log("here");
						button.parentNode.classList.toggle("selected");
						var siblingsOfParent = button.parentElement.parentElement.children;

						if (firstTimeThrough) {
							//console.log("firstTimeThrough");

							for (var i = 0; i < siblingsOfParent.length; i++) {

								var child = siblingsOfParent[i];

								if (button.parentElement !== child) {

									//console.log(child);
									child.classList.toggle("selected");
								}
							}
							//firstTimeThrough = false;
						}

						for (var j = 0; j < siblingsOfParent.length; j++) {

							var child = siblingsOfParent[j];

							if (button.parentElement !== child) {

								if (child.classList.contains("selected")) {
									child.classList.toggle("selected");
								}
							}
						}

						var modulesHolders = pageCurriculum.querySelectorAll(".modulesHolder");

						for (var k = 0; k < modulesHolders.length; k++) {

							var module = modulesHolders[k];

							if (module.classList.contains(buttonClass)) {

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

			//setup scroll bars

			//NOTE - RESEARCH this works on the curriculum page and uses a version of scrolling that is clickable, but not draggable in IE.  It works perfectly in chrome.  The styling for the boxes in the right is causing some kind of conflict, but I'm not sure what the issue is.
			function addScrollBars(target) {
				//jquery is required for this
				$(target).mCustomScrollbar({
					scrollButtons: {
						enable: true
					},
					theme: "dark-2"
				});
			}

			//NOTE -- research further: this works on the categories page and for some reason doesn't work on the curriculumpage. The styling in the right column is causing some kind of conflict so the scrolling does nto work correctly in chrome or IE.  This is the preferred and simpler method of adding scrollbars
			function addSimpleScrollbars(target) {
				if (document.querySelectorAll(target)) {
					var targets = document.querySelectorAll(target);

					targets = mainObject.convertToArray(targets);

					targets.forEach(function (targetItem) {
						new SimpleBar(targetItem, { autoHide: false });
					});
				}
			}
			console.log(mainObject.pageType);

			var areasToAddScrolling = {
				curriculumPage: {
					functionToUse: addScrollBars,
					areas: [".announcements .infoBody .announcementList", ".resources .resourcesList.rec", ".grayHolder ul", ".externalResources .holder .infoBody"]
				},

				categoryPage: {
					functionToUse: addSimpleScrollbars,
					areas: [".featuredList .list"]
				}
			};
			areasToAddScrolling[mainObject.pageType].areas.forEach(areasToAddScrolling[mainObject.pageType].functionToUse);

			// this specifically adds functionality to the browse categories section of the category type page		
			if (document.querySelectorAll(".browseContent")[0]) {

				var browseContent = document.querySelectorAll(".browseContent")[0],
				    browseButtons = browseContent.querySelectorAll(".nav.nav-tabs li a"),
				    categories = browseContent.querySelectorAll(".categoriesHolder .category");

				browseContent = mainObject.convertToArray(browseContent);
				browseButtons = mainObject.convertToArray(browseButtons);
				categories = mainObject.convertToArray(categories);

				browseButtons.forEach(function (button) {
					button.addEventListener("click", function (event) {
						browseButtons.forEach(function (button) {
							button.parentElement.classList.remove("active");
						});
						var categoryTarget = event.target.parentElement.classList[0];

						event.target.parentElement.classList.toggle("active");

						categories.forEach(function (category) {
							if (category.classList.contains(categoryTarget)) {

								category.parentElement.insertBefore(category, category.parentElement.firstChild);
							}
						});
					});
				});
			}

			// NOTE -- this targets all submitted resources on the category type pages
			var submittedResources = document.querySelectorAll(".submittedResource");
			if (submittedResources[0]) {
				var targets = mainObject.convertToArray(submittedResources);
				targets.forEach(function (target) {
					if (target.classList.contains("infographic")) {
						if (target.href.indexOf(".jpg") === -1 && target.href.indexOf(".gif") === -1 && target.href.indexOf(".png") === -1) {} else {
							var src = target.href;
							target.addEventListener("click", function (e) {
								e.preventDefault();
								e.stopPropagation();
								var win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=" + screen.width + ", height=" + screen.height + ", top=" + (screen.height - 400) + ", left=" + (screen.width - 840));
								win.document.body.innerHTML = '<img src="' + src + '"/>';
							});
						}
					}
				});
			}

			// This adds a navigator into the teksystems FSG Page that will scroll to the corresponding alphabetical area of the modules listed below.

			//mainObject.scrollToElement 

			var alphabeticalSelection = document.querySelectorAll(".module.alphabeticalSelection");
			console.log("here alphaBlock");
			if (alphabeticalSelection[0]) {

				var alphaBlocks = mainObject.convertToArray(alphabeticalSelection);

				alphaBlocks.forEach(function (alphaBlock) {

					//console.log(alphaBlock.parentElement);
					selectionElements = mainObject.convertToArray(alphaBlock.querySelectorAll('span'));

					selectionElements.forEach(function (element) {

						element.addEventListener("click", function (e) {
							console.log("here");
							e.stopPropagation();
							mainObject.scrollToElement(alphaBlock.parentElement.querySelector("." + element.getAttribute('rel')));
						});
					});
				}

				//mainObject.convertToArray(alphabeticalSelection[0].querySelectorAll('span')); 
				//				
				//				
				//					targets.forEach(function(target) {
				//
				//						target.addEventListener("click",function(e){
				//
				//							var clicked = e.target;
				//
				//
				//
				//						});
				//
				//					})

				);
			}

			/*if(document.querySelector(".featuredList .list")){
   	new SimpleBar(document.querySelector(".featuredList .list"),{autoHide:false});
   }*/
			//jquery is required for this
			//Shadowbox is used on the curriculum type page to load brigthcove videos into a shadowbox
			Shadowbox.init({

				onClose: function onClose() {

					if ($.support.cssFloat === false) {
						$("#sb-container").css("display", "none");
					}
				}
			});

			(function createVideoPlayers() {

				var useShadowBox = $(".useShadowBox"),
				    oldVideoTemplate = '<div class="videoPlayer"><!--Start of Brightcove Player -->	<div style="display:none">	</div>	<!-- By use of this code snippet, I agree to the Brightcove Publisher T and C  found at https://accounts.brightcove.com/en/terms-and-conditions/.  -->	<object id="myExperience{{videoID}}" class="BrightcoveExperience ">	<param name="bgcolor" value="#FFFFFF" />	  <param name="width" value="720" />	<param name="wmode" value="transparent" />	<param name="height" value="405" />	<!-- With  a play bar and controls-->	<param name="playerID" value="1775590098001" />	<param name="playerKey" value="AQ~~,AAAAwFCyREk~,R6fcmQA_ySIWpZg9nFDhZmNK5rvTWkdy" />	<param name="isVid" value="true" />	<param name="dynamicStreaming" value="true" />	<param name="@videoPlayer" value="{{videoID}}" />	<param name="autoStart" value="true" />	<param name="isUI" value = "true" />	<!-- params for Universal Player API -->	<param name="includeAPI" value="true" />	<param name="secureConnections" value="true" />	<param name="secureHTMLConnections" value="true" />	</object>	<!--  This script tag will cause the Brightcove Players defined above it to be created as soon as the line is read by the browser. If you wish to have the player instantiated only after the rest of the HTML is processed and the page load is complete, remove the line. -->	<!-- End of Brightcove Player -->',
				    videoTemplate = "<style> </style><video id='VideoPlayer' data-video-id='{{videoID}}'  data-account='825987581001' data-player='rJ7jMPzx' data-embed='default' class='video-js' autoplay controls></video>",
				    pdfTemplate = "<object data='{{documentLink}}' type='application/pdf' width='100%' height='100%'><p>It appears you don't have a PDF plugin for this browser.   No biggie... you can <a href='{{documentLink}}'>click here to  download the PDF file.</a></p></object>",
				    simulationTemplate = "<object width='100%' height='100%' align='middle' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'><param id='paramSRC' value='{{simulationLink}}' name='movie'><param value='high' name='quality'><param value='#ffffff' name='bgcolor'><param value='true' name='play'><param value='true' name='loop'><param value='window' name='wmode'><param value='showall' name='scale'><param value='true' name='menu'><param value='false' name='devicefont'><param value='' name='salign'><param value='sameDomain' name='allowScriptAccess'><!--[if !IE]>--><object id='objectSRC' width='100%' height='100%' data='<%= dataToPass.simulationLink %>' type='application/x-shockwave-flash'><param id='paramSRC2' value='<%= dataToPass.simulationLink %>' name='movie'><param value='high' name='quality'><param value='#ffffff' name='bgcolor'><param value='true' name='play'><param value='true' name='loop'><param value='window' name='wmode'><param value='showall' name='scale'><param value='true' name='menu'><param value='false' name='devicefont'><param value='' name='salign'><param value='sameDomain' name='allowScriptAccess'><!--<![endif]--><a href='http://www.adobe.com/go/getflash'><img alt='Get Adobe Flash player' src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'> </a><!--[if !IE]>--></object><!--<![endif]--></object>";

				//adjust the shadowbox style to address overflow with the brightcove player in the box

				function addStylesheetRules(rules) {

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

				// this corrects the styling of the shadowbox to. . . do . . . something. .  I think it cancels out scrollbars that are appearing. . .

				addStylesheetRules([['#sb-wrapper #sb-player.html', ['overflow', 'hidden']]]);

				//console.log(useShadowBox);
				$.each(useShadowBox, function (k, v) {

					var videoClick = $(v),
					    height = 0,
					    width = 0,
					    type = "",
					    neededTemplate = "";

					//console.log(useShadowBox);
					videoClick.oldAddress = videoClick.attr("href");

					//videoClick.removeAttr("href");

					var videoClickParent = videoClick.parent();

					if (videoClickParent.hasClass("video") || videoClick.hasClass("video")) {

						neededTemplate = videoTemplate;
						type = "video";
						videoClick.removeAttr("href");
					} else if (videoClickParent.hasClass("pdf")) {
						neededTemplate = pdfTemplate;
						type = "document";
						videoClick.removeAttr("href");
					} else if (videoClickParent.hasClass("powerpoint")) {

						//neededTemplate = simulationTemplate;
						//type = "simulation";

					}

					videoClick.click(function () {

						//console.log("here");
						var thisVideo = $(this),
						    template,
						    dataToPass = {};

						if (type === "video") {

							height = 405;
							width = 720;

							dataToPass.videoID = thisVideo.attr("class").replace("useShadowBox ", "");

							//console.log(dataToPass.videoID);
							template = neededTemplate.replace(/{{videoID}}/g, dataToPass.videoID);
							//console.log(template);
						} else if (type === "document") {

							height = 650;
							width = 925;
							dataToPass.documentLink = videoClick.oldAddress;
							template = neededTemplate.replace(/{{documentLink}}/g, dataToPass.documentLink);
						} else if (type === "simulation") {

							//simulation is not currently in use and there is no template for it.
							height = 650;
							width = 925;
							dataToPass.simulationLink = videoClick.oldAddress;
						}

						Shadowbox.open({

							content: template,
							player: "html",
							height: height,
							width: width,
							options: {
								onOpen: function onOpen() {
									console.log(this);
									//console.log(template);
									console.log("onOpen");
									$("#sb-wrapper-inner").css("overflow", "visible");
									$("#sb-player.html").css("overflow", "hidden");
								},
								onLoad: function onLoad() {
									console.log("onLoad");
								},
								onFinish: function onFinish() {

									// this appears to be called once the content has finished loading into the shadowbox
									console.log("onFinish");
									if (type === "video") {

										if (typeof bc !== "undefined") {

											bc(document.getElementById("VideoPlayer"));
										}
									}
								}
							}
						});
					});
				});
			})();
		},

		convertToArray: function convertToArray(submittedDomObject) {
			// this function is useful when dealing with a querySelectAll and the dom elements need to be converted into an array from their standard form because IE does not like them. . . 	
			var newArray = [];
			for (i = 0; i < submittedDomObject.length; i++) {
				newArray[i] = submittedDomObject[i];
			}

			return newArray;
		},
		scrollToElement: function scrollToElement(pageElement) {
			//pageElement === a DOM element.
			var positionX = 0,
			    positionY = 0;

			while (pageElement !== null) {
				positionX += pageElement.offsetLeft;
				positionY += pageElement.offsetTop;
				pageElement = pageElement.offsetParent;
				window.scrollTo(positionX, positionY);
			}
		},
		resourceMoreThanXDaysOld: function resourceMoreThanXDaysOld(submittedDate, days) {
			var myDate = submittedDate,
			    newDate,
			    currentDate = new Date();

			myDate = myDate.split("-");

			newDate = myDate[1] + "/" + (myDate[0] - 1) + "/" + myDate[2];

			newDate = new Date(myDate[2], myDate[0] - 1, myDate[1]).getTime();

			currentDate = currentDate.getTime();

			if (newDate + days * 86400000 >= currentDate) {
				return "new";
			} else {}
		},
		getCategory: function getCategory(mainObject) {

			//FIX - consider adding in a what opco is this so that it can have an opco and cateogry functionality to control how the page gets created.


			var category = "",
			    receivedHash = document.location.hash.replace("#", "");
			console.log(receivedHash);
			// FIX this is here because it will eventually replace the entire getCategory function
			if (receivedHash.indexOf("/") !== -1) {
				console.log("/ found");
				receivedHashArray = receivedHash.split('/');

				mainObject.newAddress = true;

				mainObject.addressBar.runAddressBar(mainObject);

				//FIX this will be removed later, just putting it here so everything continues to work
				category = mainObject.category;

				return category;
			} else if (receivedHash === "corporateCareerDevelopment") {
				//FIX this needs to be fixed throughout the css so that instead of careerDevelopment corporateCareerDevelopment can be used
				category = "careerDevelopment";
			} else if (receivedHash === "fieldCareerDevelopment") {
				//FIX this needs to be fixed throughout the css so that instead of leadershipDevelopment fieldCareerDevelopment can be used
				category = "leadershipDevelopment";
			} else if (receivedHash.indexOf("accountManager") !== -1) {
				category = "accountManager";
			} else if (receivedHash.indexOf("recruiter") !== -1) {
				category = "recruiter";
				//else if(receivedHash.indexOf("recruiter") !== -1)
			} else if (receivedHash.indexOf("academy") !== -1) {
				category = "academy";
				//else if(receivedHash.indexOf("recruiter") !== -1)
			} else if (receivedHash.indexOf("fsg") !== -1) {
				category = "fsg";
			} else if (receivedHash.indexOf("learningJourney") !== -1) {
				category = "learningJourney";
			}
			mainObject.processDefaults(mainObject);

			return category;
		},
		processDefaults: function processDefaults(mainObjectHere) {
			var mainObject = mainObjectHere,
			    defaultsObject = mainObject.defaultsObject;

			if (defaultsObject.blocksToUse) {
				mainObject.blocksToUse = defaultsObject.blocksToUse;
			}
			if (defaultsObject.opcoName) {
				mainObject.opcoName = defaultsObject.opcoName;
			}
			mainObject.pageType = "curriculumPage";
			if (defaultsObject.blockData) {

				for (var dataObject in defaultsObject.blockData) {

					if (defaultsObject.blockData.hasOwnProperty(dataObject)) {
						if (defaultsObject.blocksToUse.indexOf(dataObject) !== -1) {
							mainObject.blocks[dataObject].data = defaultsObject.blockData[dataObject].data;
						}
					}
				}
			}
		},
		processDefaultsNew: function processDefaultsNew(mainObjectHere, passedFunction) {
			var mainObject = mainObjectHere;
			console.log(mainObject);
			console.log(mainObject.resourceLocation);

			mainObject.loadExternalFileProm(mainObject.resourceLocation + "js/data/" + mainObject.opcoName + "/" + mainObject.pageType + ".js", "js", function () {

				console.log("here new data");
				console.log(window.curriculumDataObject);
				mainObject.defaultsObject = window.curriculumDataObject;

				var defaultsObject = mainObject.defaultsObject;

				if (defaultsObject.blocksToUse) {
					mainObject.blocksToUse = defaultsObject.blocksToUse;
				}

				if (defaultsObject.blockData) {

					for (var dataObject in defaultsObject.blockData) {

						if (defaultsObject.blockData.hasOwnProperty(dataObject)) {
							if (defaultsObject.blocksToUse.indexOf(dataObject) !== -1) {
								if (mainObject.blocks[dataObject]) {
									mainObject.blocks[dataObject].data = defaultsObject.blockData[dataObject].data;
									mainObject.blocks[dataObject].name = dataObject;
								}
							}
						}
					}
				}

				passedFunction();
			});
		},

		initializePage: function initializePage(defaultsObject) {

			var mainObject = this;
			mainObject.defaultsObject = defaultsObject;

			//FIX this activates either the old process or getting the new routing method -> mainObject.addressBar.runAddressBar(mainObject);
			mainObject.category = mainObject.getCategory(mainObject);

			//NOTE - why is this here?  Why does it matter if mainObject.newAddress is defined?
			if (!mainObject.newAddress) {
				var buildPageLocal = function buildPageLocal() {
					mainObject.buildPage(function () {

						var cssStylesLoad = mainObject.getResources(mainObject.stylesToLoad, 'css', mainObject.stylesOrderMaters);
						var jsonLoad = mainObject.getResources(mainObject.jsonFilesToLoad, 'json', mainObject.jsonOrderMaters);
						var jsLoad = mainObject.getResources(mainObject.scriptsToLoad, 'js', mainObject.scriptsOrderMaters);

						cssStylesLoad.then(function () {
							console.log("cssStylesLoad complete");
							return jsonLoad;
						}).then(function () {
							console.log("jsonLoad complete");
							return jsLoad;
						}).then(function () {
							console.log("jsLoad complete");
							mainObject.activatePage(mainObject);
						});
					});
				};

				console.log("pageType is blank");
				mainObject.blocks.mainObject = mainObject;

				if (document.location.hostname === "localhost" || document.location.href.indexOf("_Projects/_eLearning") !== -1) {
					mainObject.resourceLocation = "../../";
				} else {
					mainObject.resourceLocation = "https://tek-professional-development.com/cornerstoneResources/storage/";
				}

				mainObject.isThisIE(function () {
					mainObject.loadExternalFile(mainObject.resourceLocation + mainObject.promiseScript, "js", "", function () {
						buildPageLocal();
					});
				}, buildPageLocal);
			}
		},
		callAjax: function callAjax(url, callback) {
			console.log(callback);
			var xmlhttp = new XMLHttpRequest();

			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState === 4) {
					if (xmlhttp.status === 200) {
						callback(xmlhttp.responseText);
					} else if (xmlhttp.status === 400) {
						alert('There was an error 400');
					} else {
						alert('something else other than 200 or 400 was returned');
						console.log(xmlhttp.responseText);
					}
				}
			};

			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		},
		getResources: function getResources(resourcesToGet, typeOfResources, loadInOrder) {
			var mainObject = this;
			return new Promise(function (resolve, reject) {
				//FIX!! What should happen if the requested resources don't load??
				console.log("here get resources");

				function checkIfAllLoaded(script) {

					mainObject["totalLoaded" + typeOfResources]++;

					if (resourcesToGet.length === mainObject["totalLoaded" + typeOfResources]) {
						console.log("here resolve 1");
						resolve();
					}
				}

				function processLoadInOrder(mainObject, functionToRunHere) {

					console.log("here");
					mainObject["totalLoaded" + typeOfResources]++;

					console.log(resourcesToGet);
					console.log(mainObject.loadInOrderCounter);
					if (resourcesToGet[mainObject.loadInOrderCounter].indexOf("//") === -1) {

						dataFileToLoad = mainObject.resourceLocation + resourcesToGet[mainObject.loadInOrderCounter];
					} else {
						dataFileToLoad = resourcesToGet[mainObject.loadInOrderCounter];
					}
					console.log(dataFileToLoad);
					mainObject.loadExternalFile(dataFileToLoad, typeOfResources, '', function () {
						mainObject.loadInOrderCounter++;

						if (mainObject.loadInOrderCounter <= resourcesToGet.length - 1) {

							functionToRunHere(mainObject, processLoadInOrder);
						}

						if (mainObject["totalLoaded" + typeOfResources] === resourcesToGet.length && mainObject.loadInOrderCounter === resourcesToGet.length) {
							mainObject.loadInOrderCounter = 0;
							console.log("here resolve 2");
							resolve();
						}
					});
				}

				if (resourcesToGet.length > 0) {

					// leave this as true to continue to not try to do this via promises, which does not work as expected.
					if (false) {
						if (!loadInOrder) {
							for (var i = 0; i < resourcesToGet.length; i++) {
								var dataFileToLoad = "";

								if (resourcesToGet[i].indexOf("//") === -1) {

									dataFileToLoad = mainObject.resourceLocation + resourcesToGet[i];
								} else {
									dataFileToLoad = resourcesToGet[i];
								}
								console.log("here");
								mainObject.loadExternalFile(dataFileToLoad, typeOfResources, '', checkIfAllLoaded);
							}
						} else {
							console.log("here");

							processLoadInOrder(mainObject, processLoadInOrder);
						}
					} else {
						var loadNext = function loadNext(n) {

							var next = resourcesToGet[n],
							    dataFileToLoad = "";

							if (next) {

								if (next.indexOf("//") === -1) {

									dataFileToLoad = mainObject.resourceLocation + next;
								} else {

									dataFileToLoad = next;
								}

								return mainObject.loadExternalFileProm(dataFileToLoad, typeOfResources).then(function () {
									return loadNext(n + 1);
								});
							}
							return;
						};

						loadNext(0).then(function () {

							resolve();
						});
					}
				} else {
					console.log("here resolve 3");
					resolve();
				}
			});
		},
		loadExternalFile: function loadExternalFile(filename, filetype, areaToInsert, functionToRun) {
			//FIX!! What should happen if the requested resource doesn't load??

			var mainObject = this,
			    fileref;

			function createElement(type) {
				return document.createElement(type);
			}
			function setAttributes(elementToSet, Attributes) {
				Attributes.forEach(function (attribute) {

					elementToSet.setAttribute(attribute[0], attribute[1]);
				});
			}

			if (!areaToInsert) {
				areaToInsert = "";
			}

			if (!functionToRun) {
				var functionToRun = function functionToRun() {};
			}

			if (filetype === "js") {
				//if filename is a external JavaScript file


				fileref = createElement('script');

				setAttributes(fileref, [["src", filename]]);

				//fileref.setAttribute("src", filename);

			} else if (filetype === "template") {
				// if filename is external template

				fileref = createElement('script');
				setAttributes(fileref, [['type', "text/javascript"], ["src", filename], ["class", "html-template"]]);
			} else if (filetype === "css") {
				//if filename is an external CSS file

				fileref = createElement("link");

				setAttributes(fileref, [["rel", "stylesheet"], ['type', "text/css"], ["href", filename.replace(/{{opcoName}}/g, mainObject.opcoName).replace(/{{pageType}}/g, mainObject.pageType)]]);
			} else if (filetype === "json") {
				//if filename is an external json file

				fileref = document.createElement('script');

				setAttributes(fileref, [['type', "text/javascript"], ["src", filename], ["class", "json"]]);
			}
			//console.log(fileref);
			fileref.onload = function () {
				functionToRun(filename);
			};
			console.log("functionToRun");
			console.log(functionToRun);
			if (typeof fileref !== "undefined") {
				//consider changing to putting items in the head vs the body of the document.
				if (areaToInsert === "") {

					document.getElementsByTagName("head")[0].appendChild(fileref);
				} else {

					document.querySelectorAll('#' + areaToInsert)[0].appendChild(fileref);
				}
			}
		},
		loadExternalFileProm: function loadExternalFileProm(filename, filetype, callBack) {
			console.log("here promise");
			var mainObject = this;

			//FIX!! What should happen if the requested resource doesn't load??
			if (typeof Promise === "undefined") {
				console.log("here before runPromise");
				mainObject.loadExternalFile(mainObject.resourceLocation + mainObject.promiseScript, "js", "", function () {

					return mainObject.loadExternalFileProm(filename, filetype, callBack);
				});
			} else {
				if (!callBack) {
					callBack = function callBack() {};
				}
				return runPromise().then(function () {
					callBack();return Promise.resolve();
				});
			}

			function runPromise() {
				var scriptPromise = new Promise(function (resolve, reject) {
					console.log("here inside runPromise");
					var fileref;

					function createElement(type) {
						return document.createElement(type);
					}
					function setAttributes(elementToSet, Attributes) {
						Attributes.forEach(function (attribute) {

							elementToSet.setAttribute(attribute[0], attribute[1]);
						});
					}

					var functionToRun = function functionToRun() {
						console.log("url ", filename);
						resolve(filename);
					};

					filename = filename.replace(/{{opcoName}}/g, mainObject.opcoName).replace(/{{pageType}}/g, mainObject.pageType);

					if (filetype === "js") {
						//if filename is a external JavaScript file


						fileref = createElement('script');

						setAttributes(fileref, [["src", filename]]);

						//fileref.setAttribute("src", filename);
					} else if (filetype === "template") {
						// if filename is external template

						fileref = createElement('script');
						setAttributes(fileref, [['type', "text/javascript"], ["src", filename], ["class", "html-template"]]);
					} else if (filetype === "css") {
						//if filename is an external CSS file

						fileref = createElement("link");

						setAttributes(fileref, [["rel", "stylesheet"], ['type', "text/css"], ["href", filename]]);
					} else if (filetype === "json") {
						//if filename is an external json file

						fileref = document.createElement('script');

						setAttributes(fileref, [['type', "text/javascript"], ["src", filename], ["class", "json"]]);
					}
					//console.log(fileref);

					fileref.onload = function () {
						console.log("filename Loaded: ", filename);functionToRun();
					};

					if (typeof fileref !== "undefined") {
						//consider changing to putting items in the head vs the body of the document.


						document.getElementsByTagName("head")[0].appendChild(fileref);
					}
				});

				return scriptPromise;
			}
		},
		addressBar: { //currently not supported

			processAddressBar: function processAddressBar(passedThis) {
				console.log(passedThis);
				var currentHashValue = passedThis.currenthashValue.replace("#", ""),
				    hashArray = currentHashValue.split("/"),
				    triggered = false;

				var processVar;

				for (processVar in passedThis.routes) {

					var k = processVar,
					    v = passedThis.routes[processVar];

					// var addressArray = v.split(":");
					// console.log(k); //address value
					// console.log(v); //function to perform

					if (currentHashValue === k) {

						if (passedThis[v] !== undefined) {
							triggered = true;
							passedThis[v]();
						}
					}
				};
				if (triggered === false) {
					console.log("here not triggered");
					var processVar;

					for (processVar in passedThis.routes) {

						var k = processVar,
						    v = passedThis.routes[processVar];

						// var addressArray = v.split(":");
						//console.log(k); //address value
						//console.log(v); //function to perform


						var routeArray = k.split("/");

						if (routeArray[0].charAt(0) === ":") {
							if (routeArray.length === hashArray.length) {

								if (passedThis[v] !== undefined) {
									passedThis[v](hashArray[0], hashArray[1], hashArray[2]);
								} else {
									console.log("no function exists");
								}
							}
						}
					};
				}
			},
			runAddressBar: function runAddressBar(passedThis) {

				var that = passedThis,
				    addressThis = this;

				that.currenthashValue = window.location.hash;
				that.currentHostname = window.location.hostname;

				window.onhashchange = function () {
					console.log("hash changed");
					var newHashValue = window.location.hash;

					if (newHashValue === "") {
						newHashValue = localStorage.hashObject;

						window.location.hash = localStorage.hashObject;
					} else {
						localStorage.setItem("hashObject", newHashValue);
					}

					if (newHashValue !== that.currenthashValue) {
						//console.log(newHashValue);

						// console.log( that.currenthashValue);

						that.currenthashValue = newHashValue;
						addressThis.processAddressBar(that);
					}
				};
				addressThis.processAddressBar(that);
			}
		},
		isThisIE: function isThisIE(callBackTrue, callBackFalse) {
			if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {

				//this is ie
				callBackTrue();
			} else {
				//not ie
				callBackFalse();
			}
		}

	};

	innerObject.initializePage(passedObject);
})(curriculumDataObject);

/// to do list:

// add a spread sheet icon for resources

//add a resource block that can be called on to create the resources from the different blocks rather then creating resources 3 times the same exact way in 3 different areas.

//need to add in "whatToDo" functionallity to courses and instructor courses if they want a different functionality, so it automatically uses the correct link.
// Launch Training  "/DeepLink/ProcessRedirect.aspx?module=launchtraining&lo="
// Learning Object Details  "/DeepLink/ProcessRedirect.aspx?module=lodetails&lo="
// Register User and Launch Training "/DeepLink/ProcessRedirect.aspx?module=loRegisterAndLaunch&lo="

//for the aerotek pages there are instructor lead courses that need to be turned into their own block and then processed into the maincontent block for particular audiences.  Currenlty they are listed in 8 different locations and have to be updated in each place.

// for the TEK FSG version there are currently going to be 2 tabs, US canada with a lot of repeated materials, so make sure you address that and build in such a way that you are able to check and see which audience it's for.   That will be tough because currenlty "tabs" are set up in such a way that all of their data is separate. . .