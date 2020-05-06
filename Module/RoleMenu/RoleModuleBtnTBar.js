Ext.ns("app.harmony.system.Module.RoleMenu");
app.harmony.system.Module.RoleMenu.RoleModuleBtnTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.RoleMenu.RoleModuleBtnTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Module.RoleMenu.RoleModuleBtnTBar,app.harmony.system.BaseClass.GridTBar, {   
	add_e : function(){
		var records = this.getBubbleTarget().PGrid.getSelectionModel().getSelections();
		var rid = '-1';
		Ext.each(records,function(rec,index){
			rid += ","+rec.data.rid;
		},this);
		var params = {object : 'saveBtn', rid : rid, token : token};
		var gridParams = this.getBubbleTarget().PGrid.store.baseParams;
		Ext.apply(params,gridParams);
		Ext.Ajax.request({    
		 	url: 'RoleModuleBtn.do',  
		 	params:params,
		 	scope : this,
		 	callback:function(o,s, resp){
		 		if(ajaxRequestFailure(resp.statusText))
			 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			this.getBubbleTarget().PGrid.reloadGrid();
		 		}else{
		 			Ext.Msg.alert("错误",respText.error);
		 		}
		 	}
		});
	}
});