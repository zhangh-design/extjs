Ext.ns("app.harmony.system.Module.RoleMenu");
app.harmony.system.Module.RoleMenu.ModuleBtn = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.RoleMenu.ModuleBtn.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.RoleMenu.ModuleBtn,app.harmony.system.Analytic.SysModule,{
	treeURL : 'RoleMenuTree.do',
	treeAction : 'btnModuleTree',
	treeTitle : '模块',
	mainClassName : 'ModuleClass',
	treePRID : 'rid',
	isSearchBbar : false,
	connURL : 'BtnModuleClass.do',
	tabHeight : document.body.clientHeight*0.6,
	initTabData : function(data){                    
		var tabs = new Array();
		tabs.push({
			tabTitle:'分配按钮',
			region : 'center',
			connURL : '/ModuleBtnType.do',
			gridType : 'GridPanel',
			pageSize : 30,
			winWidth : 600,
			winHeight : 300,
			moduleID : this.moduleID,
			className : 'ModuleBtnType',
			detailURL : 'app.harmony.system.Module.RoleMenu.TabAddPanel',
			tbarJS : 'app.harmony.system.Module.RoleMenu.BtnDistTBar'}
		);
		return tabs;
	},
	setRefreshGridParams : function(grid,index){		
		var p = new Object();
		p['moduleid'] = 'moduleid';
		p['classname'] = 'classname';
		return {grid:grid,params:p};
	}
});