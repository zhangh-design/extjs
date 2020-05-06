Ext.ns("app.harmony.system.Module.HomePage");
$import("app.harmony.system.BaseClass.GridTBar");
app.harmony.system.Module.HomePage.HomePageSubTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.HomePage.HomePageSubTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Module.HomePage.HomePageSubTBar,app.harmony.system.BaseClass.GridTBar, { 
	/**
	 * 添加按钮,模块中重写该方法，添加自定义按钮
	 */
	exportsql_e : function(){
		var record  = this.getBubbleTarget().PGrid.getSelectionModel().getSelected();
		Ext.Ajax.request({
			url : this.getBubbleTarget().PGrid.connURL,
			params : {object:'exportSQL',
					  rid:record.data.rid,
					  prid:record.data.prid,
					  moduleID:this.getBubbleTarget().PGrid.moduleID,
					  token:token},
			scope : this,
			callback : function(o,s,resp){
				if(ajaxRequestFailure(resp.statusText)){
					return;
				}
				var respText = Ext.util.JSON.decode(resp.responseText);
				if(respText.success){
					var msg = respText.data;
		 			msg = msg.replace(/["]/ig,"'");
		 			var formPanel = new Ext.Panel({
						region : 'center',
						border : false,
						html : msg,
						width :395,
						height:295
				    });
		 			var win = new Ext.Window({
						title: 'SQL', 
						modal : true,
						width: 400, 
						height: 300, 
						resizable: false, 
						items: [formPanel],
						buttons : [
						{
							text:'复制',
							handler : function(){
								window.clipboardData.setData("Text",
								msg.replace(";<br>",";\r").replace(";<br>",";\r").replace(";<br>",";\r"));
								Ext.Msg.alert("提示","已经复制到粘贴板");
							}},
						{
							text:'关闭',
							handler : function(){win.close()}
						}]
					});
					win.show();
				}
			}
		});
}
});