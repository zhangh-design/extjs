Ext.ns("app.harmony.system.Module.WorkFlow");
$import("app.harmony.system.BaseClass.Window");
app.harmony.system.Module.WorkFlow.ObjModelSubTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.ObjModelSubTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Module.WorkFlow.ObjModelSubTBar,app.harmony.system.BaseClass.GridTBar, {
	add_e : function(){
		var uParams = this.getBubbleTarget().getBubbleTarget().getStore().baseParams;
		var cfg = {
			title : '添加',
			moduleID : this.getBubbleTarget().PGrid.moduleID,
			className : 'TableField',
			jsDetail : 'app.harmony.system.BaseClass.SelectGrid',
			url : 'WorkFlow/TableField.do',
			isCanEdit : 'add',
			uParams : uParams,
			PGrid :  this.getBubbleTarget().PGrid,
			width : 500,
			height : 500
		}
		var gridWin = new app.harmony.system.BaseClass.Window(cfg);
		gridWin.show();
	}
	
});