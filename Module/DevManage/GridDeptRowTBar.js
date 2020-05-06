Ext.ns("app.harmony.system.BaseClass");
$import("app.harmony.system.BaseClass.GridRowTBar");
app.harmony.system.Module.DevManage.GridDeptRowTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.DevManage.GridDeptRowTBar.superclass.constructor.call(this, config);
	this.initSubDeptTbar();
}
Ext.extend(app.harmony.system.Module.DevManage.GridDeptRowTBar,app.harmony.system.BaseClass.GridRowTBar, {
	initSubDeptTbar : function(){
		this.add({boxLabel:'显示子机构',xtype:'checkbox',scope:this,
			handler:function(obj){
				var grid = this.PGrid;
				var sType = "0";
				if(obj.checked){
					sType= "1";
				}else{
					sType = "0";
				}
				grid.getStore().on('beforeload',function(store,options){
					grid.getStore().setBaseParam("type",sType);//外部传入的RID
			    },this);
			    grid.reloadGrid();
			}
		});
		this.addOtherBtn();
	},
	addOtherBtn : function(){
		//this.add({text:'执行命令',scope:this,handler:this.doFun});
	},
	doFun : function(){
		Ext.Msg.prompt("提醒","输入命令",function(btn,text){
			if(Ext.isEmpty(text))
	 			return;
	     	Ext.Ajax.request({    
				 	url: this.PGrid.connURL,
				 	params:{object:text,token:token},
				 	scope : this,
				 	callback:function(o,s, resp){
				 		var respText = Ext.util.JSON.decode(resp.responseText);
				 		if(respText.success) {
							Ext.Msg.alert('提示',respText.data);
						}else{
							Ext.Msg.alert('提示',respText.error);
						}
				 	}
				});
	     },this);
	}
});