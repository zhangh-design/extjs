Ext.ns("app.harmony.system.Module.RoleMenu");
app.harmony.system.Module.RoleMenu.RoleModuleBtn = function(config) {
	Ext.apply(this, config);	
	app.harmony.system.Module.RoleMenu.RoleModuleBtn.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.RoleMenu.RoleModuleBtn, app.harmony.system.Analytic.SysModule, {
	treeURL : 'RoleTree.do',
	treeAction : 'role',
	treeTitle : '超级管理员',
	treeid : '0',
	centerPanel : null,
	eastGrid : null,
	moduleClassGridPanel : null,
	perMenuTree : null,//模块菜单
	prefileData : null,
	menuTreeNodeID : null,
	moduleTreeNodeID : null,
	moduleTreeNodeLevel : null,
	initFramePanel : function(){  
		this.initTree();//初始化SysModule的树
		this.initOtherTree();//初始化加入的树
		this.addTreeListener();//添加树点击事件
		this.initRMBGridPanel();//初始化RoleModuleBtn  GridPanel
		this.initMCGridPanel();//初始化ModuleClass GridPanel
		this.initPanelForTree();//初始化存放自定义树和ModuleClass GridPanel的Panel
	},
	getTreeRefresh : function(){         
		return null;
	},
	/**
	 * 初始化模块菜单树
	 */
	initOtherTree : function(){
		this.prefileData = new Ext.tree.TreeLoader({ url: this.treeURL+'?action=roleModuleMenu&token='+token});
		this.prefileData.on('beforeload', function(loader, node) {
	        this.baseParams.id = node.attributes.id;
	        this.baseParams.nodelevel = node.attributes.nodelevel;
	        this.menuTreeNodeID = node.attributes.id;
	    }, this.prefileData);
	    this.perMenuTree = new Ext.tree.TreePanel({
			region: 'center',
			autoScroll:true,
			frame:false,
			width : 200,
	        root: new Ext.tree.AsyncTreeNode({
				id : '0',//默认的ID
				qtip : '模块菜单',
				text : '模块菜单'
		    }),
		    scope : this,
	        loader: this.prefileData,
	        listeners : {
	        	click : function(node) {//单击自定义树刷新ModuleClass GridPanel
	        		var obj = this.ownerCt.ownerCt.getOtherTreeRefreshMC();
	        		this.ownerCt.ownerCt.refreshMCGrid(node,obj);
	        		node.isExpanded()?node.collapse():node.expand();
	        	}
	        }
	    });
	},
	/**
	 * 添加主树的单击和加载事件
	 */
	addTreeListener : function(){
		this.leftTree.addListener('click', function(node) {
			this.prefileData = new Ext.tree.TreeLoader({ url: this.treeURL+'?action=roleModuleMenu&token='+token + '&sysRoleID=' + node.id});
			this.prefileData.on('beforeload', function(loader, node) {
		        this.baseParams.id = node.attributes.id;
		        this.baseParams.nodelevel = node.attributes.nodelevel;
		        this.menuTreeNodeID = node.attributes.id;
		    }, this.prefileData);
			this.perMenuTree.loader = this.prefileData;
			this.perMenuTree.getRootNode().reload();
			this.perMenuTree.getRootNode().expand();
			this.perMenuTree.getRootNode().select();
	    },this);
	    this.leftTree.addListener('load', function(node) {
			if(node.id==this.treeid){
    			if(this.leftTree.rootVisible){
    				if(node.isExpanded()){
    					node.select(); 
    				}
    			}else{
    				if(!node.isExpanded())
    					node.expand();
        			var childNodes = node.childNodes; 
        			var child = childNodes[0];
        			child.select();
					this.prefileData = new Ext.tree.TreeLoader({ url: this.treeURL+'?action=roleModuleMenu&token='+token + '&sysRoleID=' + child.id});
					this.prefileData.on('beforeload', function(loader, node) {
				        this.baseParams.id = node.attributes.id;
				        this.baseParams.nodelevel = node.attributes.nodelevel;
				        this.menuTreeNodeID = node.attributes.id;
				    }, this.prefileData);
					this.perMenuTree.loader = this.prefileData;
					this.perMenuTree.getRootNode().reload();
					this.perMenuTree.getRootNode().expand();
					this.perMenuTree.getRootNode().select();
    			}
			}
    	},this);
	},
	/**
	 * 初始化RoleModuleBtnGrid
	 */
	initRMBGridPanel : function() {
		var cfg = {
				title : '按钮',
				region : 'east',
				width : 240,
				connURL : 'RoleModuleBtn.do',
				gridType : 'GridPanel',
				pageSize : 9999,
				moduleID : this.moduleID,
				className : 'GridBtn',
				scope : this,
				tbarJS : 'app.harmony.system.Module.RoleMenu.RoleModuleBtnTBar',
				singleSelect : false,
				dqxzh : true,
				refreshGrids : this.getRefreshGrids()
		};
		$import("app.harmony.system.Plugin.GridPanel");
		this.eastGrid = eval("new app.harmony.system.Plugin.GridPanel(cfg)");
		this.add(this.eastGrid);
	},
	/**
	 * 初始化ModuleClassGrid
	 * @param {} data
	 */
	initMCGridPanel : function(data) {
		var cfg = {
			title : 'Grid',
			region : 'south',
			connURL : 'RoleOwnGrid.do',
			gridType : 'GridPanel',
			pageSize : 30,
			height : 200,
			moduleID : this.moduleID,
			className : 'ModuleClass',
			scope : this,
			refreshGrids : [{grid:this.eastGrid,params:{sysroleid:'sysroleid',moduleid:'moduleid',classname:'classname'}}],
			RowChange : function(record){	
				Ext.each(this.refreshGrids,function(obj){//根据主ModuleClass刷新RoleModuleBtn页的Grid
					var param = obj.params;
					var p = new Object();
					//遍历ModuleClass Grid 参数，赋值给当前参数对象
					for(var item in param){
						p[param[item]] = record?record.json[item]:'';
					}
					obj.grid.setStoreParam(p,"update");
		        	obj.grid.reloadGrid();
		        },this);
		        this.initBtnStatus(record);
				this.fireEvent("afterRowChange",record);
			}
		};
		$import("app.harmony.system.Plugin.GridPanel");
		this.moduleClassGridPanel = eval("new app.harmony.system.Plugin.GridPanel(cfg)");
	},
	/**
	 * 设置由OtherTree刷新ModuleClassGrid的参数
	 * @return {}
	 */
	getOtherTreeRefreshMC : function(){         
		var list = new Array();
		var p = new Object();
		p['mid'] = 'moduleid';
		p['sysroleid'] = 'sysroleid';
		p['nodelevel'] = 'nodelevel';
		list.push({grid:this.moduleClassGridPanel,params:p});
		return list;
	},
	/**
	 * 刷新ModuleClassGrid
	 * @param {} node
	 * @param {} obj
	 */
	refreshMCGrid : function(node,obj){
		var grid = obj[0].grid;
		var params = obj[0].params;
		var p = new Object();
		if(node.isLeaf()){
			for(var item in params){
				p[params[item]] = node.attributes[item];
			}
		}
		grid.setStoreParam(p,'update');
		grid.reloadGrid('',0);
	},
	initPanelForTree : function(){
		this.centerPanel = new Ext.Panel({
			region:'center',
			width : 500,
			border : false,
			layout:'border',
			items : [this.perMenuTree,this.moduleClassGridPanel]
		});
		this.add(this.centerPanel);
	}
});