$import("app.ext3-2.script.miframe");
Ext.ns("app.harmony.system.BaseClass");
app.harmony.system.BaseClass.Print = function(config){
	Ext.apply(this, config);
	app.harmony.system.BaseClass.Print.superclass.constructor.call(this, config);
	this.initWin();
};
Ext.extend(app.harmony.system.BaseClass.Print,Ext.util.Observable,{
	width : 800,
	height : 435,
	winWidth : 815,
	winHeight : 500,
	ModuleID : null,
	ClassName : null,
	token : null,
	url : null,
	rid : null,
	printAction : null,
	initWin : function(){
		if(Ext.isEmpty(this.url))
			this.url = './PrintBase.do?';
		this.url += "action="+this.printAction+"&ModuleID=" + this.ModuleID+"&ClassName="
							+ this.ClassName+"&token="+ this.token+"&rid="+this.rid;
		var printPanel = new Ext.Panel({
			border : false,
			region : 'center',
			layout : 'fit',
			autoScroll : false,
			body : new Ext.ux.ManagedIFrame({
                autoCreate:{
                    xtype : "panel",
            		src : this.url,                        
                    frameBorder : 0,
                    autoScroll : true,
                    width : this.width,
                    height : this.height,
                    autoHeight : true,
                    autoWidth : true
                }
            })
		});
		var win = new Ext.Window({
			title: '打印页面', 
			modal : true,
			width: this.winWidth, 
			height: this.winHeight, 
			resizable: false, 
			autoScroll : false,
			items: [printPanel],
			buttons : [{
				text : '打印',
				handler : function(){printPanel.body.print()}
			},{
				text:'关闭',
				handler : function(){win.close()}
			}]
		});
		win.show();
	}
});