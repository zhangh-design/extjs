Ext.ns("app.harmony.system.Module.WorkFlow.Canvas");
$import("app.harmony.system.Module.WorkFlow.Canvas.Point");
$import("app.harmony.system.Module.WorkFlow.Canvas.Remark");
app.harmony.system.Module.WorkFlow.Canvas.Line = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.Canvas.Line.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Line,Ext.util.Observable,{
	WFID : '123',//流程ID
	sectionNumber : 1,//分段数
	lineNumber : 1,//线数量
	points : null,//坐标点   数组
	color : 'blue',//线颜色
	lineType : 1,//线属性   0下一步虚线   1下一步实线   9退回线
	canvas : null,//画布
	beginPanel : null,//开始模块
	endPanel : null,//结束模块
	startCondition : null,//启动条件 object
	filterDeptID : '',//过滤部门ID
	filterDeptName : '默认',//过滤部门名称
	menu : null,//菜单按钮
	selectColor : 'green',//选中行的颜色
	Remark : null,//备注信息
	isHiddenRemark : false,
	lines : [],
	linePoint : [],
	setFilterDept : function(dept){
		this.filterDeptID = dept.rid;
		this.filterDeptName = dept.name;
		this.createRemarkPoint({filterDept:dept.name});
	},
	setStartCondition : function(start){
		this.startCondition = start;
		this.createRemarkPoint({startCond:start.remark});
	},
	clearStartCondition : function(){
		this.startCondition = null;
		this.createRemarkPoint({startCond:'无'});
	},
	getLineID : function(){
		var id = (""+this.WFID*100000000).substring(0,10)+this.lineNumber+'-'+this.sectionNumber;
		return id;
	},
	createLine : function(){
		var panel = this;
		var line = document.createElement("v:line");
  		line.style.position = "absolute";
  		line.strokecolor = this.lineType==9?"red":this.color;
  		line.strokeweight = "1";
  		line.id = this.getLineID();
  		line.oncontextmenu = function(){panel.showLineMenu()};
  		line.onmousedown = function(){panel.lineMouseDown()};
  		this.sectionNumber ++;
  		return line;
	},
	changePoints : function(){
		this.removeSelf(true);
		this.lines = [];
		var x0 = this.beginPanel.x+this.beginPanel.getWidth()/2;
		var y0 = this.beginPanel.y+this.beginPanel.getHeight()/2;
		var x1 = this.endPanel.x+this.endPanel.getWidth()/2;
		var y1 = this.endPanel.y+this.endPanel.getHeight()/2;
		this.points[this.points.length-1] = this.endPanel.getChangePosition(this.points[this.points.length-2][0],this.points[this.points.length-2][1],x1,y1);
		this.points[0] = this.beginPanel.getChangePosition(this.points[1][0],this.points[1][1],x0,y0);
		this.drawLine();
	},
	drawLine : function(){
		if(Ext.isEmpty(this.points))
			return;
		for(var i=1;i<this.points.length;i++){
			var line = this.createLine();
			this.canvas.body.dom.appendChild(line);
			this.lines.push(line);
			if(i==this.points.length-1){//在最后的2点上画箭头
				if(this.lineType==0){//表示可选择的下一步  画虚线
					line.insertBefore(document.createElement("<v:stroke  EndArrow=\"classic\" dashstyle=\"Dot\"/>"));
				}else
					line.insertBefore(document.createElement("<v:stroke  EndArrow=\"classic\"/>"));
			}else{
				if(this.lineType==0){//表示可选择的下一步  画虚线
					line.insertBefore(document.createElement("<v:stroke dashstyle=\"Dot\"/>"));
				}
			}
			line.from=parseInt(this.points[i-1][0])+","+parseInt(this.points[i-1][1]);
			line.to=parseInt(this.points[i][0])+","+parseInt(this.points[i][1]);
		}
	},
	createMenuItem : function(){
		var item = [{text:'删除',scope:this,handler:this.removeLine},'-',
			{text:'过滤部门',scope:this,handler:this.showFilter,
				menu:[{text:'显/隐',scope:this,handler:this.showRemarkPoint}]}];
		if(this.lineType!=1){
			item.push('-');
			item.push({text:'启动条件',scope:this,handler:this.showStartCond});
		}
		return item;
	},
	initMenu : function(){
		if(!Ext.isEmpty(this.menu))
			return this.menu;
		this.menu = new Ext.menu.Menu({
			items : this.createMenuItem()
		});
		return this.menu;
	},
	showLineMenu : function(){
		var point = [event.clientX,event.clientY];
   		this.initMenu().showAt(point);
   		return false;
	},
	removeLinePoint : function(){
		Ext.each(this.linePoint,function(point){
			this.canvas.remove(point);
		},this);
		this.linePoint = [];
	},
	clearSelectColor : function(){
		this.changeLineColor(this.lineType==9?"red":this.color);
		this.removeLinePoint();
	},
	lineMouseDown : function(){
		this.canvas.isWantClick = false;//终止点击事件
		this.canvas.clearSelect();
		this.changeLineColor(this.selectColor);
		this.canvas.selectObject.push(this);
		this.createPoint();
	},
	createPoint : function(){
		Ext.each(this.points,function(point,index){
			if(index>0&&index<this.points.length-1){
				var cfg = {
					line : this,
					number : index,
					x : point[0],
					y : point[1],
					canvas : this.canvas
				};
				var p = new app.harmony.system.Module.WorkFlow.Canvas.Point(cfg);
				this.linePoint.push(p);
			}
		},this);
	},
	changeLineColor : function(color){
		Ext.each(this.lines,function(line){
			line.strokecolor = color;
		},this);
	},
	removeAll : function(){
		this.beginPanel.startLines.remove(this);
		this.endPanel.endLines.remove(this);
		this.removeSelf();
		if(this.Remark)
			this.canvas.remove(this.Remark);
	},
	removeSelf : function(isSelect){
		if(!isSelect)
			this.canvas.selectObject = null;
		Ext.each(this.lines,function(line){
			this.canvas.body.dom.removeChild(line);
		},this);
		this.removeLinePoint();
	},
	removeLine : function(){
		Ext.Msg.confirm("提示","确定删除当前选择的线吗?",function(btn){
			if(btn=='yes')
				this.removeAll();
		},this);
	},
	createRemarkPoint : function(config){
		if(this.Remark){
			return;
		}
		var cfg = {
			canvas : this.canvas,
			x : (this.points[1][0]-this.points[0][0])/2+this.points[0][0],//取第1-2点中间的位置x
			y : (this.points[1][1]-this.points[0][1])/2+this.points[0][1]//取第1-2点中间的位置y
		};
		if(config)
			Ext.apply(cfg,config);
		this.Remark = new app.harmony.system.Module.WorkFlow.Canvas.Remark(cfg);
		this.canvas.add(this.Remark);
		if(this.isHiddenRemark)
			this.Remark.setVisible(false);
	},
	showRemarkPoint : function(){
		if(this.Remark){
			this.Remark.setVisible(!this.Remark.isVisible());
			this.Remark.setPosition(this.Remark.x,this.Remark.y);
			this.isHiddenRemark = !this.Remark.isVisible();
			return;
		}
		if(Ext.isEmpty(this.filterDeptName))
			return;
		this.isHiddenRemark = false;
		this.createRemarkPoint()
	},
	showFilter : function(){
		$import("app.harmony.system.Module.WorkFlow.Canvas.Detail.LineFilterDept");
		var cfg = {
			filterDept : {rid:this.filterDeptID,name:this.filterDeptName},
			line : this
		};
		new app.harmony.system.Module.WorkFlow.Canvas.Detail.LineFilterDept(cfg).show();
	},
	showStartCond : function(){
		$import("app.harmony.system.Module.WorkFlow.Canvas.Detail.LineStartCond");
		var cfg = {
			startCondition : this.startCondition,
			line : this
		};
		new app.harmony.system.Module.WorkFlow.Canvas.Detail.LineStartCond(cfg).show();
	},
	getInnerHTML : function(){
		var cfg = {
			points : Ext.encode(this.points),
			lineType : this.lineType,
			WFID : this.WFID,
			filterDeptID : this.filterDeptID,
			filterDeptName : this.filterDeptName,
			startCondition : Ext.isEmpty(this.startCondition)?'':Ext.encode(this.startCondition),
			isHiddenRemark : this.isHiddenRemark,
			remarkPoint : this.Remark?Ext.encode(this.Remark.getInnerHTML()):'',
			endPanel : this.endPanel.id
		};
		return Ext.encode(cfg);
	}
});