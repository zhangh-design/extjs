Ext.ns("app.harmony.system.Module.DevManage");
app.harmony.system.Module.DevManage.OprtModuleOrg = Ext.extend(app.harmony.system.Analytic.SysModule,{
	treeURL : 'DevManageTree.do',
	treeAction : 'OprtRoleMenu',
	treeTitle : '超级管理员',
	connURL : 'OprtModuleOrg.do',
	moduleTree : null,
	deptTree : null,
	initFramePanel : function(data){
		this.initTree();
		this.initModuleTree();
		this.initDeptTree();
		this.addListener();
	},
	leftTreeClick : function(pnode,b,c){
		if(!pnode.isLeaf()){
			this.moduleTree.loader.on('beforeload', function(loader, node) {
		        this.baseParams.id = node.attributes.id;
		        this.baseParams.nodelevel = node.attributes.nodelevel;
		        this.baseParams.roleid = '';
		        this.baseParams.oprtid = '';
		    }, this.moduleTree.loader);
		    this.moduleTree.getRootNode().reload();
			return;
		}
		this.moduleTree.loader.on('beforeload', function(loader, node) {
	        this.baseParams.id = node.attributes.id;
	        this.baseParams.nodelevel = node.attributes.nodelevel;
	        this.baseParams.roleid = pnode.attributes.roleid;
	        this.baseParams.oprtid = pnode.attributes.oprtid;
	    }, this.moduleTree.loader);
		this.moduleTree.getRootNode().reload();
		this.moduleTree.getRootNode().expand();
	},
	moduleTreeClick : function(pnode,b,c){
		if(!pnode.isLeaf()){
			this.deptTree.loader.on('beforeload', function(loader, node) {
		        this.baseParams.id = node.attributes.id;
		        this.baseParams.nodelevel = node.attributes.nodelevel;
		        this.baseParams.roleid = '';
		        this.baseParams.oprtid = '';
		        this.baseParams.moduleid = '';
		    }, this.deptTree.loader);
		    this.deptTree.getRootNode().reload();
			return;
		}
		this.deptTree.loader.on('beforeload', function(loader, node) {
	        this.baseParams.id = node.attributes.id;
	        this.baseParams.nodelevel = node.attributes.nodelevel;
	        this.baseParams.roleid = pnode.attributes.roleid;
	        this.baseParams.oprtid = pnode.attributes.oprtid;
	        this.baseParams.moduleid = pnode.attributes.id;
	    }, this.deptTree.loader);
		this.deptTree.getRootNode().reload();
		this.deptTree.getRootNode().expand();
	},
	addListener : function(){
		this.leftTree.on('click', this.leftTreeClick,this);
		this.moduleTree.on('click', this.moduleTreeClick,this);
	},
	initDeptTree : function(){
		var cfg = {
			url : this.treeURL,
			action : 'RoleDepartment',
			width : 400,
			minWidth :400,
			region : 'east',
			nodemenu : new Ext.menu.Menu(),
			rootText : '部门',
			rootID : '0',
			rootVisible : true,
			isShowText : false,
			tbar : [{text:'保存',scope:this,handler:this.save}]
		};
		this.deptTree = new app.harmony.system.BaseClass.GridTree(cfg);//生成树对象
		this.add(this.deptTree);
	},
	initModuleTree : function(){
		var cfg = {
			url : this.treeURL,
			action : 'RoleModule',
			region : 'center',
			rootText : '模块',
			nodemenu : new Ext.menu.Menu(),
			rootVisible : true,
			isShowText : false,
			rootID : '0'
		};
		this.moduleTree = new app.harmony.system.BaseClass.GridTree(cfg);//生成树对象
		this.add(this.moduleTree);
	},
	save : function(){
		var selNodes = this.deptTree.getChecked();
		var rids = '0',oprtid='',roleid='',moduleid='';
		Ext.each(selNodes,function(node){
			rids +=","+node.attributes.id;
			oprtid = node.attributes.oprtid;
			roleid = node.attributes.roleid;
			moduleid= node.attributes.moduleid;
		},this);
		Ext.Ajax.request({
			url: this.connURL,  
		 	params:{object : "saveData",moduleid:moduleid,roleid:roleid,token:token,oprtid:oprtid,rids:rids},
		 	scope : this,
		 	callback:function(o,s, resp){
		 		//先判断与ajax与后台交互是否成功
		 		if(ajaxRequestFailure(resp.statusText))
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			alert(respText.data);
		 		}else{
		 			alert(respText.error);
		 		}
		 	}
		});
	},
	getTreeRefresh : function(){         
		return null;
	}
});