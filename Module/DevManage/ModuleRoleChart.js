Ext.ns("app.harmony.system.Module.DevManage");
app.harmony.system.Module.DevManage.ModuleRoleChart = Ext.extend(app.harmony.system.Analytic.SysModule, {
	treeURL : 'ModuleTree.do',
	treeAction : 'module',
	treeTitle : '模块',
	centerPanel : null,
	chartTree : null,//模块菜单
	initFramePanel : function(){  
		this.initTree();//初始化SysModule的树
		this.addTreeListener();//添加树事件
		this.initOtherTree();//初始化加入的树
		this.initPanelForTree();//初始化存放自定义树Panel
	},
	getTreeRefresh : function(){         
		return null;
	},
	addTreeListener : function(){
		this.leftTree.addListener('click', function(node) {//左边书点击刷新右边树
			var moduleID = node.isLeaf()?node.id:'';
			this.chartTree.moduleID = moduleID;
			this.chartTree.addBaseParams(moduleID);
			this.chartTree.getRootNode().reload();
			this.chartTree.getRootNode().expand();
			this.chartTree.getRootNode().select();
	    },this);
	},
	initOtherTreeCfg : function(){			
		var cfg = {
			url : 'RoleTree.do',
			action : 'moduleHomePagePanel',
			rootVisible : this.treeRootVisible,
			width : '50%',
			region : 'center',
			rootText : '报表',
			rootID : '0',
			scope : this,
			isShowText : false,
			baseParams : ['id','leaf','moduleid'],
			moduleID : '',
			/**
			 * 树展开之前添加传到后台的参数.
			 */
			addBaseParams : function(moduleID){
				var params = this.baseParams;
				if(params) {
				    this.loader.on('beforeload', function(loader, node) {
				    	for(var i=0; i<params.length; i++) {
				    		if(params[i] == 'moduleid') {//判断如果参数名称是sysroelid则将左侧树点击的id传至后台
				    			this.baseParams['moduleid'] = moduleID;
				    		} else {
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
						params : {object : 'moduleRoleChartChecked',id : id, checked : checked,moduleid : this.moduleID,token : token},
						scope : this,
						callback : function(o,s,resp) {
							if(ajaxRequestFailure(resp.statusText)){
								return;
							}
							var respText = Ext.util.JSON.decode(resp.responseText);
							if(!respText.success) {
								alert(respText.erro);
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
	}
});