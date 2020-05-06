Ext.ns("app.harmony.system.Module.Param");
$import("app.harmony.system.BaseClass.GridRowTBar");
app.harmony.system.Module.Param.GridConstConfigTBar = Ext.extend(app.harmony.system.BaseClass.GridRowTBar, {
	initBeforeOther : function(){
     	this.add({xtype:'textfield',width:200,id:'qry_name'});
		this.add('-');
		this.add({text:'查询',handler:this.query,scope:this});
		this.add('-');
		this.add({text:'清空',handler:this.clear,scope:this});
		this.add('-');
		this.add({text:'生效',handler:this.effect,scope:this});
	},
	query : function(){
		var name = Ext.getCmp("qry_name").getValue();
		this.PGrid.setStoreParam({name:name});
		this.PGrid.reloadGrid();
	},
	
	clear : function(){
		Ext.getCmp("qry_name").setValue('');
	},
	
	effect : function(){		
		var record = this.PGrid.getSelectionModel().getSelected();	
        var flag = record.get("flag");
		if(flag==1){
			alert("请先归档！");
			return;
		}
		Ext.MessageBox.confirm("提醒","确定要修改吗?",function(e){
			if(e=='yes'){
				var classname = record.get("classname");
				var field = record.get("field");
				var paravalue = record.get("value");
				Ext.Ajax.request({
						url: 'SysConstEffect.do',  
					 	params:{object:'constEffect', token:token,classname:classname,field:field,paravalue:paravalue},
					 	scope : this,
					 	callback:function(o,s, resp){
					 		if(ajaxRequestFailure(resp.statusText))//判断ajax调用是否失败
					 			return;
					 		var respText = Ext.util.JSON.decode(resp.responseText);
					 		if(respText.success){
								alert(respText.data);				
							}else{
								alert(respText.error);
							}
					 	}
					});	
			}else{
				return;
			}
		},this);

	}
});