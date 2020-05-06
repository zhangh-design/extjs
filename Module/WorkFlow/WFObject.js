Ext.ns("app.harmony.system.Module.WorkFlow");
app.harmony.system.Module.WorkFlow.WFObject = function(config){
	Ext.apply(this, config);
	$import("app.harmony.system.Plugin.GridPanel");
	$import("app.harmony.system.Plugin.EditRowGrid");
	$import("app.harmony.system.BaseClass.GridTBar");
	$import("app.harmony.system.BaseClass.GridRowTBar");
	app.harmony.system.Module.WorkFlow.WFObject.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.WFObject,app.harmony.system.Analytic.SysModule,{
	treeURL : 'WorkFlow/ModuleClassTree.do',
	treeAction : 'WFDraw',
	treeTitle : '系统',
	mainClassName : 'WFObjectMaintain',
	mainGridType : 'EditRowGrid',
	connURL : 'WorkFlow/WFObjectMaintain.do',
	winWidth : 500,
	winHeight : 330,
	tabHeight : document.body.clientHeight*0.6,
	addBtn : null,
	initTree : function(){          
		app.harmony.system.Module.WorkFlow.WFObject.superclass.initTree.call(this);
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
		p['id'] = 'moduleid';
		list.push({grid:this.mainGrid,params:p});
		return list;
	},
	initTabData : function(data){                    
		var tabs = [];
		tabs.push({
			tabTitle:'处理模块',
			region : 'center',
			connURL : 'WorkFlow/WFObjectMaintainSub.do',
			gridType : 'EditRowGrid',
			singleSelect : true,
			pageSize : 30,
			moduleID : this.moduleID,
			className : 'WFObjectMaintainSub',
			tbarJS : this.gridRowTBarJS
		});
		return tabs;
	},
	setRefreshGridParams : function(grid,index){		
		var p = {};
		p['rid'] = 'wfid';
		return {grid:grid,params:p};
	}
});