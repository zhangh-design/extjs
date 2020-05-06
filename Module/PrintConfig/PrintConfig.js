Ext.ns("app.harmony.system.Module.PrintConfig");
$import("app.harmony.system.Module.GridColumn.ClassFieldTBar");
app.harmony.system.Module.PrintConfig.PrintConfig = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.PrintConfig.PrintConfig.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.PrintConfig.PrintConfig,app.harmony.system.Analytic.SysModule,{
	treeURL : 'ModuleTree.do',
	treeAction : 'module',
	treeTitle : '系统',
	mainClassName : 'ModuleClass',
	connURL : 'ModuleClass.do',
	winWidth : 450,
	winHeight : 380,
	tabHeight : document.body.clientHeight*0.4,
	mainGridDetailJS : 'app.harmony.system.Module.PrintConfig.ModuleClassDetail',
	initTree : function(){
		app.harmony.system.Module.PrintConfig.PrintConfig.superclass.initTree.call(this);
	},
	getTreeRefresh : function(){
		var list = [];
		var p = {};
		p['id'] = 'moduleid';
		p['treelevel'] = 'treelevel';
		list.push({grid:this.mainGrid,params:p});
		return list;
	},
	initTabData : function(data){                    
		var tabs = [];
		tabs.push({
			tabTitle:'打印配置',
			region : 'center',
			connURL : 'PrintConfig.do',
			gridType : 'GridPanel',
			singleSelect : false,
			winWidth : 650,
			winHeight : 350,
			pageSize : 30,
			moduleID : this.moduleID,
			className : 'PrintConfig',
			detailURL : 'app.harmony.system.Module.PrintConfig.PrintConfigDetail',
			tbarJS : 'app.harmony.system.Module.PrintConfig.PrintConfigTBar'
			});
		return tabs;
	},
	setRefreshGridParams : function(grid,index){		
		var p = {};
		p['rid'] = 'classid';
		p['tablename'] = 'tablename'
		return {grid:grid,params:p};
	}
});