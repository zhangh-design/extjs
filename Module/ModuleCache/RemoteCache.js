Ext.ns("app.harmony.system.Module.ModuleCache");
app.harmony.system.Module.ModuleCache.RemoteCache = Ext.extend(app.harmony.system.Analytic.SysModule,{
	isShowTree : false,
	singleSelect : false,
	mainClassName : 'RemoteCache',
	connURL : 'RemoteCache.do',
	winHeight : 300,
	winWidth : 400,
	isKeyFind : true,
	gridKey : 'name',
	definedTBarJS : 'app.harmony.system.Module.ModuleCache.RemoteCacheTBar',
	initMainGrid : function(){          
		app.harmony.system.Module.ModuleCache.RemoteCache.superclass.initMainGrid.call(this);
		this.mainGrid.on("afterRowDblClick",this.showDetail,this);
	},
	showDetail : function(grid,record){
		var name = record.json.name;
		var url = "";
		if(name.indexOf("harmony.system.BaseClass.TokenManage")!=-1){
			url = "app.harmony.system.Module.ModuleCache.RemoteLogInfoDetail";
			this.winHeight = 230;
			this.winWidth = 900;
		}
		this.openWindow(url,name);
	},
	openWindow : function(url,rid){
		$import("app.harmony.system.BaseClass.Window");
		var param = {
			moduleID:this.moduleID,
			className:this.mainClassName,
			jsDetail: url, 
			rid : rid,
			PGrid:this.mainGrid,
			height : this.winHeight,
			width : this.winWidth,
			isCanEdit : 'query'
		};
		this.detailWindow = new app.harmony.system.BaseClass.Window(param);
		this.detailWindow.show();
	}
});