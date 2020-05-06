Ext.ns("app.harmony.system.Module.GridColumn");
$import("app.harmony.system.BaseClass.Window");
$import("app.harmony.system.BaseClass.GridRowTBar");
app.harmony.system.Module.GridColumn.ClassFieldTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.GridColumn.ClassFieldTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Module.GridColumn.ClassFieldTBar,app.harmony.system.BaseClass.GridRowTBar, {
	import_e : function(){
		var uParams = this.getBubbleTarget().getBubbleTarget().getStore().baseParams;
		var cfg = {
			title : '导入',
			moduleID : this.getBubbleTarget().PGrid.moduleID,
			className : 'TableField',
			jsDetail : 'app.harmony.system.BaseClass.SelectGrid',
			url : 'TableField.do',
			isCanEdit : 'add',
			uParams : uParams,
			PGrid :  this.getBubbleTarget().PGrid,
			width : 500,
			height : 500
		}
		var gridWin = new app.harmony.system.BaseClass.Window(cfg);
		gridWin.show();
	},
	hiddenChange : function(){
		this.getBubbleTarget().changeState('hidden');
	},
	readOnlyChange : function(){
		this.getBubbleTarget().changeState('readonly');
	},
	notNullChange : function(){
		this.getBubbleTarget().changeState('notnull');
	},
	sortableChange : function(){
		this.getBubbleTarget().changeState('sortable');
	},
	changeState : function(field){
		var records = this.PGrid.getSelectionModel().getSelections();
		if(records.length == 0) {
			alert('至少选择一条记录');
			return;
		}
//		Ext.Msg.confirm("提示","是否要改变状态",function(button,text){
//			if(button!="yes")
//				return;
			var params = [];
			for (var i=0; i<records.length; i++) {
				params.push(records[i].data.rid+','+records[i].data[field])
			}
			Ext.Ajax.request({
				url : 'ClassField.do',
				params : {object:'changeState',
						  params:params.join('-'),
						  field:field,
						  token:token},
				scope : this,
				callback : function(o,s,resp){
					if(ajaxRequestFailure(resp.statusText)){
						return;
					}
					var respText = Ext.util.JSON.decode(resp.responseText);
					if(respText.success){
						this.PGrid.reloadGrid();
					}
				}
			});
//		},this);
	},
	moveDown : function(){
		this.getBubbleTarget().changeOrder('down');
	},
	moveUp : function(){
		this.getBubbleTarget().changeOrder('up');
	},
	changeOrder : function(field){
		var records = this.PGrid.getSelectionModel().getSelections();
		if(records.length != 1) {
			alert('选择一条记录');
			return;
		}
		var record = records[0];
		Ext.Ajax.request({
			url : 'ClassField.do',
			params : {object:'moveData',
					  rid : record.data.rid,
					  sortnum : record.data.sortnum,
					  classid : record.data.classid,
					  field:field,
					  token:token},
			scope : this,
			callback : function(o,s,resp){
				if(ajaxRequestFailure(resp.statusText)){
					return;
				}
				var respText = Ext.util.JSON.decode(resp.responseText);
				if(respText.success){
					this.PGrid.reloadGrid();
				}
			}
		});
	}
	
});