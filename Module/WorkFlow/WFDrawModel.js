$import("app.harmony.system.Module.WorkFlow.Canvas.Canvas");
Ext.ns("app.harmony.system.Module.WorkFlow");
app.harmony.system.Module.WorkFlow.WFDrawModel = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.WFDrawModel.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.WFDrawModel,app.harmony.system.Analytic.SysModule,{
	treeURL : 'WorkFlow/ModuleClassTree.do',
	treeAction : 'WFDraw',
	treeTitle : '系统',
	detailPanel : null,
	selectNode : null,
	getTreeRefresh : function(){         
		return [];
	},
	initTree : function(){          
		app.harmony.system.Module.WorkFlow.WFDrawModel.superclass.initTree.call(this);
		this.leftTree.on('afterClick',function(tree,node){
			if(node.leaf){
				Ext.Msg.confirm("提示","确定切换流程图吗?",function(btn){
					if(btn=='yes'){
						this.centerPanel.items.items[0].loadGraph(node.id);
						this.selectNode = node;
					}
					else{
						if(!Ext.isEmpty(this.selectNode))
							this.selectNode.select();
						else
							node.unselect();
					}
				},this);
			}else{
				this.selectNode = null;
				this.centerPanel.items.items[0].topToolbar.showAllBtn(false);
			}
		},this);
	},
	initFramePanel : function(data){        
		this.initPanel();
		this.initTree();
	},
	initPanel : function(){
		this.centerPanel = new Ext.Panel({
			region:'center',
			border : false,
			layout:'border',
			style:'padding:1px;',
			items : [new app.harmony.system.Module.WorkFlow.Canvas.Canvas({region:'center'})]
		});
		this.add(this.centerPanel);
	}
});