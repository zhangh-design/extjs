Ext.ns("app.harmony.system.Module.DevManage");
app.harmony.system.Module.DevManage.Operator = Ext.extend(app.harmony.system.Analytic.SysModule, {
	treeURL : 'DevManageTree.do',
	treeAction : 'department',
	treeTitle : '部门',
	treePRID : 'deptid',
	mainClassName : 'Operator',
	mainGridType : 'EditRowGrid',
	connURL : 'Operator.do',
	tabHeight : document.body.clientHeight*0.4,
	singleSelect : true,
	gridRowTBarJS : 'app.harmony.system.Module.DevManage.OperatorTBar',
	initTree : function(){     
		this.getDepID();
		app.harmony.system.Module.DevManage.Operator.superclass.initTree.call(this);
	},
	initTabData : function(data) {
		var tabs = [];
		tabs.push({
			tabTitle : '所属部门',
			region : 'center',
			connURL : 'OperatorDeptType.do',
			gridType : 'EditRowGrid',
			singleSelect : true,
			pageSize : 30,
			moduleID : this.moduleID,
			className : 'OperatorDept',
			tbarJS : 'app.harmony.system.BaseClass.GridRowTBar'
		});
		tabs.push({
			tabTitle : '人员角色',
			region : 'center',
			connURL : 'OperatorRole.do',
			gridType : 'EditRowGrid',
			pageSize : 30,
			moduleID : this.moduleID,
			className : 'OperatorRole',
			tbarJS : 'app.harmony.system.BaseClass.GridRowTBar'
		});
		tabs.push({
			tabTitle : '所属区域',
			region : 'center',
			connURL : 'OperatorArea.do',
			gridType : 'EditRowGrid',
			pageSize : 30,
			moduleID : this.moduleID,
			className : 'OperatorArea',
			tbarJS : 'app.harmony.system.BaseClass.GridRowTBar'
		});
		return tabs;
	},
	setRefreshGridParams : function(grid, index) {
		var p = {};
		p['rid'] = 'operatorid';
		return {grid: grid, params: p};
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
		 		action : 'getDepRootID',
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