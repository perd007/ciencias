var XTDCreativeMenusObj;
var newSize;

function buildMenu() {
	XTDCreativeMenusObj = new CreativeMenus();
	newSize = XTDCreativeMenusObj.newSize;

	if (this['swfobject'] != undefined && this['swfobject'] != null && (XTDCreativeMenusObj.getBrowser() == "IE8" || XTDCreativeMenusObj.getBrowser() == "IE7" || XTDCreativeMenusObj.getBrowser() == "IE6")) {
		var str = "XTDCreativeMenusObj.buildMenu()";
		XTDCreativeMenusObj.addLoadEvent(str);
	} else {
	XTDCreativeMenusObj.buildMenu();
}
}

function CreativeMenus() {
	
	this.buildMenu = buildMenu;
	this.newSize = newSize;
	this.addLoadEvent = addLoadEvent;
	this.getBrowser = getBrowser;
	
	function addLoadEvent(str) {
	  var oldonload = window.onload;
	  if (typeof window.onload != 'function') {
		window.onload = function() {
			eval(str);
		}
	  } else {
		window.onload = function() {
		  if (oldonload) {
			oldonload();
		  }
		  eval(str);
		}
	  }
	}
	
	// The menu types
	var types = new Array();
	types["H"] = "Dropdown_Menu";
	types["V"] = "Vertical_Menu";
	types["T"] = "Tabbed_Menu";
	
	
	var menus = new Array();
	var menus_assoc = new Array();
	
	// Other variables
	var linesTemp = new Array();
	var lines = new Array();
	var _len = -1;
	
	var browser = getBrowser();
	var os = getOS();
	
	function createFSCommand(mname) {
/*		document.write('<script language="javascript">\n');
		document.write('function ' + mname + '_DoFSCommand(command, args) {\n');
		document.write('	var ' + mname + 'Obj = (getBrowser().indexOf("IE") == 0) ? document.all.' + mname + ' : document.' + mname + ';\n');
		document.write('	if (command == "resize") {\n');
		document.write('		var arg_arr = args.split(",");\n');
		document.write(' 		newSize(arg_arr[0], arg_arr[1], arg_arr[2]);\n');
		document.write(' 	}\n');
		document.write('}\n');
		document.write('</script>\n');
	
		// Hook for Internet Explorer.
		if (getBrowser().indexOf("IE") == 0) {
			document.write('<script language=\"VBScript\"\>\n');
			document.write('On Error Resume Next\n');
			document.write('Sub ' + mname + '_FSCommand(ByVal command, ByVal args)\n');
			document.write('	Call ' + mname + '_DoFSCommand(command, args)\n');
			document.write('End Sub\n');
			document.write('</script\>\n');
		} */
	}
	
	function resizeMenus() {
		for (var i=0;i<menus.length;i++) {
			menus[i].div.style.width = getMenuWidth(menus[i].ph, menus[i].fitToPage);
			menus[i].div.style.left = getMenuLeft(menus[i].ph, menus[i].fitToPage);
			if (menus[i].fitToPage) menus[i].holder.style.left = getMenuHolderPos(i) + "px";
		
			if (needHolderResize()) resizeHolder(menus[i].name);
			
			if (needSWFResize()) resizeSWF(menus[i].name, true);		
		}
	}
	
	function scrollMenus() {
		for (var i=0;i<menus.length;i++) {
			var w = getMenuWidth(menus[i].ph, menus[i].fitToPage);
			var h = menus[i].div.style.height;
			if (menus[i].fitToPage) menus[i].div.style.width = w;
					
			if (needHolderResize()) resizeHolder(menus[i].name);
					
			if (needSWFResize()) resizeSWF(menus[i].name, true);		
		}
	}	
	
	window.onresize = resizeMenus;
	window.onscroll = scrollMenus;
	
	var addEvent = true;
	var fitToPage = false;
	
	function redim(menuName) {
		var menu =  document.getElementById('creative_menu_' + menuName);
		
		var menuType = menu.getAttribute("menu_type");
	
		var holder = document.getElementById("menu_holder_" + menuName); // Menu holder div
		var PH = document.getElementById("CMPH_" + menuName); // Place holder DIV
		
		var CMPH = findChild(PH,"","IMG");	// Place holder IMG tag
	
		menu.style.top = getY(CMPH) + "px";
		menu.style.left = getMenuLeft(CMPH, menus_assoc[menuName].fitToPage);
		
		menu.style.width = (!menus_assoc[menuName].fitToPage) ? menus_assoc[menuName].width + "px" : (getWindowWidth() + getScrollLeft()) + "px";//getMenuWidth(CMPH, fitToPage);
		
		menu.style.height =  menus_assoc[menuName].height + "px";
		//
	
		// Set the position and dimensions for the menu holder DIV
		holder.style.position = "absolute";
	//	holder.style.backgroundColor = "#DDDDDD";
		holder.align = "left";
		if (menus_assoc[menuName].fitToPage) holder.style.left = getMenuHolderPos(menus_assoc[menuName].index) + "px";	
		holder.style.width = "2000px";
		if (needHolderResize()) resizeHolder(menuName);
		//	
	}
	
	function buildMenu() {
		var menus = document.getElementsByTagName("DIV");
		for(var i = 0; i < menus.length; i++){
			if((menus[i].id) && ((menus[i].id).indexOf("creative_menu_") != -1)) {
				translateMenu(menus[i]);
					
				if (addEvent) {
					var fStr = "redim('" + menus[i].id.replace('creative_menu_', '') + "')";
					addLoadEvent(fStr);
				}
			}
		}
		
		addEvent = false;
	}
	
	function addMenu(name, type, div, holder, ph, fitToPage, width, height) {
		var index = menus.length;
		
		var obj = new Object();
		obj.index = index;
		obj.name = name;
		obj.type = type;
		obj.div = div;
		obj.holder = holder;
		obj.ph = ph;
		obj.fitToPage = fitToPage;
		
		obj.width = width;
		obj.height = height;
		
		menus[index] = obj;
		menus_assoc[name] = obj;
		
		menus[index].lspace = menus_assoc[name].lspace = getMenuLSpace(index);
		menus[index].rspace = menus_assoc[name].rspace = getMenuRSpace(index);
	}
	
	var oldMenu;
	function translateMenu(menu) {
		if (menu.id == 'creative_menu_structure') return;
		
		var menuID = menu.id;
		var menuName = menuID.slice(14);
		var menuType = menu.getAttribute("menu_type");
	
		var holder = document.getElementById("menu_holder_" + menuName); // Menu holder div
		var PH = document.getElementById("CMPH_" + menuName); // Place holder DIV
		var CMPH = findChild(PH,"","IMG");	// Place holder IMG tag
		
		str = holder.innerHTML.replace(/<!--\(start.*menu.*data\)/g, '').replace(/\(end.*menu.*data\)-->/g, '');
		
		var div = document.createElement('div');
		div.innerHTML = str;
		var paramDiv = findChild(div,"menu_options","");
		holder.appendChild(paramDiv);
		
		var menuOptionsDiv = findChild(holder, "menu_options");
		
		if (!menuType) {
			menuType = menuOptionsDiv.getAttribute("menu_type");
		}
		
		var width = menuOptionsDiv.getAttribute("totalwidth");
		var height = menuOptionsDiv.getAttribute("totalheight");
		
		var fitToPage = menuOptionsDiv.getAttribute("fittopage");
		var zindex = menuOptionsDiv.getAttribute("menuzindex");
		
		var cutRoundCorners = menuOptionsDiv.getAttribute("cutroundcorners");
		fitToPage = (fitToPage == "false") ? false : true;
		cutRoundCorners = (cutRoundCorners == "false") ? false : true;
		
		// pass correct dims as CMPH has 0,0 in table on ie
		var el = document.createElement('div');
		el.setAttribute("height", height);
		el.setAttribute("width", width);
		
		addMenu(menuName, menuType, menu, holder, CMPH, fitToPage, width, height);
		
		menu.style.zIndex = zindex;
		// Set the position and dimensions for the menu DIV
		menu.style.position = "absolute";
		menu.style.overflow = "hidden";
	//	menu.style.backgroundColor = "#DDDDDD";
		menu.align = "left";
		
		menu.style.top = getY(CMPH) + "px";
		menu.style.left = getMenuLeft(CMPH, fitToPage);
		
		menu.style.width = (!fitToPage) ? width + "px" : (getWindowWidth() + getScrollLeft()) + "px";//getMenuWidth(CMPH, fitToPage);
		
		menu.style.height = height + "px";
		//
	
		// Set the position and dimensions for the menu holder DIV
		holder.style.position = "absolute";
	//	holder.style.backgroundColor = "#DDDDDD";
		holder.align = "left";
		if (fitToPage) holder.style.left = getMenuHolderPos(menus_assoc[menuName].index) + "px";	
		holder.style.width = "2000px";
		if (needHolderResize()) resizeHolder(menuName);
		//
	
		var rootPath = getRootPath();
		var swfPath = rootPath + types[menuType] + "/creative_dw_menu_" + menuType.toLowerCase() + ".swf";
		if (needSWFResize() || needHolderResize()) {
			var w = Number(menu.style.width.replace('px','')) + Math.abs(Number(holder.style.left.replace('px','')));
			var h = menu.style.height.replace('px','');
			var mSWF = new SWFObject(swfPath, "creative_menu_" + menuName + "_swf", w, h, "8", "#336699");
		} else {
			var mSWF = new SWFObject(swfPath, "creative_menu_" + menuName + "_swf", "100%", "2000" , "8", "#336699");		
		}
	
		if (getBrowser().indexOf('IE') != -1) {
//			createFSCommand("creative_menu_" + menuName + "_swf");
			mSWF.addParam("swLiveConnect","true");		
		}
		
		// Get the menu options from the menu_options DIV and pass them to the SWF
		readParam(menuID,mSWF,menuType);
	
		mSWF.addVariable("menu_type" , menuType);
		mSWF.addVariable("fittopage" , fitToPage);
		mSWF.addVariable("cutroundcorners" , cutRoundCorners);
			
		mSWF.addVariable("lextraspace" , menus_assoc[menuName].lspace);
		mSWF.addVariable("rextraspace" , menus_assoc[menuName].rspace);
		
	
		// Pass the page url and selected button ID (if specified) -- for button persistance
		mSWF.addVariable('page_id', getButtonID(menuName)); 
		mSWF.addVariable('page_url', location.href);
		//
		
		mSWF.addVariable('cm_name', menuName);
		mSWF.addVariable('opsys', os);
		mSWF.addVariable('browser', browser);
		
		mSWF.addParam("wmode","transparent");
		mSWF.addParam("allowScriptAccess","sameDomain");
		mSWF.addParam("scale","noscale");
	
		mSWF.write("menu_holder_" + menuName);
	}
	
	
	//
	//  Menu properties related functions
	//
	
	function getRootPath() {
		var scripts = document.getElementsByTagName("SCRIPT");
		var relPath;
		for(var k=0; k < scripts.length; k++){
			if (((scripts[k].src).indexOf("menuDisplay.js") != -1) && (scripts[k].src)) {
						relPath = scripts[k].getAttribute("src"); 
			}
		}
		return String(relPath).replace('menuDisplay.js','');
	}
	
	function getMenuWidth(ph, fitToPage) {
		return (!fitToPage) ? ph.getAttribute("width") + "px" : (getWindowWidth() + getScrollLeft()) + "px";
	}
	
	function getMenuLeft(ph, fitToPage) {
		return (fitToPage) ? (0 - getAbsParentX(ph)) + "px" : getX(ph) + "px";
	}
	
	function getMenuHolderPos(i) {
		var mpos = getAbsX(menus[i].ph);
		return mpos - menus[i].lspace;
	}
	
	function getMenuLSpace(i) {
		return (menus[i].fitToPage) ? (2000 - menus[i].width) / 2 : 0;
	}
	
	function getMenuRSpace(i) {
		return (menus[i].fitToPage) ? (2000 - menus[i].width) / 2 : 0;
	}
	
	
	function getButtonID(menuName) {
		var url = location.href;
		var id = "";
		if (url.indexOf('?' + menuName + '_select=') != -1 || url.indexOf('&' + menuName + '_select=') != -1) {
			var i = (url.indexOf('?' + menuName + '_select=') == -1) ? url.indexOf('&' + menuName + '_select=') : url.indexOf('?' + menuName + '_select=');
			id = url.substr(i + menuName.length + 9);
			
			if (id.indexOf('&') != -1) id = id.substr(0, id.indexOf('&'));
		}
		
		return id;
	}
	
	//
	//  END -- Menu properties related functions
	//
	
	//
	//  Parameter manipulation functions 
	//
	
	// Gets the parameters from the div structure and passes it to the SWF
	function readParam(mID,mSWF){
		
		var menuName = mID.slice(14);
		var holder = document.getElementById("menu_holder_" + menuName);
		
		var mMenu = document.getElementById(mID);
		var mKids = holder.childNodes;
		var resizes = new Array();
		
		for( var i = 0; i < mKids.length; i++) {
			if (mKids[i].id == "menu_options") {
				mOptions = mKids[i];
				var mAttrib = mKids[i].attributes;
				var fitToPage = mAttrib["fitToPage"];
				
				for (var j = 0; j < mAttrib.length; j++) {
					if ((mAttrib[j].name) && (mAttrib[j]["name"] != undefined) && (mAttrib[j].value != undefined) && (mAttrib[j]["name"] != "ID") && (mAttrib[j].name != null)){
						var tempy = mAttrib[j].value;
						tempy = tempy.replace(/#/g,"0x");
						mSWF.addVariable(String(mAttrib[j]["name"]).toLowerCase() , tempy);
					}
				}
				var divs = mOptions.getElementsByTagName("div");
				for (var k = 0; k < divs.length; k++) {
					mOptions = divs[k];
					if (divs[k].attributes) {
						var mAttrib = divs[k].attributes;
						for (var j=0; j < mAttrib.length ; j++) {
							if ( (mAttrib[j]["name"]) && (mAttrib[j]["name"] != undefined) && (mAttrib[j].value != undefined) && (mAttrib[j]["name"] != "ID") && (mAttrib[j].name != null)){
								if (String(mAttrib[j]["name"]).toLowerCase() == "resize") {
										resizes.push(mAttrib[j].value);
								}
								else {
									var tempy = mAttrib[j].value;
									tempy = tempy.replace(/#/g,"0x");
									mSWF.addVariable(String(mAttrib[j]["name"]).toLowerCase() , tempy);//mAttrib[j].value);
								}
							}
						}
					}
				}
			} else {
				if((mKids[i].id == "creative_menu_structure") && (mKids[i].id)){
					var struc = translateStructure(mKids[i]);
					struc = struc.replace(/\n/g,"{XTD_NEW_LINE}");
					struc = struc.replace(/\%/g,"%25");
					struc = struc.replace(/\&/g,"%26");
					mSWF.addVariable("menuText",struc.replace(/"/g, "{XTD_QT}"));
					mSWF.addVariable("xtd_cmd", "true");
				}
			}
		}
	  
		mSWF.addVariable("mainPath", getRootPath());
		if (mMenu.getAttribute("menu_type")) {
			mSWF.addVariable("menu_type", mMenu.getAttribute("menu_type"));
		}
		
		if (holder.getAttribute("title")) {
			mSWF.addVariable("menu_type", holder.getAttribute("title"));
		}
		
		var res_str = resizes.join(";");
		mSWF.addVariable("resizes", res_str);  
	
	}
	
	// Translates the menu structure in a string
	function translateStructure(refDiv){
		if (!refDiv) {
			alert("refDiv: " + refDiv); return " ";
		} else {
			_len = -1;
			for (var ce = 0; ce < refDiv.childNodes.length ; ce++){
				goDiv(refDiv.childNodes[ce]);
			}
			lines = linesTemp;
			var finTA = "";
			for (var i = 0; i <= _len; i++){
				finTA += lines[i] + "\n";
			}
			return finTA;
		}
	}
	
	// translates a div and it's children
	function goDiv(obj){
	try {	
		if(obj.getAttribute && obj.childNodes[0].innerHTML) {
			var level = '';
			level = obj.childNodes[0].getAttribute("level");
			
			if (!level) {
				level = obj.childNodes[0].getAttribute("title");
			}
					
			linesTemp[++_len] = level + obj.childNodes[0].innerHTML.replace(/\\n/g, "{XTD_NL}");
			if (obj.childNodes[0].getAttribute("href") || obj.childNodes[0].getAttribute("target") || obj.getAttribute("id")) {
				var href = obj.childNodes[0].getAttribute("href");
	//			if (browser == "IE6" || browser == "IE7" || browser == "Camino") {
	//			if (obj.childNodes[0].outerHTML && String(obj.childNodes[0].outerHTML).indexOf('href=""') != -1) href = "";
				if (obj.childNodes[0].getAttribute("name") == "empty") href = "";
	//			alert(obj.childNodes[0].outerHTML + ' -- ' + href);
	//			}
				linesTemp[_len] += "," + href;
			}
			if (obj.childNodes[0].getAttribute("target") || obj.getAttribute("id")) linesTemp[_len] += "," + obj.childNodes[0].getAttribute("target");
			if (obj.getAttribute("id")) linesTemp[_len] += "," + obj.getAttribute("id");
		}
		for (var k = 1; k < obj.childNodes.length ; k++){
				goDiv(obj.childNodes[k]);	
		}
	}catch (e) {
		alert('error div 1 : ' + e);
	}
	}
	
	//
	//  END -- Parameter manipulation functions 
	//
	
	
	//
	//  HTML Elements manipulation functions
	//
	/*
	function trace(str) {
		var tracer = document.getElementById('tracer');
		tracer.value = str + '\n' + tracer.value;
	}
	*/
	
	function scrollBarSize() {
		if (String(browser).indexOf('Firefox') != -1 || browser == "Camino") return 20;
		
		return 0;
	}
	
	function newSize(menu_name, width, height, type, msg) {
        if (type == "od changed") {
            //alert("msg: " + height);
        }
		var div = document.getElementById("creative_menu_" + menu_name);
		var holder = document.getElementById("menu_holder_" + menu_name);
		var swf = document.getElementById("creative_menu_" + menu_name + "_swf");
	
		var maxw = (getPageWidth() > getWindowWidth()) ? getPageWidth() : getWindowWidth();
		var maxh = (getPageHeight() > getWindowHeight()) ? getPageHeight() : getWindowHeight();
		
		var w = width;
		if (menus_assoc[menu_name].fitToPage) {
			w = Number(div.style.width.replace('px',''));
		} else {
			if (getAbsX(div) + getScrollLeft() + w >= maxw) {
				w = maxw - getAbsX(div) - getScrollLeft() - scrollBarSize();
			}
		}
		if (w < menus_assoc[menu_name].width) w = menus_assoc[menu_name].width;
	
        var h = height;
        if (browser != "Opera") {
            if (Number(getAbsY(div)) - Number(getScrollTop()) + Number(h) >= Number(maxh)) {
                h = maxh - Number(getAbsY(div)) + Number(getScrollTop()) - 1;
            }
        }
        if (h < menus_assoc[menu_name].height) h = menus_assoc[menu_name].height;
		

		div.style.width = w + "px";
		div.style.height = h + "px";
	
		if (needHolderResize()) resizeHolder(menu_name);
	
		if (needSWFResize()) resizeSWF(menu_name);	
	//	alert(div.style.width + ' --- ' + div.style.height + ' --- ' + holder.style.width + ' --- ' + holder.style.height + ' --- ' + swf.width + ' --- ' + swf.height);
	}
	
	function resizeSWF(menu_name, need_refresh) {
		var div = menus_assoc[menu_name].div;
		var holder = menus_assoc[menu_name].holder;
		var swf = document.getElementById("creative_menu_" + menu_name + "_swf");
		
		var w = (menus_assoc[menu_name].fitToPage) ? Number(div.style.width.replace('px','')) + Math.abs(Number(holder.style.left.replace('px',''))) + getScrollLeft() : div.style.width.replace('px','');
		var h = div.style.height.replace('px','');
			
		swf.width = swf.height = 0;
		if (swf.setAttribute) {
			swf.setAttribute("width", w);
			swf.setAttribute("height", h);
		} else {
			swf.width = w;
			swf.height = h;
		}
	  
		if (need_refresh) {
			if (browser.indexOf("Firefox") == 0) {
				holder.style.height = (Number(swf.height) + Number(getScrollTop())) + "px";
						
				swf.width = "100%";
				swf.height = "100%";
			}
		}
	}
	
	function resizeHolder(menu_name) {
		var div = menus_assoc[menu_name].div;
		var holder = menus_assoc[menu_name].holder;
		
		holder.style.height = div.style.height;
		holder.style.width = (Number(div.style.width.replace('px','')) + Math.abs(Number(holder.style.left.replace('px',''))) + getScrollLeft()) + 'px';	
	}
	
	function needSWFResize() {
		if (browser == "Netscape") return true;
		
		if (browser.indexOf("Firefox") == 0) return true;
		
		if (os == "Mac") return true;
		
		return false;
	}
	
	function needHolderResize() {
		if (browser == "Netscape" || browser.indexOf("Firefox") == 0) return true;
		
		if (os == "Mac" && (browser == "Mozilla" || browser == "Safari" || browser == "Opera")) return true;
		
		return false;
	}
	
	function findChild(p,id,t) {
		if (p && p.childNodes) {
			var childs = p.childNodes;
			type = (t == undefined || t == "") ? "DIV" : t;
		for (var k=0; k < childs.length; k++) {
				if ((childs[k].id == id) && (childs[k].nodeName == type)) {
				return childs[k];
			}
		}
	}
	}
	
	//
	//  END -- HTML Elements manipulation functions
	//
	
	
	// 
	//  Functions used for getting browser information, screen information and element positions
	//
	
	function getBrowser() {
		var browserAgent = navigator.userAgent;
		//alert(browserAgent);
		var b = "Other";
			
		if (browserAgent.indexOf("Mozilla") == 0) b = "Mozilla";	
		if (browserAgent.indexOf("MSIE 6") != -1) b = "IE6";
		if (browserAgent.indexOf("MSIE 7") != -1) b = "IE7";
		if (browserAgent.indexOf("MSIE 8") != -1) b = "IE8";	
		if (browserAgent.indexOf("MSIE 9") != -1) b = "IE9";			
		if (browserAgent.indexOf("Opera") != -1) b = "Opera";
		if (browserAgent.indexOf("Firefox/1") != -1) b = "Firefox1";
		if (browserAgent.indexOf("Firefox/2") != -1) b = "Firefox2";
		if (browserAgent.indexOf("Firefox/3") != -1) b = "Firefox3";
		if (browserAgent.indexOf("Firefox/4") != -1) b = "Firefox4";		
		if (browserAgent.indexOf("Netscape") != -1) b = "Netscape";
		if (browserAgent.indexOf("Safari") != -1) b = "Safari";
		if (browserAgent.indexOf("Camino") != -1) b = "Camino";
			
		return b;
	}
	
	function getOS() {
		var browserAgent = navigator.userAgent;	
		var system = "Other";
		
		if (browserAgent.indexOf("Mac") != -1) system = "Mac";
		if (browserAgent.indexOf("Win") != -1) system = "Win";	
		
		return system;
	}
	
	function getY( oElement ){
		var iReturnValue = 0;
		while( oElement != null && !needRelPos(oElement)) {
			iReturnValue += oElement.offsetTop;
			oElement = oElement.offsetParent;
		}
		return iReturnValue;
	}
	
	function getX( oElement ){
		var iReturnValue = 0;
		while( oElement != null && !needRelPos(oElement)) {
			iReturnValue += oElement.offsetLeft;
			oElement = oElement.offsetParent;
		}
		return iReturnValue;
	}
	
	function getAbsX( oElement ){
		var iReturnValue = 0;
		while( oElement != null) {
			iReturnValue += oElement.offsetLeft;
			oElement = oElement.offsetParent;
		}
		return iReturnValue;
	}
	
	function getAbsY( oElement ){
		var iReturnValue = 0;
		while( oElement != null) {
			iReturnValue += oElement.offsetTop;
			oElement = oElement.offsetParent;
		}
		return iReturnValue;
	}
	
	function getAbsParentX(oElement) {
		var iReturnValue = 0;
		while( oElement != null) {
			if (needRelPos(oElement)) {
				iReturnValue += oElement.offsetLeft;
			}
			oElement = oElement.offsetParent;
		}
		return iReturnValue;
	}
	
	function getAbsParentY(oElement) {
		var iReturnValue = 0;
		while( oElement != null) {
			if (needRelPos(oElement)) {
				iReturnValue += oElement.offsetTop;
			}
			oElement = oElement.offsetParent;
		}
		return iReturnValue;
	}
	
	function needRelPos(el) {
		if (getStyle(el, "position") == "absolute" || getStyle(el, "position") == "fixed" || getStyle(el, "position") == "relative") return true;
	}
	
	function getWindowWidth() {
		var browser = getBrowser();
    if (browser == "Safari" || browser == "Firefox3") return window.innerWidth;
		if (browser == "Opera" || browser == "Other" || browser == "Mozilla") {
			return document.body.clientWidth;
		} else {
			return document.documentElement.clientWidth;
		}	
	}
	
	function getWindowHeight() {
		var browser = getBrowser();
    if (browser == "Safari" || browser == "Firefox3") return window.innerHeight;
		if (browser == "Opera" || browser == "Other" || browser == "Mozilla") {
			return document.body.clientHeight;
		} else {
			return document.documentElement.clientHeight;
		}
	}
	
	function getScreenWidth() {
		return window.screen.width;
	}
	
	function getScreenHeight() {
		return window.screen.height;
	}
	
	function getPageHeight() {
		document.body.offsetHeight;
	}
	
	function getPageWidth() {
		document.body.offsetWidth;
	}
	
	function getScrollLeft() {
		if (window.pageXOffset != undefined) {
			return window.pageXOffset;
		} else {
			return document.documentElement.scrollLeft;
		}
	}
	
	function getScrollTop() {
		if (window.pageYOffset != undefined) {
			return window.pageYOffset;
		} else {
			return document.documentElement.scrollTop;
		}	
	}
	
	function getStyle(el, sp) {
		if (el.currentStyle)
			var y = el.currentStyle[sp];
		else if (window.getComputedStyle)
			var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(sp);
		
		if (browser == "Safari" && os == "Mac") {
			var cssd = document.defaultView.getComputedStyle(el,null);
			var i = 79;
        
        return cssd[sp];
//		if (sp == "position") return cssd[i];
		}
		
		return y;	
	}
	
	// 
	//  END -- Functions used for getting browser information, screen information and element positions
	//
}

