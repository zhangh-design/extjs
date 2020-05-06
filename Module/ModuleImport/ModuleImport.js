Ext.ns("app.harmony.system.Module.ModuleImport");
$import("app.harmony.system.Module.GridColumn.ClassFieldTBar");
app.harmony.system.Module.ModuleImport.ModuleImport = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.ModuleImport.ModuleImport.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.ModuleImport.ModuleImport,app.harmony.system.Analytic.SysModule,{
	treeURL : 'ModuleTree.do',
	treeAction : 'module',
	treeTitle : '系统',
	mainClassName : 'ModuleClass',
	connURL : 'ModuleClass.do',
	winWidth : 450,
	winHeight : 380,
	tabHeight : document.body.clientHeight*0.8,
	mainGridDetailJS : 'app.harmony.system.Module.ModuleImport.ModuleClassDetail',
	gridTBarJS : 'app.harmony.system.Module.GridColumn.ModuleClassTBar',
	initTree : function(){          
		app.harmony.system.Module.ModuleImport.ModuleImport.superclass.initTree.call(this);
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
			tabTitle:'导入字段属性',
			region : 'center',
			connURL : 'ClassImportField.do',
			gridType : 'GridPanel',
			singleSelect : false,
			winWidth : 540,
			winHeight : 380,
			pageSize : 30,
			moduleID : this.moduleID,
			className : 'ClassImportField',
			detailURL : 'app.harmony.system.Module.ModuleImport.ClassImportFieldDetail',
			tbarJS : 'app.harmony.system.Module.ModuleImport.ClassImportFieldTBar'}
			);
		return tabs;
	},
	setRefreshGridParams : function(grid,index){		
		var p = {};
		p['rid'] = 'classid';
		p['tablename'] = 'tablename'
		return {grid:grid,params:p};
	}
});