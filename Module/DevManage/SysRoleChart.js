Ext.ns("app.harmony.system.Module.DevManage");
app.harmony.system.Module.DevManage.SysRoleChart = Ext.extend(app.harmony.system.Analytic.SysModule, {
	treeURL : 'RoleTree.do',
	treeAction : 'role',
	treeTitle : '超级管理员',
	treeID : '0',
	centerPanel : null,
	chartTree : null,//模块菜单
	loadMarsk : new Ext.LoadMask(document.body,{msg : '正在加载，请稍候.....',removeMask : false}),
	initFramePanel : function(){  
		this.getRoleID();
		this.initTree();//初始化SysModule的树
		this.initOtherTree();//初始化加入的树
		this.initPanelForTree();//初始化存放自定义树Panel
		this.addTreeListener();//添加树事件
		this.leftTree.nodemenu.remove(1);
	},
	getTreeRefresh : function(){         
		return null;
	},
	addTreeListener : function(){
		this.leftTree.addListener('click', function(node) {//左边书点击刷新右边树
			var sysRoleID = node.id;
			this.chartTree.sysRoleID = node.id;
			this.chartTree.addBaseParams(sysRoleID);
			this.chartTree.getRootNode().reload();
			this.chartTree.getRootNode().expand();
			this.chartTree.getRootNode().select();
	    },this);
	},
	initOtherTreeCfg : function(){			
		var cfg = {
			url : this.treeURL,
			action : 'roleHomePagePanel',
			rootVisible : true,
			width : '50%',
			region : 'center',
			rootText : '报表',
			rootID : '0',
			scope : this,
			baseParams : ['id','leaf','sysroleid'],
			isShowText : false,
			sysRoleID : '0',
			/**
			 * 树展开之前添加传到后台的参数.
			 */
			addBaseParams : function(sysRoleID){
				var params = this.baseParams;
				if(params) {
				    this.loader.on('beforeload', function(loader, node) {
				    	for(var i=0; i<params.length; i++) {
				    		if(params[i] == 'sysroleid') {//判断如果参数名称是sysroelid则将左侧树点击的id传至后台
				    			this.baseParams['sysroleid'] = sysRoleID;
				    		}else {
								this.baseParams[params[i]] = node.attributes[params[i]];		    		
				    		}
						}
				    }, this.loader);
				}
			},
			listeners : {
				checkchange : function(node, checked) {
					var checked = node.attributes.checked;
					var id = node.attributes.id;
					Ext.Ajax.request({
						url : 'SysRoleChart.do',
						params : {object : 'sysRoleChartChecked',id : id, checked : checked,sysroleid : this.sysRoleID,token : token},
						scope : this,
						callback : function(o,s,resp) {
							if(ajaxRequestFailure(resp.statusText)){
								return;
							}
							var respText = Ext.util.JSON.decode(resp.responseText);
							if(!respText.success) {
								alert(respText.error);
							}
						}
					});
				}
			} 
		};
		return cfg;
	},
	/**
	 * 生成报表树对象
	 */
	initOtherTree : function(){               
		if(!this.isShowTree)
			return;
		$import("app.harmony.system.BaseClass.GridTree");//加载树对象js
		this.chartTree = new app.harmony.system.BaseClass.GridTree(this.initOtherTreeCfg());//生成树对象
		this.add(this.chartTree);
	},
	initPanelForTree : function(){
		this.centerPanel = new Ext.Panel({
			region:'center',
			width : 500,
			border : false,
			layout:'border',
			items : [this.chartTree]
		});
		this.add(this.centerPanel);
	},
	getRoleID : function(){
		this.loadMarsk.show();
		Ext.Ajax.request({
			url: this.treeURL,  
		 	scope : this,
		 	async : false,
		 	params : {
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
						this.treeAction='role&token='+token;
		 			}else{
		 				this.treeRootVisible=false;
		 			}
		 		}
		 	}
		});
	}
});