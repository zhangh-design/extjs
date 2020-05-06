Ext.ns("app.harmony.system.Module.DevManage");
app.harmony.system.Module.DevManage.Module = Ext.extend(app.harmony.system.Analytic.SysModule,{
	treeURL : 'DevManageTree.do',
	treeAction : 'module',
	treeTitle : '系统',
	mainClassName : 'SubSystem',
	gridTBarJS : 'app.harmony.system.Module.DevManage.ModuleGridTBar',
	mainGridDetailJS : 'app.harmony.system.Module.DevManage.SubSystemDetail',
	winHeight : 230,
	winWidth : 650,
	connURL : 'ModuleLevZero.do',
    isKeyFind : true,
	initTree : function(){          
		app.harmony.system.Module.DevManage.Module.superclass.initTree.call(this);
		this.leftTree.on('click', function(node) {
			this.changeGrid(node);
	    },this);
	},
	changeGrid : function(node){
		if(node.attributes.id==0) {
			this.connURL = 'ModuleLevZero.do';
			this.mainClassName = 'SubSystem';
			this.mainGrid.detailURL = "app.harmony.system.Module.DevManage.SubSystemDetail";
			this.mainGrid.connURL = "ModuleLevZero.do";
		}else if(node.attributes.id.length==2){
			this.connURL = 'ModuleLevOne.do';
			this.mainClassName = 'ModuleClass';
			this.mainGrid.detailURL = "app.harmony.system.Module.DevManage.ModuleClassDetail";
			this.mainGrid.connURL = "ModuleLevOne.do";
		}else if(node.attributes.id.length==4){
			this.connURL = 'ModuleLevTwo.do';
			this.mainClassName = 'Module';
			this.mainGrid.detailURL = "app.harmony.system.Module.DevManage.ModuleDetail";
			this.mainGrid.connURL = "ModuleLevTwo.do";
			this.mainGrid.winHeight = 270;
			this.mainGrid.winWidth = 900;
		}
		this.analyticalXML(node);
	},
	analyticalXML : function(node){
		Ext.Ajax.request({
			async : false,
			url: this.connURL,  
		 	params:{object : "readGridXML",gridModuleID:this.moduleID,moduleID : this.moduleID,className:this.mainClassName,singleSelect:this.singleSelect,gridType:'GridPanel',token:token},
		 	scope : this,
		 	callback:function(o,s, resp){
		 		if(ajaxRequestFailure(resp.statusText))//判断ajax调用是否失败
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			//返回成功，则逐一初始化Grid, Store参数, 工具栏
		 			var fields = eval(respText.field);
					var columns = eval(respText.column);
					var store = new Ext.data.JsonStore({ 
					    root : 'root', 
					    totalProperty : 'totalProperty', 
					    fields : fields, 
					    remoteSort:true,
					    proxy : new Ext.data.HttpProxy(new Ext.data.Connection({url:this.connURL+"?object=read&moduleID="+this.moduleID+"&className="+this.mainClassName+"&token="+token,timeout:this.timeOut}))
					});
					this.mainGrid.reconfigure(store,new Ext.grid.ColumnModel(columns));
					this.mainGrid.getBottomToolbar().bind(store);
					var p = new Object();
					p['id'] = this.treePRID;
					var obj = {grid:this.mainGrid,params:p};
					this.refreshGrid(node,obj);
		 		}else{
		 			alert(respText.error);
		 		}
		 	}
		});
	},
	refreshGrid : function(node,obj){
		var grid = obj.grid;
		var params = obj.params;
		var p = new Object();
		for(var item in params){
			p[params[item]] = node.attributes[item];
		}
		grid.setStoreParam(p,'update');
		grid.reloadGrid('',0);
	}
});