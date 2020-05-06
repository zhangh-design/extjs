Ext.ns("app.harmony.system.Analytic");
$import("app.harmony.system.Plugin.ComboBox");
app.harmony.system.Analytic.SysModule = Ext.extend(Ext.Panel,{  
	/********************** Begin 树的参数 *************************/
	/** 是否显示树 */
	isShowTree : true,                   
	/** 树的URL地址 */
	treeURL : '', 
	/** 树的调用方法 */
	treeAction : '',   
	/** 显示树的根节点 */
	treeRootVisible : true,              
	/** 树的布局 */
	treeRegion : 'west',                 
	/** 树的宽度 */
	treeWidth : 200,                     
	/** 树根目录名称 */
	treeTitle : '目录',                   
	/** 树根目录的ID */
	treeID : '0',                        
	/** 树关联主Grid的字段 */
	treePRID : 'prid',                   
	/********************** End 树的参数 **************************/
	/********************** Begin 模块信息 ************************/
	/** 当前模块ID */
	moduleID : '',            
	gridModuleID : null,
	/** 连接Action的URL */
	connURL : '',                        
	/** 主键，多个逗号隔开 */
	primaryKey : 'rid',                  
	/** 页面是否只读 */
	isReadOnly : false,                 
	/** 只显示添加、删除按钮 */
	onlyShowAddAndDel : false,          
	/** tab的高度 */
	tabHeight : 200,                     
	/********************** End 模块信息 **************************/
	/********************** Begin 面板属性 ************************/
	/** Panel内容布局 */
	layout : 'border',                   
	/** Panel的布局 */
	region : 'center',    
	border : false,
	/********************** End 面板属性 ************************/
	/********************** Begin 生成面板 ************************/
	/** 左边树 */
	leftTree : null,                     
	/** 主Grid */
	mainGrid : null,         
	/** tab页Grid集合 */
	tabGrids : new Array(),              
	/** Grid类型 */
	mainGridType : 'GridPanel',    
	/** 主Grid详情页明细加载JS */
	mainGridDetailJS : '',   			 
	/** 主Grid加载的className */
	mainClassName : 'example',
	/** 默认按钮栏JS地址,用于详情页添加 */
	gridTBarJS : 'app.harmony.system.BaseClass.GridTBar',
	/** 单元格编辑按钮栏JS地址 */
	gridCellTBarJS : 'app.harmony.system.BaseClass.GridCellTBar',
	/** 行编辑按钮栏JS地址 */
	gridRowTBarJS : 'app.harmony.system.BaseClass.GridRowTBar',
	mainForceFit : true,
	pageSize : 30,
	/** 自定义按钮栏JS地址 */
	definedTBarJS : 'app.harmony.system.BaseClass.GridDefinedTBar',
	/** 是否检索按钮，生成按钮栏按钮 */
	isSearchBbar : true,
	gridKey : 'rid',
	isKeyFind : false,
	/**是否多选 */
	singleSelect : true,
	/** 存放Tab的Panel */
	detailTabPanel : null,   
	/** 主面板 */
	centerPanel : null,
	/**
	 * 获取树刷新的对象
	 */
	getTreeRefresh : function(){         
		var list = new Array();
		var p = new Object();
		p['id'] = this.treePRID;
		list.push({grid:this.mainGrid,params:p});
		return list;
	},
	/**
	 * 生成树参数
	 */
	initTreeCfg : function(){			
		var cfg = {
			url : this.treeURL,
			action : this.treeAction,
			rootVisible : this.treeRootVisible,
			width : this.treeWidth,
			region : this.treeRegion,
			rootText : this.treeTitle,
			rootID : this.treeID,
			refreshGrids : this.getTreeRefresh()
		};
		return cfg;
	},
	/**
	 * 生成树对象
	 */
	initTree : function(){               
		if(!this.isShowTree)
			return;
		$import("app.harmony.system.BaseClass.GridTree");//加载树对象js
		this.leftTree = new app.harmony.system.BaseClass.GridTree(this.initTreeCfg());//生成树对象
		this.add(this.leftTree);
	},
	/**
	 * 选中树根节点
	 */
	initSelectTreeNode : function(){
		if(!this.leftTree)
			return;
		this.leftTree.addListener('load', function(node) {
    		if(this.mainGrid){
	    		if(this.leftTree.rootVisible){
					node.select();   
					var param = {};
					param[this.treePRID] = node.id;
    				this.mainGrid.setStoreParam(param,'update');
    				this.mainGrid.reloadGrid();
    			}
	    	}
    	},this);
	},
	/**
	 * 根据tabGrids里存放的Grid制定主Grid点击后刷新的事件
	 */
	getRefreshGrids : function(){		 
		var list = new Array();
		Ext.each(this.tabGrids,function(grid,index){
			list.push(this.setRefreshGridParams(grid,index));
		},this);
		return list;
	},
	/**
	 * 设置tabGrids里存放的Grid对应主Grid的参数对照
	 */
	setRefreshGridParams : function(grid,index){		
		var p = new Object();
		p['rid'] = 'prid';
		return {grid:grid,params:p};
	},
	getGridTBarJS : function(){
		if(this.mainGridType=="GridPanel")
			return this.gridTBarJS;
		if(this.mainGridType=="EditRowGrid")
			return this.gridRowTBarJS;
		if(this.mainGridType=="EditCellGrid")
			return this.gridCellTBarJS;
	},
	/**
	 * 生成主Grid参数
	 */
	initMainGridCfg : function(){        
		var cfg = {
			region : 'center',
			connURL : this.connURL,
			gridType : this.mainGridType,
			pageSize : this.pageSize,
			moduleID : this.moduleID,
			ForceFit : this.mainForceFit,
			gridModuleID : this.gridModuleID||this.moduleID,
			className : this.mainClassName,
			detailURL : this.mainGridDetailJS,
			winHeight : this.winHeight,
			winWidth : this.winWidth,
			tbarJS : this.getGridTBarJS(),
			singleSelect : this.singleSelect,
			isSearchBbar : this.isSearchBbar,
			isKeyFind : this.isKeyFind,
			primaryKey : this.gridKey,
			definedTBarJS : this.definedTBarJS,
			refreshGrids : this.getRefreshGrids()
		};
		return cfg;
	},
	/**
	 * 生成主Grid对象
	 */
	initMainGrid : function(){          
		var cfg = this.initMainGridCfg();
		$import("app.harmony.system.Plugin."+this.mainGridType);
		this.mainGrid = eval("new app.harmony.system.Plugin."+this.mainGridType+"(cfg)");
	},
	initPanel : function(){
		this.centerPanel = new Ext.Panel({
			region:'center',
			border : false,
			layout:'border',
			items : [this.mainGrid]
		});
		if(!Ext.isEmpty(this.detailTabPanel))
			this.centerPanel.add(this.detailTabPanel);
		this.add(this.centerPanel);
	},
	/**
	 * 生成Tab页数据
	 */
	initTabData : function(data){                    
		var tabs = new Array();
		/*tabs.push({
			tabTitle:'例子',
			region : 'center',
			connURL : this.connURL,
			gridType : this.mainGridType,
			pageSize : this.pageSize,
			moduleID : this.moduleID,
			className : this.mainClassName,
			detailURL : this.mainGridDetailJS,
			tbarJS : this.gridTBarJS,
			refreshGrids:null}
		);*/
		return tabs;
	},
	/**
	 * 存放Tab页的面板
	 */
	initTabPanel : function(data){                   
		var tabs = this.initTabData(data);
		if(tabs.length<1)
			return;
		this.detailTabPanel = new Ext.TabPanel({
			region : 'south',
			style : 'padding:0 1 1 1',
			height: this.tabHeight
		});
		this.initTabGrid(tabs);
	},
	/**
	 * 生成Tab的Grid参数
	 */
	initTabGridCfg : function(tab){             
		var cfg = {region:'center'};
		Ext.apply(cfg,tab);
		return cfg;
	},
	/**
	 * 生成Tab的Grid
	 */
	initTabGrid : function(tabs){                
		Ext.each(tabs,function(tab){
			var cfg = this.initTabGridCfg(tab);
			$import("app.harmony.system.Plugin."+tab.gridType);
			var tabGrid = eval("new app.harmony.system.Plugin."+tab.gridType+"(cfg)");
			this.tabGrids.push(tabGrid);
			this.detailTabPanel.add({title:tab.tabTitle,autoScroll:true,layout:'border',items:[tabGrid]});
		},this);
		this.setTabActiveTab.defer(100,this);
	},
	setTabActiveTab : function(number){
		if(Ext.isEmpty(number))
			number = 0;
		this.detailTabPanel.setActiveTab(number);
		this.detailTabPanel.doLayout();
	},
	/**
	 * 生成主面板
	 */
	initFramePanel : function(data){        
		this.initTabPanel(data);
		this.initMainGrid(data);
		this.initTree();
		this.initPanel();
		this.mainGrid.on('WFValidate',this.WFValidate,this);
	},
	/**
	 * 面板渲染后
	 */
	afterRender : function(){
		app.harmony.system.Analytic.SysModule.superclass.afterRender.call(this);
		this.doMainGridreload.defer(300,this);
	},
	doMainGridreload : function(){
		if(!this.leftTree)
			this.mainGrid.reloadGrid();
	},
	/**
	 * Panel初始化完成
	 */
	initComponent : function(){  
		app.harmony.system.Analytic.SysModule.superclass.initComponent.call(this);
		this.initFramePanel();
		this.initSelectTreeNode();
	},
	/**
	 * 流程验证信息
	 */
	WFValidate : function(grid,record,action){
		return false;
	}
	/********************** End 生成面板 **************************/
});