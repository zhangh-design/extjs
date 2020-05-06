Ext.ns("app.harmony.system.Module.DevManage");
app.harmony.system.Module.DevManage.SysRole = Ext.extend(app.harmony.system.Analytic.SysModule,{
	treeURL : 'DevManageTree.do', 
	treeAction : 'SelSysRole',
	treeTitle : '角色',
	mainClassName : 'SysRole',
	connURL : 'SysRole.do',
	mainGridDetailJS : 'app.harmony.system.Module.DevManage.SysRoleDetail',
	winHeight : 200,
	winWidth : 650,
	singleSelect : false,
	initTree : function(){     
		this.getRoleID();
		app.harmony.system.Module.DevManage.SysRole.superclass.initTree.call(this);
	},
	loadMarsk : new Ext.LoadMask(document.body,
	{
		msg : '正在加载，请稍候.....',
		removeMask : false
	}),
	getRoleID : function(){
		this.loadMarsk.show();
		Ext.Ajax.request({
			url: this.treeURL,
		 	scope : this,
		 	async : false,
		 	params :{
		 		action : 'getRoles',
		 		token : token
		 	},
		 	callback:function(o,s,resp){
		 		this.loadMarsk.hide();
		 		if(ajaxRequestFailure(resp.statusText))// 判断ajax调用是否失败
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
					var json = respText.data;
					if(json.length==1){
		 				this.treeTitle = json[0].text;
						this.treeID = json[0].id;
						this.treeAction='SelSysRole&token='+token;
		 			}else{
		 				this.treeRootVisible=false;
		 			}
		 		}
		 	}
		});
	}
});