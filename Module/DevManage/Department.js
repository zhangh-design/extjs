Ext.ns("app.harmony.system.Module.DevManage");
app.harmony.system.Module.DevManage.Department = Ext.extend(app.harmony.system.Analytic.SysModule,{
	treeURL : 'DevManageTree.do',
	treeAction : 'department',
	treeTitle : '部门',
	treeID : '0',
	mainClassName : 'Department',
	connURL : 'Department.do',
	mainGridType : 'EditRowGrid',
	gridRowTBarJS : 'app.harmony.system.Module.DevManage.GridDeptRowTBar',
	initTree : function(){     
		this.getDepID();
		app.harmony.system.Module.DevManage.Department.superclass.initTree.call(this);
	},
	initTabData : function(data){                    
		var tabs = new Array();
		tabs.push({
			tabTitle:'部门属性',
			region : 'center',
			connURL : 'DeptType.do',
			gridType : 'EditRowGrid',
			pageSize : 30,
			moduleID : this.moduleID,
			className : 'DeptType',
			tbarJS : "app.harmony.system.BaseClass.GridRowTBar"}
		);
		return tabs;
	},
	setRefreshGridParams : function(grid,index){		
		var p = new Object();
		p['rid'] = 'deptid';
		return {grid:grid,params:p};
	},
	loadMarsk : new Ext.LoadMask(document.body,
		{
			msg : '正在加载，请稍候.....',
			removeMask : false
		}),
	getDepID:function(){
		this.loadMarsk.show();
		Ext.Ajax.request({
			url: this.treeURL,  
		 	scope : this,
		 	async : false,
		 	params : {
		 		action :'getDepRootID',
		 		token : token
		 	},
		 	callback:function(o,s,resp){
		 		this.loadMarsk.hide();
		 		if(ajaxRequestFailure(resp.statusText))// 判断ajax调用是否失败
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
					var json = respText.data;
					this.treeTitle = json.rootName;
					this.treeID = json.rootID;
					this.treeAction='department&token='+token;
		 		}
		 	}
		});
	}
});