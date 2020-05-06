Ext.ns("app.harmony.system.Module.WorkFlow.Canvas");
app.harmony.system.Module.WorkFlow.Canvas.Remark = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.Canvas.Remark.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Remark,Ext.Panel,{
	line : null,
	floating: true,
	width : 100,
	height : 35,
	canvas : null,
	x : 10,
	y : 10,
	bodyStyle : 'background-color:green;',
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
         },
         endDrag : function(e){
            this.panel.setPosition(this.x, this.y);
         }
	},
	initComponent : function(){
		var wantRefresh = Ext.isEmpty(this.html);
		app.harmony.system.Module.WorkFlow.Canvas.Point.superclass.initComponent.call(this);
		this.on("render",function(){
			var panel = this;
            this.el.dom.ondblclick = function(){
            	panel.showAttributes();
            };
		},this);
		this.canvas.add(this);
		this.canvas.doLayout();
	},
	setRemarkAttributes : function(config){
		if(config.width<1||config.height<1){
			alert("设置的值不对,请重新设置!");
			return;
		}
		this.setHeight(config.height);
		this.setWidth(config.width);
		this.refreshHTML(config.html)
	},
	refreshHTML : function(html){
		this.el.dom.firstChild.firstChild.innerHTML = html;
	},
	showAttributes : function(){
		var cfg = {
			width : this.getWidth(),
			height : this.getHeight(),
			html : this.el.dom.firstChild.firstChild.innerHTML
		};
		$import("app.harmony.system.Module.WorkFlow.Canvas.Detail.RemarkAttributes");
		new app.harmony.system.Module.WorkFlow.Canvas.Detail.RemarkAttributes({remarkAttributes:cfg,remarkPanel:this}).show();
	},
	getInnerHTML : function(){
		var cfg = {
			x : this.x,
			y : this.y,
			width : this.getWidth(),
			height : this.getHeight(),
			html : this.el.dom.firstChild.firstChild.innerHTML
		};
		return cfg;
	}
});