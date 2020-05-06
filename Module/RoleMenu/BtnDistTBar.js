Ext.ns("app.harmony.system.Module.RoleMenu");
app.harmony.system.Module.RoleMenu.BtnDistTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.RoleMenu.BtnDistTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Module.RoleMenu.BtnDistTBar,app.harmony.system.BaseClass.GridTBar, {   
	import_e : function(){
		var uParams = this.getBubbleTarget().getBubbleTarget().getStore().baseParams;
		var cfg = {
			title : '导入',
			moduleID : this.getBubbleTarget().PGrid.moduleID,
			className : 'GridBtn',
			jsDetail : 'app.harmony.system.BaseClass.SelectGrid',
			url : 'ImportBtnType.do',
			isCanEdit : 'add',
			uParams : uParams,
			PGrid :  this.getBubbleTarget().PGrid,
			width : 500,
			height : 500
		}
		$import("app.harmony.system.BaseClass.Window");
		var gridWin = new app.harmony.system.BaseClass.Window(cfg);
		gridWin.show();
	}
});