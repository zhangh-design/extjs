var version = new Date();
$package = function(ns){
	var obj = {};
    var pkgs =ns.split(".");
    var root = pkgs[0];
	eval('if (typeof ' + root + ' == "undefined"){' + root + ' = {};} obj = ' + root + ';');
    for (var i = 1; i < pkgs.length; i ++) {
        var p  = pkgs[i];
        obj[p] = obj[p] || {};
        obj = obj[p];
    }
};

$package("ClassLoader");

ClassLoader.debug = true;
ClassLoader.autoloadAppScript = true;
ClassLoader.transportFactory =  [
						function() {return new ActiveXObject('Msxml2.XMLHTTP');}, 
						function() {return new ActiveXObject('Microsoft.XMLHTTP');}, 
						function() {return new XMLHttpRequest();}
      		           ];
ClassLoader.createNewTransport = function(){
	var factory =  ClassLoader.transportFactory;
	var transport = null;
	for(var i = 0, length = factory.length; i < length; i++) {
      var lambda = factory[i];
      try {
        transport = lambda();
        break;
      } 
      catch(e){}
    }
	return transport;
};
ClassLoader.isTop = function(){
	try{
		window.top.document;
		return true;
	}catch(error){}
	return false;
};
ClassLoader.transport = ClassLoader.createNewTransport.apply();
ClassLoader.emptyFunction = function(){};
ClassLoader.cacheScript = {};
ClassLoader.stylesheetRefCount = {};
ClassLoader.appRootOffsetPath = function(){
	var pathname = window.location.pathname;
	var fds = pathname.split("/");
	var tiers = fds.length - 3;
	var offset = "";
	for(var i = 0; i < tiers; i ++){
		offset += "../";
	}
	return offset;
	
}();
ClassLoader.stylesheetHome = ClassLoader.appRootOffsetPath;
ClassLoader.scriptHome = ClassLoader.appRootOffsetPath;
ClassLoader.eval = function(s){
	if(window.execScript){
		window.execScript(s);
	}
	else{
		window.eval(s);
	}
};

ClassLoader.markCache = function(clsName,file){
	if(ClassLoader.isTop()){
		top.ClassLoader.cacheScript[clsName] = file;
	}
	else{
		ClassLoader.cacheScript[clsName] = file;
	}
		
};
ClassLoader.clearCache = function(clsName){
	if(ClassLoader.isTop())
		delete top.ClassLoader.cacheScript[clsName];
	else
		delete ClassLoader.cacheScript[clsName];
};
ClassLoader.destory = function(clsName){
	try{
		ClassLoader.eval("delete " + clsName);
	}
	catch(e){
		if(ClassLoader.debug)
			alert("destory failed:" + e.toString());
	}	
	ClassLoader.clearCache(clsName);
};
ClassLoader.loadScriptSync = function(){
	if(arguments.length != 1){
		return;
	}
	var clsName = arguments[0];
	var file = ClassLoader.isTop()?top.ClassLoader.cacheScript[clsName]:ClassLoader.cacheScript[clsName];
	if(file){
		ClassLoader.eval(file);
		return;
	}
	var sender = ClassLoader.createNewTransport();
	var method = "GET";
	var url = clsName.replace(/[.]/ig,"/");
	sender.open(method , url + ".js?temp=" + version, false);	
	sender.setRequestHeader('encoding','utf-8');
	try{
		sender.send("");
	}
	catch(e){
		alert(e);
	}
	if(sender.readyState == 4){
		if(sender.status == 200){
			var file = sender.responseText;
			if(file.length == 0){
				return;
			}
			try{
				ClassLoader.eval(file);
				ClassLoader.markCache(clsName,file);
			}
			catch(e){
				alert(clsName + " script file error:\r" + e.name + ":\r" + e.message);
			}
		}
		else{
			if(ClassLoader.debug)
				alert(clsName + " class file load failed");
		}
		sender.abort();
	}
};
ClassLoader.loadStylesheet = function(id){
	if(ClassLoader.stylesheetRefCount[id]){
		var count = ClassLoader.stylesheetRefCount[id];
		ClassLoader.stylesheetRefCount[id] = ++ count;
		return
	}
	var ss = document.createElement("Link");
	ss.setAttribute("id", id);
	ss.setAttribute("href",id.replace(/[.]/gi,"/") + ".css");
	ss.setAttribute("rel","stylesheet");
	ss.setAttribute("type","text/css");
	document.getElementsByTagName("head")[0].appendChild(ss);
	ClassLoader.stylesheetRefCount[id] = 1;
};
ClassLoader.removeStylesheet = function(id){
	if(ClassLoader.stylesheetRefCount[id]){
		var count = -- ClassLoader.stylesheetRefCount[id];
		if(count > 0){
			ClassLoader.stylesheetRefCount[id] = count;
			return
		}
		delete ClassLoader.stylesheetRefCount[id];
		var existing = document.getElementById(id);
		if(existing){
			existing.parentNode.removeChild(existing);
		}
	}
};
ClassLoader.swapStylesheet = function(old,id){
	ClassLoader.removeStylesheet(old);
   	ClassLoader.loadStylesheet(id);
 };

$import  = ClassLoader.loadScriptSync;
$destory = ClassLoader.destory;
$styleSheet = ClassLoader.loadStylesheet;
$rStyleSheet = ClassLoader.removeStylesheet;