Ext.ns("app.harmony.system.Module.WorkFlow");
$import("app.harmony.system.Module.WorkFlow.ObjModelSubTBar");
app.harmony.system.Module.WorkFlow.ObjModel = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.ObjModel.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.ObjModel,app.harmony.system.Analytic.SysModule,{
	treeURL : 'WorkFlow/ModuleClassTree.do',
	treeAction : 'wfModuleClass',
	treeTitle : '系统',
	mainClassName : 'ObjModel',
	connURL : 'WorkFlow/ObjModel.do',
	winWidth : 500,
	winHeight : 330,
	tabHeight : document.body.clientHeight*0.6,
	mainGridDetailJS : 'app.harmony.system.Module.WorkFlow.ObjModelDetail',
	addBtn : null,
	initTree : function(){          
		app.harmony.system.Module.WorkFlow.ObjModel.superclass.initTree.call(this);
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
		p['id'] = 'moduleclassid';
		p['treelevel'] = 'treelevel';
		list.push({grid:this.mainGrid,params:p});
		return list;
	},
	initTabData : function(data){                    
		var tabs = [];
		tabs.push({
			tabTitle:'对象属性',
			region : 'center',
			connURL : 'WorkFlow/ObjModelSub.do',
			gridType : 'GridPanel',
			singleSelect : true,
			winWidth : 740,
			winHeight : 480,
			pageSize : 30,
			moduleID : this.moduleID,
			className : 'ObjModelSub',
			detailURL : 'app.harmony.system.Module.WorkFlow.ObjModelSubDetail',
			tbarJS : 'app.harmony.system.Module.WorkFlow.ObjModelSubTBar'
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