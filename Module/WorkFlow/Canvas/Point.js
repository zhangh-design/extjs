Ext.ns("app.harmony.system.Module.WorkFlow.Canvas");
app.harmony.system.Module.WorkFlow.Canvas.Point = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.Canvas.Point.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Point,Ext.Panel,{
	line : null,
	floating: true,
	width : 5,
	height : 5,
	number : 0,
	canvas : null,
	bodyStyle : 'background-color:blue;',
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
         },
         endDrag : function(e){
            this.panel.setPosition(this.x, this.y);
            this.panel.changeLinePoints(this.x, this.y);
         }
	},
	changeLinePoints : function(x,y){
		this.line.points[this.number] = [x,y];
		this.line.changePoints();
	},
	mousedown : function(){
		this.canvas.isWantClick = false;//终止点击事件
	},
	initComponent : function(){
		app.harmony.system.Module.WorkFlow.Canvas.Point.superclass.initComponent.call(this);
		this.canvas.add(this);
		this.canvas.doLayout();
		this.on("render",function(){
			var panel = this;
            this.el.dom.onmousedown = function(){
            	panel.mousedown();
            };
		},this);
	}
});