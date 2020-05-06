Ext.ns("app.harmony.system.Module.GridColumn");
$import("app.harmony.system.BaseClass.Window");
$import("app.harmony.system.BaseClass.GridRowTBar");
app.harmony.system.Module.GridColumn.ModuleClassTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.GridColumn.ModuleClassTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Module.GridColumn.ModuleClassTBar,app.harmony.system.BaseClass.GridRowTBar, {
	loadMask : new Ext.LoadMask(document.body,{msg : '正在同步数据，请稍候......',removeMask : false}),
	sync_e : function(){
		var records = this.ownerCt.PGrid.getSelectionModel().getSelections();
		if(records.length == 0) {
			alert('请选择一条同步数据');
			return;
		}
		this.getBubbleTarget().loadMask.show();
		Ext.Ajax.request({
			url : 'ModuleClass.do',
			params : {object:'syncData',
					  moduleId:records[0].data.moduleid,
					  className:records[0].data.classname,
					  token:token},
			scope : this,
			callback : function(o,s,resp){
				this.getBubbleTarget().loadMask.hide();
				if(ajaxRequestFailure(resp.statusText)){
					return;
				}
				var respText = Ext.util.JSON.decode(resp.responseText);
				if(respText.success){
					alert(respText.data);
				}
			}
		});
	},
	copy_e : function(){
		var uParams  = this.getBubbleTarget().PGrid.getStore().baseParams;
		var cfg = {
		   jsDetail : 'app.harmony.system.Module.GridColumn.ModuleCopyDetail',
		   width : 500,
		   height : 300,
		   title : '复制模块',
		   PGrid :  this.getBubbleTarget().PGrid,
		   url : 'ModuleClass.do',
		   uParams : uParams,
		   isCanEdit : 'add'
		};
		$import("app.harmony.system.BaseClass.Window");
		var detailWin = new app.harmony.system.BaseClass.Window(cfg);
		detailWin.show();
	}
});