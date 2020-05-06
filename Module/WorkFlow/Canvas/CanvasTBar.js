Ext.ns("app.harmony.system.Module.WorkFlow.Canvas");
$styleSheet("app.harmony.system.Module.WorkFlow.Canvas.images.WFBtn");
app.harmony.system.Module.WorkFlow.Canvas.CanvasTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.Canvas.CanvasTBar.superclass.constructor.call(this, config);
	Ext.QuickTips.init();
}
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.CanvasTBar,Ext.Toolbar,{
	imageNumber : 1,
	lineNumber : 1,
	WFID : '',
	selectBtn : null,
	connURL : '',
	initBtn : function(){
		this.add({text:'选择',iconCls:'wf_select',btnid:'select',scope:this,handler:this.btnSelect});
		this.add('-');
		this.add({text:'开始',iconCls:'wf_start',btnid:'begin',scope:this,handler:this.btnSelect});
		this.add('-');
		this.add({text:'中间步骤',iconCls:'wf_middle',btnid:'process',scope:this,handler:this.btnSelect});
		this.add('-');
		this.add({text:'结束',iconCls:'wf_finish',btnid:'end',scope:this,handler:this.btnSelect});
		this.add('-');
		this.add({text:'实线',iconCls:'wf_fullline',btnid:'fullline',scope:this,handler:this.btnSelect});
		this.add('-');
		this.add({text:'虚线',iconCls:'wf_dotline',btnid:'dottedline',scope:this,handler:this.btnSelect});
		this.add('-');
		this.add({text:'退回',iconCls:'wf_back',btnid:'backline',scope:this,handler:this.btnSelect});
		this.add('->');
		this.add({text:'保存',iconCls:'wf_save',btnid:'save',scope:this,handler:this.btnSave});
		this.add('-');
		this.add({text:'删除',iconCls:'wf_delete',btnid:'delete',scope:this,handler:this.btnDelete});
		this.add('-');
		this.add({text:'导入',iconCls:'wf_import',btnid:'import'});
		this.add('-');
		this.add({text:'导出',iconCls:'wf_export',btnid:'export'});
		this.add('-');
		this.add({text:'启用',iconCls:'wf_restart',btnid:'run',scope:this,handler:this.btnImport});
		this.add('-');
		this.add({text:'覆盖',iconCls:'wf_cover',btnid:'cover',scope:this,handler:this.btnImport});
		this.add('-');
		this.add({text:'调整图形',iconCls:'wf_change',btnid:'change',
					menu:[{
							text:'等高',scope:this,handler:this.sameHeight
						},'-',{
							text:'等宽',scope:this,handler:this.sameWidth
						},'-',{
							text:'线调整',scope:this,handler:this.lineChange
						}]
				});
	},
	getImageAttributes : function(){
		var subType = 1;
		var moduleName = "开始";
		if(this.selectBtn.btnid=='process'){
			subType = 2;
			moduleName = "中间步骤";
		}else if(this.selectBtn.btnid=='end'){
			subType = 3;
			moduleName = "结束";
		}
		var id = (""+this.WFID*1000000000).substring(0,10)+this.imageNumber;
		var cfg = {
			subType : subType,
			moduleName : moduleName,
			x : event.clientX-app.harmony.system.Module.WorkFlow.Canvas.offset.x-40,
			y : event.clientY-app.harmony.system.Module.WorkFlow.Canvas.offset.y-40,
			id : id,
			WFID : this.WFID,
			startLines : [],
			endLines : []
		};
		this.imageNumber ++;
		return cfg;
	},
	isDrawLine : function(){
		if(Ext.isEmpty(this.selectBtn))
			return false;
		return this.selectBtn.btnid=='fullline'||this.selectBtn.btnid=='dottedline'||this.selectBtn.btnid=='backline';
	},
	isDrawModule : function(){
		if(Ext.isEmpty(this.selectBtn))
			return false;
		return this.selectBtn.btnid=='begin'||this.selectBtn.btnid=='process'||this.selectBtn.btnid=='end';
	},
	getLineType : function(){
		if(this.selectBtn.btnid=='fullline')
			return 1;
		if(this.selectBtn.btnid=='dottedline')
			return 0;
		if(this.selectBtn.btnid=='backline')
			return 9;
	},
	clearSelectBtn : function(){
		if(!Ext.isEmpty(this.selectBtn)){
			this.selectBtn.removeClass("x-btn-pressed");
			this.selectBtn = null;
		}
	},
	btnSelect : function(btn){
		this.clearSelectBtn();
		btn.addClass("x-btn-pressed");
		this.selectBtn = btn;
		this.getBubbleTarget().clearSelect();
	},
	showAllBtn : function(show){
		Ext.each(this.items.items,function(btn){
			if(btn.btnid)
				btn.setDisabled(!show);
		},this);
	},
	initComponent : function(){
		app.harmony.system.Module.WorkFlow.Canvas.CanvasTBar.superclass.initComponent.call(this);
		this.initBtn();
		this.showAllBtn(false);
	},
	btnSave : function(){
		var graph = new Object();
		graph.wfid = this.WFID;
		graph.modules = [];
		Ext.each(this.getBubbleTarget().items.items,function(item){
			if(item.isStep)
				graph.modules.push(item.getInnerHTML());
		},this);
		$import("app.harmony.system.Module.WorkFlow.Canvas.Base64");
		Ext.Ajax.request({
			url: this.connURL,  
		 	params:{object:'saveGraph',html:app.harmony.system.Module.WorkFlow.Canvas.Base64.encode(Ext.encode(graph)),token:token},//设置参数
		 	scope : this,
		 	callback:function(o,s, resp){
		 		if(ajaxRequestFailure(resp.statusText))//判断ajax调用是否失败
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			alert(respText.data);
		 		}else{
		 			alert(respText.error);
		 		}
		 	}
		});
	},
	btnImport : function(btn){
		Ext.Msg.confirm("提示","确定"+btn.text+"当前工作流图形?",function(b){
			if(b!='yes')
				return;
			var graph = new Object();
			graph.wfid = this.WFID;
			graph.modules = [];
			Ext.each(this.getBubbleTarget().items.items,function(item){
				if(item.isStep)
					graph.modules.push(item.getInnerHTML());
			},this);
			$import("app.harmony.system.Module.WorkFlow.Canvas.Base64");
			Ext.Ajax.request({
				url: this.connURL,  
			 	params:{object:'importGraph',html:app.harmony.system.Module.WorkFlow.Canvas.Base64.encode(Ext.encode(graph)),token:token,action:btn.text=='覆盖'?'replace':'insert'},//设置参数
			 	scope : this,
			 	callback:function(o,s, resp){
			 		if(ajaxRequestFailure(resp.statusText))//判断ajax调用是否失败
			 			return;
			 		var respText = Ext.util.JSON.decode(resp.responseText);
			 		if(respText.success){
			 			alert(respText.data);
			 		}else{
			 			alert(respText.error);
			 		}
			 	}
			});
		},this);
	},
	btnDelete : function(){
		Ext.Msg.confirm("提示","确定删除当前工作流图形?",function(btn){
			if(btn!='yes')
				return;
			Ext.Ajax.request({
				url: this.connURL,  
			 	params:{object:'deleteGraph',wfid:this.WFID,token:token},//设置参数
			 	scope : this,
			 	callback:function(o,s, resp){
			 		if(ajaxRequestFailure(resp.statusText))//判断ajax调用是否失败
			 			return;
			 		var respText = Ext.util.JSON.decode(resp.responseText);
			 		if(respText.success){
			 			alert('删除成功');
			 			this.getBubbleTarget().clearGraph();
			 		}else{
			 			alert(respText.error);
			 		}
			 	}
			});
		},this);
	},
	lineChange : function(){
		if(this.getBubbleTarget().selectObject.length!=1)
			return;
		if(Ext.isEmpty(this.getBubbleTarget().selectObject[0].lineType))
			return;
		var points = this.getBubbleTarget().selectObject[0].points;
		var changePoints = [];
		Ext.each(points,function(p,i){
			if(i!=0&&i!=points.length){
				if(i%2!=0){
					p = [points[i-1][0],p[1]];
				}
				else{
					p = [p[0],points[i-1][1]];
				}
			}
			changePoints.push(p);
		},this);
		this.getBubbleTarget().selectObject[0].points = changePoints;
		this.getBubbleTarget().selectObject[0].changePoints();
	},
	sameWidth : function(){
		if(this.getBubbleTarget().selectObject.length<2)
			return;
		var x = this.getBubbleTarget().selectObject[0].x;
		Ext.each(this.getBubbleTarget().selectObject,function(obj){
			obj.setPosition(x,obj.y);
			obj.changeLinePoints();
		},this);
	},
	sameHeight : function(){
		if(this.getBubbleTarget().selectObject.length<2)
			return;
		var y = this.getBubbleTarget().selectObject[0].y;
		Ext.each(this.getBubbleTarget().selectObject,function(obj){
			obj.setPosition(obj.x,y);
			obj.changeLinePoints();
		},this);
	}
});