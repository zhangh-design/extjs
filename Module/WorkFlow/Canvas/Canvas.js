Ext.ns("app.harmony.system.Module.WorkFlow.Canvas");
$import("app.harmony.system.Module.WorkFlow.Canvas.CanvasTBar");
$import("app.harmony.system.Module.WorkFlow.Canvas.Step");
$import("app.harmony.system.Module.WorkFlow.Canvas.Line");
var canvas;
app.harmony.system.Module.WorkFlow.Canvas.offset={
	x : 202,//坐标偏差x
	y : 29  //坐标偏差y
};
app.harmony.system.Module.WorkFlow.Canvas.Canvas = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.Canvas.Canvas.superclass.constructor.call(this, config);
	document.oncontextmenu = function(){window.event.returnValue=false;};
	canvas = this;
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Canvas,Ext.Panel,{
	selectObject : [],//当前选中的对象
	WFID : '123456',
	isWantClick : true,
	linePoints : [],
	beginPanel : null,//开始模块
	endPanel : null,//结束模块
	connURL : 'WorkFlow/WFGraph.do',
	bodyStyle:'background:url(app/harmony/system/Module/WorkFlow/Canvas/images/wg.png);',
	loadMask : new Ext.LoadMask(document.body,{msg:'正在加载图形,请稍候....',removeMask : true}),
	loadGraph : function(WFID){
		this.WFID = WFID;
		this.topToolbar.WFID = WFID;
		this.topToolbar.showAllBtn(true);
		this.loadMask.show();
		Ext.Ajax.request({
			url: this.connURL,  
		 	params:{object:'getGraph',wfid:WFID,token:token},//设置参数
		 	scope : this,
		 	callback:function(o,s, resp){
		 		if(ajaxRequestFailure(resp.statusText))//判断ajax调用是否失败
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			this.initGraph(respText.data);
		 		}else{
		 			alert(respText.error);
		 		}
		 		this.loadMask.hide();
		 	}
		});
	},
	initGraph : function(data){
		this.clearGraph();
		if(Ext.isEmpty(data))
			return;
		$import("app.harmony.system.Module.WorkFlow.Canvas.Base64");
		var data = app.harmony.system.Module.WorkFlow.Canvas.Base64.decode(data);
		var json = Ext.decode(data);
		var modules = json.modules;
		this.initAllStep(modules);
		this.initAllStepLine(modules);
	},
	initAllStep : function(modules){
		Ext.each(modules,function(module){
			var cfg = Ext.decode(module);
			Ext.apply(cfg,{startLines:[],endLines:[],moduleAttributes:Ext.decode(cfg.moduleAttributes)});
			var panel = new app.harmony.system.Module.WorkFlow.Canvas.Step(cfg);
			this.add(panel);
			this.doLayout();
			var num = cfg.id - (""+this.WFID*1000000000).substring(0,11)*1;
			if(this.topToolbar.imageNumber<=num)
				this.topToolbar.imageNumber = num+1;
		},this);
	},
	initAllStepLine : function(modules){
		Ext.each(modules,function(module){
			step = Ext.decode(module);
			var lines = Ext.decode(step.lines);
			Ext.each(lines,function(line){
				var cfgLine = Ext.decode(line);
				Ext.apply(cfgLine,{canvas:this,Remark:null,points:Ext.decode(cfgLine.points),lines:[],WFID:this.WFID});
				if(!Ext.isEmpty(cfgLine.startCondition))
					Ext.apply(cfgLine,{startCondition:Ext.decode(cfgLine.startCondition)})
				var line = new app.harmony.system.Module.WorkFlow.Canvas.Line(cfgLine);
				line.drawLine();
				this.compareStep(step.id,line,'start');
				this.compareStep(line.endPanel,line,'end');
				if(!Ext.isEmpty(line.remarkPoint))
					line.createRemarkPoint(Ext.decode(line.remarkPoint));
			},this);
		},this);
	},
	compareStep : function(id,line,type){
		var step = Ext.getCmp(id);
		if(Ext.isEmpty(step))
			return;
		if(type=='start'){
			step.startLines.push(line);
			line.beginPanel = step;
		}else{
			step.endLines.push(line);
			line.endPanel = step;
		}
	},
	clearGraph : function(){
		this.topToolbar.clearSelectBtn();
		this.selectObject = [];
		this.body.dom.innerHTML = "";
		this.removeAll();
	},
	initTBar : function(){
		this.tbar = new app.harmony.system.Module.WorkFlow.Canvas.CanvasTBar({connURL:this.connURL});
	},
	initComponent : function(){
		this.initTBar();
		app.harmony.system.Module.WorkFlow.Canvas.Canvas.superclass.initComponent.call(this);
		this.on("render",function(){
			var panel = this;
			this.body.dom.onclick = function(){
            	panel.click();
            };
            this.body.dom.ondblclick = function(){
            	panel.ondblclick();
            };
		},this);
	},
	keys : [
		{
			key : Ext.EventObject.DELETE,
			fn : function(){this.canvas.deleteEnter()},
			scope : this
		}
		
	],
	click : function(){
		if(!this.isWantClick){
			this.isWantClick = true;
			return;
		}
		if(this.topToolbar.isDrawModule()){
			this.drawImage();
			this.topToolbar.clearSelectBtn();
		}
		if(this.topToolbar.isDrawLine()){
			this.drawLinePoint();
		}
		this.clearSelect();
	},
	ondblclick : function(){
		
	},
	isHasEndModule : function(cfg){
		if(cfg.subType!=3)
			return false;
		var hasEnd = false;
		Ext.each(this.items.items,function(item){
			if(item.subType==3){
				hasEnd = true;
				return;
			}
		},this);
		return hasEnd;
	},
	drawImage : function(){
		var cfg = this.topToolbar.getImageAttributes();
		//不能存在2个结束
		if(this.isHasEndModule(cfg)){
			alert("已经存在结束步骤,不能再添加!");
			return;
		}
		var panel = new app.harmony.system.Module.WorkFlow.Canvas.Step(cfg);
		this.add(panel);
		this.doLayout();
	},
	drawLinePoint : function(){
		if(this.linePoints.length<1)
			return;
		var x = event.clientX-app.harmony.system.Module.WorkFlow.Canvas.offset.x;
		var y = event.clientY-app.harmony.system.Module.WorkFlow.Canvas.offset.y;
		this.linePoints.push([x,y]);
	},
	drawLine : function(){
		var cfg = {
			points : this.linePoints,
			canvas : this,
			lineType : this.topToolbar.getLineType(),
			lines : [],
			beginPanel : this.beginPanel,
			endPanel : this.endPanel
		};
		if(this.isHasStepLine()){
			alert("已经存在该线,不允许再添加!");
			this.linePoints = [];//清空
			this.clearSelect();
			return;
		}
		var line = new app.harmony.system.Module.WorkFlow.Canvas.Line(cfg);
		this.beginPanel.startLines.push(line);
		this.endPanel.endLines.push(line);
		line.changePoints();
		this.topToolbar.clearSelectBtn();
		this.linePoints = [];//清空
	},
	isHasStepLine : function(){
		var has = false;
		Ext.each(this.beginPanel.startLines,function(line){
			if(this.endPanel.id==line.endPanel.id){
				has = true;
				return;
			}
		},this);
		return has;
	},
	isDownCtrl : function(){
		return window.event.ctrlKey;
	},
	deleteEnter : function(){
		Ext.Msg.confirm("提示","确定删除当前选择模块吗?",function(btn){
			if(btn=='yes'){
				Ext.each(this.selectObject,function(obj){
					obj.removeSelf();
				},this);
				this.selectObject = [];
			}
		},this);
	},
	clearSelect : function(){
		if(!this.isDownCtrl()){
			Ext.each(this.selectObject,function(obj){
				obj.clearSelectColor();
			},this);
			this.selectObject = [];
		}
	}
});