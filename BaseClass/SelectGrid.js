Ext.ns("app.harmony.system.BaseClass");
$import("app.harmony.system.Plugin.GridPanel");
app.harmony.system.BaseClass.SelectGrid = function(config){
	Ext.apply(this, config);
	this.connURL = this.url||this.urlAction;
	app.harmony.system.BaseClass.SelectGrid.superclass.constructor.call(this, config);
	if(this.isAutoLoad)
		this.reloadGrid();
}
Ext.extend(app.harmony.system.BaseClass.SelectGrid,app.harmony.system.Plugin.GridPanel, {
	/** 隐藏所有按钮 */
	isSearchBbar : false,
	isAutoLoad : true,
	singleSelect : false,
	pageSize : 30,
	initStoreParam : function(){
		this.setStoreParam(this.uParams);
	},
	uParams : null,
	/** 保存所有选中记录ID的数组 */
	selectIds : [],
	/** 保存选中记录ID的方法 */
	saveIds : function(){
		var record = this.getSelectionModel().getSelections();
		for (var i=0; i<record.length; i++) {
			this.selectIds.push(record[i].data.rid)
		}
	},
	/** 弹出框的保存按钮方法 */
	saveForm : function (){
		this.saveIds();
		var params = {object:'importFiled',rids:this.selectIds.join(","),token:token};
		Ext.apply(params, this.uParams);
		Ext.Ajax.request({
			url: this.connURL,  
		 	params:params,
		 	scope : this,
		 	callback:function(o,s, resp){
		 		//先判断与ajax与后台交互是否成功
		 		if(ajaxRequestFailure(resp.statusText))
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
					parent.window.openWindow.PGrid.reloadGrid();
		 			parent.window.openWindow.close();
		 		}else{
		 			alert(respText.error);
		 		}
		 	}
		});
	}
});