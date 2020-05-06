Ext.ns("app.harmony.system.Module.WorkFlow");
app.harmony.system.Module.WorkFlow.InstName = function(config){
	Ext.apply(this, config);
	$import("app.harmony.system.Plugin.GridPanel");
	$import("app.harmony.system.Plugin.EditRowGrid");
	$import("app.harmony.system.BaseClass.GridTBar");
	$import("app.harmony.system.BaseClass.GridRowTBar");
	app.harmony.system.Module.WorkFlow.InstName.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.InstName,app.harmony.system.Analytic.SysModule,{
	treeURL : 'WorkFlow/ModuleClassTree.do',
	treeAction : 'WFDraw',
	treeTitle : '系统',
	mainClassName : 'InstName',
	mainGridType : 'EditRowGrid',
	connURL : 'WorkFlow/InstName.do',
	tabHeight : document.body.clientHeight*0.6,
	addBtn : null,
	initTree : function(){          
		app.harmony.system.Module.WorkFlow.InstName.superclass.initTree.call(this);
		/** 控制添加按钮 */
		var allBtn = this.mainGrid.getTopToolbar().items.items;
		for(var i=0; i<allBtn.length; i++) {
			if(allBtn[i].btnid == 'add') {
				this.addBtn = allBtn[i];
				this.addBtn.disable();
				break;
			}
		}
		this.leftTree.on('click',this.nodeChecked,this);
	},
	nodeChecked : function(node){
		if(node.attributes.treelevel == 2) {
			this.addBtn.enable();
		}else{
			this.addBtn.disable();
		}
	},
	getTreeRefresh : function(){
		var list = [];
		var p = {};
		p['id'] = 'wfid';
		list.push({grid:this.mainGrid,params:p});
		return list;
	}
});