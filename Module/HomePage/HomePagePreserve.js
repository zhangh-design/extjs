Ext.ns("app.harmony.system.Module.HomePage");
$import('app.harmony.system.BaseClass.DetailPanel');
app.harmony.system.Module.HomePage.HomePagePreserve = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.HomePage.HomePagePreserve.superclass.constructor.call(this, config);
};
/**
 * 
 * @class app.harmony.system.Module.HomePage.HomePagePreserve
 * @extends app.harmony.system.Analytic.SysModule
 */
Ext.extend(app.harmony.system.Module.HomePage.HomePagePreserve,app.harmony.system.Analytic.SysModule,{
	treeURL : 'ModuleTree.do',
	treeAction : 'report',
	treeTitle : '报表分类',
	connURL : './HomePagePreserveSub.do',
	tabHeight : document.body.clientHeight*0.4,
	mainClassName : 'HomePageSub',
	mainGridDetailJS : 'app.harmony.system.Module.HomePage.HomePageSubDetail',
	gridTBarJS : 'app.harmony.system.Module.HomePage.HomePageSubTBar',
	winWidth : 700,
	winHeight : 500,
	detailPanel:null,
	Grids	: new Array(),
	initTree : function(){          
		app.harmony.system.Module.HomePage.HomePagePreserve.superclass.initTree.call(this);
	},
	getTreeRefresh : function(){
		var list = [];
		var p = {};
		p['id'] = 'prid';
		p['qryfield'] = 'qryfield';
		list.push({grid:this.mainGrid,params:p});
		return list;
	},
	initData : function(data){                    
		var tabs = new Array();
		tabs.push({
			tabTitle:'报表分类',
			region : 'center',
			connURL : '/HomePagePreserve.do',
			gridType : 'GridPanel',
			pageSize : 30,
			winWidth : 480,
			winHeight : 300,
			moduleID : this.moduleID,
			isSearchBbar : true,
			className : 'HomePage',
			detailURL : 'app.harmony.system.Module.HomePage.HomePageDetail',
			refreshGrids : this.getRefreshGrids()
			}
		);
		return tabs;
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
		
		var mains = this.initData();
		if(mains.length<1)
			return;
		this.detailPanel = new Ext.TabPanel({
			region : 'center',
			style : 'padding:0 1 1 1'
		});
		this.detailPanel.on('tabchange',function(tab,item){
			var index = tab.items.indexOf(item);
			this.refreshGrid(item,index);
		},this);
		this.detailPanel.add({title:'报表数据',autoScroll:true,layout:'border',items:[this.centerPanel]});
		this.initGrid(mains);
		this.add(this.detailPanel);
	},
	refreshGrid : function(item,index){
		var Grid = item.items.items[0];
		var p = new Object();
		p['index'] = index;//index需替换成别的
		if(index=='0')
			return;
		this.Grids[0].setStoreParam(p,"update");
        this.Grids[0].reloadGrid();
	},
	/**
	 * 生成Tab的Grid参数
	 */
	initGridCfg : function(tab){             
		var cfg = {region:'center'};
		Ext.apply(cfg,tab);
		return cfg;
	},
	/**
	 * 生成Tab的Grid
	 */
	initGrid : function(tabs){                
		Ext.each(tabs,function(tab){
			var cfg = this.initGridCfg(tab);
			$import("app.harmony.system.Plugin."+tab.gridType);
			var Grid = eval("new app.harmony.system.Plugin."+tab.gridType+"(cfg)");
			this.Grids.push(Grid);
			this.detailPanel.add({title:tab.tabTitle,autoScroll:true,layout:'border',items:[Grid]});
		},this);
		this.setActiveTab.defer(100,this);
	},
	setActiveTab : function(number){
		if(Ext.isEmpty(number))
			number = 0;
		this.detailPanel.setActiveTab(number);
		this.detailPanel.doLayout();
	},
	initTabData : function(data){                    
		var tabs = new Array();
		tabs.push({
			tabTitle:'查询条件',
			region : 'center',
			connURL : '/HomePagePreserveCond.do',
			gridType : 'GridPanel',
			pageSize : 30,
			winWidth : 480,
			winHeight : 400,
			moduleID : this.moduleID,
			isSearchBbar : true,
			className : 'HomePageCond',
			detailURL : 'app.harmony.system.Module.HomePage.HomePageCondDetail'
			}
		);
		return tabs;
	},
	setRefreshGridParams : function(grid,index){		
		var p = new Object();
		p['rid'] = 'prid';
		return {grid:grid,params:p};
	}
	
});
