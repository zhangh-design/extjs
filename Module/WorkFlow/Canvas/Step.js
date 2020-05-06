Ext.ns("app.harmony.system.Module.WorkFlow.Canvas");
app.harmony.system.Module.WorkFlow.Canvas.Step = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.Canvas.Step.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Step,Ext.Panel,{
	WFID : '',
	x : 100,
	y : 100,
	width : 80,
	height : 56,
	floating: true,
	isStep : true,
	border : false,
	bodyStyle : 'background-color:transparent;padding:2px;',
	menu : null,
	subType : 1,//1 开始   2中间   3结束
	imgSrc : 'app/harmony/system/Module/WorkFlow/Canvas/images/step/',
	imgFile : '',//图片名
	moduleName : '未知',//模块名称
	moduleAttributes : null,//模块属性
	startLines : [],//起始线
	endLines : [],//终止线
	html : '',
	draggable : {
		insertProxy: false,
		onDrag : function(e){
			var pel = this.proxy.getEl();
			this.x = pel.getLeft(true)-app.harmony.system.Module.WorkFlow.Canvas.offset.x;
			this.y = pel.getTop(true)-app.harmony.system.Module.WorkFlow.Canvas.offset.y;
            var s = this.panel.getEl().shadow;
            if(s){
				s.realign(this.x, this.y, pel.getWidth(), pel.getHeight());
            }
            this.panel.moveOtherSelPanel(this.panel.x-this.x, this.panel.y-this.y);
         },
         endDrag : function(e){
         	this.panel.moveEndOtherSelPanel();
            this.panel.setPosition(this.x, this.y);
            this.panel.changeLinePoints(this.x, this.y);
         }
	},
	createMenuItem : function(){
		return [{text:'删除',scope:this,handler:this.removePanel},'-',{text:'更改图源',scope:this,handler:this.showImgWin}];
	},
	initMenu : function(){
		if(!Ext.isEmpty(this.menu))
			return this.menu;
		this.menu = new Ext.menu.Menu({
			items : this.createMenuItem()
		});
		return this.menu;
	},
	showContextMenu : function(){
		var point = [event.clientX,event.clientY];
   		this.initMenu().showAt(point);
   		return false;
	},
	setModuleAttributes : function(attributes){
		this.moduleAttributes = attributes;
		this.moduleName = attributes["modulename"]||this.moduleName;
		this.initHTML();
	},
	changeImage : function(img){
		this.imgFile = img;
		this.initHTML();
	},
	initHTML : function(){
		if(Ext.isEmpty(this.imgFile))
			this.imgFile = this.subType+".png";
		this.body.dom.innerHTML = '<div style="text-align:center;text-valign:middle;"><img style="width:36;height:36;" src="'+this.imgSrc+this.imgFile+'"/><br>'+this.moduleName+'</div>';
	},
	initContextMenu : function(){
		this.on("render",function(){
			this.initHTML();
			var panel = this;
			this.el.dom.oncontextmenu = function(e){
                window.event ? window.event.returnValue = panel.showContextMenu() : e.preventDefault();    
            };
            this.el.dom.ondblclick = function(){
            	panel.showAttributes();
            };
            this.el.dom.onmousedown = function(){
            	panel.mousedown();
            };
            this.el.dom.onclick = function(){
            	panel.click();
            };
		},this);
	},
	clearSelectColor : function(){
		if(this.body.dom)
			this.body.dom.style.setAttribute("border","0");
	},
	mousedown : function(){
		this.getBubbleTarget().clearSelect();
		this.body.dom.style.setAttribute("border","1px solid blue");
		this.getBubbleTarget().selectObject.push(this);
		this.getBubbleTarget().isWantClick = false;//终止点击事件
	},
	click : function(){
		if(this.getBubbleTarget().topToolbar.isDrawLine())
			this.addPoint();
	},
	addPoint : function(){
		var x2 = this.x+this.width/2;
		var y2 = this.y+this.height/2;
		var points = this.getBubbleTarget().linePoints;
		if(points.length==0){
			if(this.subType==3){
				alert("结束步骤不能作为开始对象!");
				this.getBubbleTarget().clearSelect();
				return;
			}
			points.push([x2,y2]);
			this.getBubbleTarget().beginPanel = this;
		}else{
			if(this.subType==1&&this.getBubbleTarget().topToolbar.selectBtn&&this.getBubbleTarget().topToolbar.selectBtn.btnid!='backline'){
				alert("开始步骤不能作为提交对象!");
				this.getBubbleTarget().clearSelect();
				return;
			}
			points.push([x2,y2]);
			this.getBubbleTarget().endPanel = this;
			this.getBubbleTarget().drawLine();
		}
	},
	changeLinePoints : function(){
		var x1 = this.x+this.width/2;
		var y1 = this.y+this.height/2;
		Ext.each(this.startLines,function(line){
			line.points[0] = [x1,y1];
			line.changePoints();
		},this);
		Ext.each(this.endLines,function(line){
			line.points[line.points.length-1] = [x1,y1];
			line.changePoints();
		},this);
		this.getBubbleTarget().isWantClick = true;
	},
	showAttributes : function(){
		if(this.subType==3)
			return;
		var cfg = {
			WFID : this.WFID,
			moduleAttributes : this.moduleAttributes,
			modulePanle : this
		}
		$import('app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleAttributes');
		new app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleAttributes(cfg).show();
	},
	showImgWin : function(){
		var cfg = {
			modulePanle : this
		}
		$import('app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleImg');
		new app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleImg(cfg).show();
	},
	removeSelf : function(){
		for(var i=this.startLines.length-1;i>=0;i--){
			this.startLines[i].removeAll();
		}
		for(var j=this.endLines.length-1;j>=0;j--){
			this.endLines[j].removeAll();
		}
		this.getBubbleTarget().remove(this);
	},
	removePanel : function(){
		Ext.Msg.confirm("提示","确定删除当前选择模块吗?",function(btn){
			if(btn=='yes'){
				this.getBubbleTarget().selectObject = [];
				this.removeSelf();
			}
		},this);
	},
	getChangePosition : function(x1,y1,x2,y2){
		var tga;
		if (x1 != x2)
			tga = (y1 - y2)/(x1 - x2);
		else
			tga = 10000;
		if (Math.abs(tga) >= (this.height/this.width*2))//交接点
		{
			if (y1 > y2){
				y = parseInt(y2) + (this.height/2);
			}
			else{
				y = parseInt(y2) - (this.height/2);
			}
			if (x1 == x2){
				x = x1;
			}
			else{
				x = x2 + (y - y2)/tga;
			}
		}
		else
		{
			if (x1 > x2){
				x = parseInt(x2) + (this.width/2);
			}
			else{
				x = parseInt(x2) - (this.width/2);
			}
			y = y2 + (x - x2) * tga;
		}
		return [x,y];
	},
	moveOtherSelPanel : function(x,y){
		Ext.each(this.getBubbleTarget().selectObject,function(obj){
			if(obj.id!=this.id){
				obj.oldX = obj.oldX||obj.x;
				obj.oldY = obj.oldY||obj.y;
				obj.setPosition(obj.oldX-x, obj.oldY-y);
			}
		},this);
	},
	moveEndOtherSelPanel : function(){
		Ext.each(this.getBubbleTarget().selectObject,function(obj){
			obj.oldX = null;
			obj.oldY = null;
		},this);
	},
	initComponent : function(){
		app.harmony.system.Module.WorkFlow.Canvas.Step.superclass.initComponent.call(this);
		this.initContextMenu();
	},
	getInnerHTML : function(){
		var lines = [];
		Ext.each(this.startLines,function(l){
			lines.push(l.getInnerHTML());
		},this);
		var cfg = {
			subType : this.subType,
			moduleName : this.moduleName,
			x : this.x,
			y : this.y,
			id : this.id,
			WFID : this.WFID,
			moduleAttributes : Ext.encode(this.moduleAttributes),
			lines : Ext.encode(lines),
			imgFile : this.imgFile,
			html : this.html
		};
		return Ext.encode(cfg);
	}
});