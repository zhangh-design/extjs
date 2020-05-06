Ext.ns("app.harmony.system.Plugin");
app.harmony.system.Plugin.DetailTabPanel = Ext.extend(Ext.TabPanel, {   
	region : 'south',
	height : document.body.clientWidth * 0.27,
	style : 'padding:0 1 1 1',
	setTabActiveTab : function(number){
		if(Ext.isEmpty(number))
			number = 0;
		this.detailTabPanel.setActiveTab(number);
		var tab = this.detailTabPanel.getActiveTab();
		if(!Ext.isEmpty(tab.detailUrl))
			tab.body.setSrc(tab.detailUrl);
		tab.detailUrl = '';
		//this.detailTabPanel.doLayout();
		
	},
	listeners : {
		/**
		 * 刷新表单内容
		 * @param {} panel
		 * @param {} tab
		 */
		tabchange : function(panel,tab){
			if(!Ext.isEmpty(tab.detailUrl)){
				tab.body.setSrc(tab.detailUrl);
				tab.detailUrl='';
				tab.doLayout();
			}
		}
	}
});