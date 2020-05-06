Ext.ns("app.harmony.system.Module.PadSynchro");
$import('app.harmony.system.BaseClass.DetailPanel');
app.harmony.system.Module.PadSynchro.PadSynchro = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.PadSynchro.PadSynchro.superclass.constructor.call(this, config);
};
/**
 * 
 * @class app.harmony.user.WorkPaper.PlanQry.PlanQry
 * @extends app.harmony.system.Analytic.SysModule
 */
Ext.extend(app.harmony.system.Module.PadSynchro.PadSynchro,app.harmony.system.Analytic.SysModule,{
	treeTitle : '用户表',
	treeURL : '/View/PadTableTree.do', 
	treeAction : 'padTable', 
	/** 树的宽度 */
	treeWidth : 350, 
	connURL : '/PadFieldSynchro.do',
	mainClassName : 'PadFieldSynchro',
	fieldGrid : null,
	pdafieldGrid : null,
	initMainGridCfg : function(){
		this.initOtherPanel();
		var cfg = {title:'对应表字段',region : 'north',height : document.body.clientHeight*0.5};
		Ext.applyIf(cfg,app.harmony.system.Module.PadSynchro.PadSynchro.superclass.initMainGridCfg.call(this));
		return cfg;
	},
	initOtherPanel : function(){
		var cfg  = {
				region : 'center',
				connURL : '/PadTableField.do',
				gridType : this.mainGridType,
				pageSize : 1000,
				moduleID : this.moduleID,
				className : 'PadTableField',
				isHiddenBBar : true,
				isKeyFind : true,
				isSearchBbar : false,
				title:'PDA字段列表'
			};
		$import("app.harmony.system.Plugin."+this.mainGridType);
		this.pdafieldGrid = eval("new app.harmony.system.Plugin."+this.mainGridType+"(cfg)");
		var cfg  = {
				region : 'west',
				connURL : '/LocalTableField.do',
				gridType : this.mainGridType,
				pageSize : '1000',
				moduleID : this.moduleID,
				className : 'PadTableField',
				isHiddenBBar : true,
				isKeyFind : true,
				isSearchBbar : false,
				title:'本地字段列表',
				width : document.body.clientWidth*0.4
			};
		$import("app.harmony.system.Plugin."+this.mainGridType);
		this.fieldGrid = eval("new app.harmony.system.Plugin."+this.mainGridType+"(cfg)");
	},
	initPanel : function(){
		this.centerPanel = new Ext.Panel({
			region:'center',
			border : false,
			layout:'border',
			items : [this.mainGrid,this.fieldGrid,this.pdafieldGrid]
		});
		if(!Ext.isEmpty(this.detailTabPanel))
			this.centerPanel.add(this.detailTabPanel);
		this.add(this.centerPanel);
		this.addOtherListen();
	},
	addOtherListen : function(){
		this.fieldGrid.on('afterRowDblClick',this.afterRowDblClick,this);
	},
	afterRowDblClick : function (r){
		var padRecord=this.pdafieldGrid.getSelectionModel().getSelected();
		var record=this.fieldGrid.getSelectionModel().getSelected();
		if(Ext.isEmpty(padRecord)||Ext.isEmpty(record))
			return;
		Ext.Ajax.request({
			url : this.connURL,
			params : {object:'updateField',
					  tablefield : record.data.column_name,
					  padfield : padRecord.data.column_name,
					  fieldtype : record.data.data_type,
					  padfieldtype : padRecord.data.data_type,
					  fieldlength : record.data.data_length,
					  padfieldlength : padRecord.data.data_length,
					  pid : this.leftTree.getSelectionModel().selNode.attributes.pid,
					  token:token},
			scope : this,
			callback : function(o,s,resp){
				if(ajaxRequestFailure(resp.statusText)){
					return;
				}
				var respText = Ext.util.JSON.decode(resp.responseText);
				if(respText.success){
					this.pdafieldGrid.reloadGrid();
					this.fieldGrid.reloadGrid();
					this.mainGrid.reloadGrid();
				}
			}
		});
	},
	initTree : function(){     
		app.harmony.system.Module.PadSynchro.PadSynchro.superclass.initTree.call(this);
		this.leftTree.on("afterAddMenu",this.addTreeMenu,this);
	},
	addTreeMenu : function(tree){
		tree.nodemenu.addItem({										//给树节点右键添加刷新菜单
			text:'添加',
			scope:this,
			handler:function(){
				this.openTableWin(tree.nodemenu.node);
			}
		});
	},
	openTableWin : function(node){
		$import("app.harmony.system.Module.PadSynchro.Window");
		var cfg={
				tablename : node.attributes.tablename,
				localtablename : node.attributes.localtablename,
				pid : node.attributes.pid,
				moduleID : this.moduleID,
				className : 'PadTableSynchro',
				PTree : this.leftTree
		};
		var window=new app.harmony.system.Module.PadSynchro.Window(cfg);
		window.show();
	},
	/**
	 * 获取树刷新的对象
	 */
	getTreeRefresh : function(){         
		var list = new Array();
		var p = new Object();
		p['tablename'] = 'tablename';
		var p1 = new Object();
		p1['localtablename'] = 'localtablename';
		list.push({grid:this.mainGrid,params:p});
		list.push({grid:this.fieldGrid,params:p1});
		list.push({grid:this.pdafieldGrid,params:p});
		return list;
	}
	
});
