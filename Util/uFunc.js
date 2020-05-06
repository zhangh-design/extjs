function SD(rid,args){//args  json格式
	this.arguments = args;
	$import("app.ext3-2.script.miframe");
	var url = "../ShowReport.jsp?load=1&token="+parent.token+"&moduleID="+parent.moduleID+"&rid="+rid;
	var detailPanel = new Ext.Panel({
		border : false,
		region : 'center',
		layout : 'fit',
		body : new Ext.ux.ManagedIFrame({
            autoCreate:{
                xtype : "panel",
        		src : url,                        
                frameBorder : 0,
                autoScroll : false
            }
        })
	});
	var win = new Ext.Window({
		title : '报表清单',
		layout : 'border',
		maximizable : true,
		width : Ext.getBody().dom.scrollWidth-50,
		height : Ext.getBody().dom.scrollHeight-200,
		items : [detailPanel]
	});
	win.show();
}
function ajaxRequestFailure(statusText){
	if(statusText=="communication failure"){
		alert("后台无响应......");
		return true;
	}
	return false;
}
function getProgressValue(key,runner){
	Ext.Ajax.request({ 
	 	url: "util/LoadMask.do",  
	 	params:{object:"getValue",token:token,key:key},
	 	scope : this,
	 	callback:function(o,s, resp){
	 		if(ajaxRequestFailure(resp.statusText))
	 			return;
	 		var respText = Ext.util.JSON.decode(resp.responseText);
	 		var value = respText.dataID;
	 		var message = respText.data;
	 		var j = value/100;
			if(value == 100){
				Ext.MessageBox.updateProgress(1,'所有数据加载完成!');
				Ext.MessageBox.hide();
				runner.stopAll()
			}else{
				Ext.MessageBox.updateProgress(j, Math.round(100*j)+'% 已完成。'+message);
			}
	 	}
	});
}
function showProgress(text){
	var key = Math.random();    
	Ext.MessageBox.show({
		title: '提示',		
		msg: text||'正在加载数据...',
		progressText: '正在初始化...',
		width:300,
		value : 0,
		progress:true, //此属性证明这是一个进度条
		closable:false
	});
	var runner = new Ext.util.TaskRunner();
	var task = {
		run : function(){getProgressValue(key,runner)},
		interval : 50
	};
	runner.start(task);
	return key;
}
function getFormatDate(value,format){
	if(value==""||value==null)
		return "";
	if(typeof value == "object"){
		return Ext.util.Format.date(value, format);
	}
	var length = value.length;
	var yyyy = value.substring(0,4);
	var mm = value.substring(5,7);
	var dd = value.substring(8,10);
	var hh,mi,ss;
	if(length>11){
		hh = value.substring(11,13);
		mi = value.substring(14,16);
		ss = value.substring(17,19);
	}
	format = format.toLowerCase();
	format = format.replace('y',yyyy).replace('m',mm).replace("d",dd).replace("h",hh).replace("i",mi).replace("s",ss);
	return format;
}
var topWindow;
function getTop(){
	if(topWindow==null){
		try{
			topWindow = this;
		}catch(error){topWindow=this;}
	}
	return topWindow;
}
function getViewTableValues(value,view,child){
	if(!getTop()['viewMap']){
		getTop()['viewMap'] = {};
	}
	
	if(getTop()['viewMap'][view]==null){
		Ext.Ajax.request({    
		 	url: "./PublicComboBox.do?",  
		 	async : false,
		 	params:{object:"select",token:token,tableName:view},
		 	scope : this,
		 	callback:function(o,s, resp){
		 		if(ajaxRequestFailure(resp.statusText))
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.root){
		 			getTop().viewMap[view] = respText.root;
		 		}
		 	}
		});
	}
	var sRet = "";
	var map = getTop().viewMap[view];
	var has = false;
	Ext.each(map,function(obj){
		if(obj['rid']==value){
			sRet = obj['name'];
			return;
		}
	},this);
	return sRet;
}
/*********************************************************
        屏蔽退回键
**********************************************************/
document.onkeydown=function(e){
    if(event.keyCode==8){
    	if(event.srcElement){
    		if(!event.srcElement.isContentEditable)
		    	return false;
    	}else{
    		return false;
    	}
    }
}
/*********************************************************
        最大化页面
**********************************************************/
function maxedPage()
{
   ReSizePage(screen.availWidth, screen.availHeight);
}

/*********************************************************
        调整页面到指定的宽度、高度，居中显示
**********************************************************/
function ReSizePage(width, height)
{
   var aw = screen.availWidth; 
   var ah = screen.availHeight; 
	var xc = (aw - width) / 2; 
	var yc = (ah - height) / 2;
    self.moveTo(xc, yc);
	self.resizeTo(width, height);
	    
}

/*********************************************************
        页面onload()事件  用于非流程的页面
**********************************************************/
function doLoad(){
	
}

/*********************************************************
        页面onload()事件  用于流程的页面
**********************************************************/
function doWFLoad(){
	
}
function setFormValue(node,scope,fieldname,nodeid){
	var form ;
	var target = "this.getBubbleTarget()";
	for(i=0;i<9;i++){
		form = eval(target+".getBubbleTarget()");
		if(form.getForm)
			break;
	}
	var sRID = node[0].json[nodeid];
	form.getForm().findField(fieldname).setValue(sRID);
}