Ext.ns("app.harmony.system.Module.GridColumn");
app.harmony.system.Module.GridColumn.GridColumn = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.GridColumn.GridColumn.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.GridColumn.GridColumn,app.harmony.system.Analytic.SysModule,{
	treeURL : 'ModuleTree.do',
	treeAction : 'module',
	treeTitle : '系统',
	mainClassName : 'ModuleClass',
	mainGridType : 'EditRowGrid',
	connURL : 'ModuleClass.do',
	winWidth : 500,
	winHeight : 330,
	tabHeight : document.body.clientHeight*0.75,
	gridRowTBarJS : 'app.harmony.system.Module.GridColumn.ModuleClassTBar',
	addBtn : null,
	copyBtn : null,
	initTree : function(){          
		app.harmony.system.Module.GridColumn.GridColumn.superclass.initTree.call(this);
		/** 控制添加按钮 */
		var allBtn = this.mainGrid.getTopToolbar().items.items;
		for(var i=0; i<allBtn.length; i++) {
			if(allBtn[i].btnid == 'add') {
				this.addBtn = allBtn[i];
				this.addBtn.disable();
				continue;
			}
			if(allBtn[i].btnid == 'copy') {
				this.copyBtn = allBtn[i];
				this.copyBtn.disable();
			}
		}
		this.leftTree.on('click',this.nodeChecked,this);
	},
	nodeChecked : function(node){
		
		if(node.attributes.treelevel == 3) {
			this.addBtn.enable();
			this.copyBtn.enable();
		}else{
			this.addBtn.disable();
			this.copyBtn.disable();
		}
	},
	getTreeRefresh : function(){
		var list = [];
		var p = {};
		p['id'] = 'moduleid';
		p['treelevel'] = 'treelevel';
		list.push({grid:this.mainGrid,params:p});
		return list;
	},
	initMainGrid : function(){          
		var cfg = this.initMainGridCfg();
		$import("app.harmony.system.Plugin."+this.mainGridType);
		this.mainGrid = eval("new app.harmony.system.Plugin."+this.mainGridType+"(cfg)");
	},
	initTabData : function(data){                    
		var tabs = [];
		tabs.push({
			tabTitle:'字段属性',
			region : 'center',
			connURL : 'ClassField.do',
			singleSelect : false,
			winWidth : 740,
			winHeight : 480,
			pageSize : 70,
			moduleID : this.moduleID,
			className : 'ClassField',
			ForceFit : false,
			gridType : 'EditRowGrid',
			tbarJS : 'app.harmony.system.Module.GridColumn.ClassFieldTBar'}
			);
		tabs.push({
			tabTitle:'唯一性',
			region : 'center',
			connURL : 'ClassUnique.do',
			winWidth : 640,
			winHeight : 160,
			pageSize : 30,
			moduleID : this.moduleID,
			className : 'ClassUnique',
			gridType : 'EditRowGrid',
			tbarJS : this.gridRowTBarJS
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