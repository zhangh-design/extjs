Ext.ns("app.harmony.system.Module.DevManage");
$import('app.harmony.system.Plugin.ComboBox');
app.harmony.system.Module.DevManage.RoleAuth = Ext.extend(app.harmony.system.Analytic.SysModule,{
	treeURL : 'DevManageTree.do', 
	treeAction : 'SelSysRole&token='+token,
	treeTitle : '',
	treeID:'0',
	perMenuTree : null,//权限菜单
	moduleTree : null,//可分配模块
	prefileData : null,
	moduleData : null,
	permissionsForm : null,
	initFramePanel : function(){      
		this.getRole();
		this.initFormPanel();
		this.initTree();
		this.initOtherTree();
		this.initPanelForTree();
		this.addTreeListener();
	},
	getTreeRefresh : function(){         
		return null;
	},
	getRole:function(){
		Ext.Ajax.request({
			url: this.treeURL,
		 	scope : this,
		 	async : false,
		 	params : {action:'getRoles',token:token},
		 	callback:function(o,s,resp){
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
	},
	initOtherTree : function(){
		//中央权限查看
		this.prefileData = new Ext.tree.TreeLoader({ url: this.treeURL+'?action=premissionsMenu&token='+token});
		this.prefileData.on('beforeload', function(loader, node) {
	        this.baseParams.id = node.attributes.id;
	        this.baseParams.nodelevel = node.attributes.nodelevel;
	    }, this.prefileData);
	    this.moduleData = new Ext.tree.TreeLoader({ url: this.treeURL+'?action=roleOtherModule&token='+token});
	    this.moduleData.on('beforeload', function(loader, node) {
	        this.baseParams.id = node.attributes.id;
	        this.baseParams.nodelevel = node.attributes.nodelevel;
	    }, this.moduleData);
	    this.perMenuTree = new Ext.tree.TreePanel({
			region: 'center',
			autoScroll:true,
			frame:false,
			width : 200,
	        root: new Ext.tree.AsyncTreeNode({
				id : '0',//默认的ID
				qtip : '权限菜单',
				text : '权限菜单'
		    }),
	        loader: this.prefileData
	    });
	    this.moduleTree = new Ext.tree.TreePanel({
			region: 'east',
			autoScroll:true,
			frame:false,
			width : 380,
	        root: new Ext.tree.AsyncTreeNode({
				id : '0',//默认的ID
				qtip : '可分配的系统菜单',
				text : '可分配的系统菜单'
		    }),
	        loader: this.moduleData
	    });
	    this.add(this.moduleTree);
	    this.addMenuTreeListener();
	},
	initPanelForTree : function(){
		this.centerPanel = new Ext.Panel({
			region:'center',
			width : 500,
			border : false,
			layout:'border',
			items : [this.perMenuTree,this.permissionsForm]
		});
		this.add(this.centerPanel);
	},
	//获取操作Form
	initFormPanel : function(){
		this.permissionsForm = new Ext.form.FormPanel({
			border : true,
			region : 'south',
			height : 200,
			bodyStyle: 'padding:100px;padding-top:10px;padding-bottom:0;',
			labelAlign:'right',
			labelWidth:75,width:140,
			defaults:{border:false,bodyStyle: 'padding-top:5px;',frame:false},
			items : [
			{xtype:'hidden',style:'margin:0;',fieldLabel:'记录ID',anchor:'100%',name:'value(ModuleID)'},
			{xtype:'hidden',style:'margin:0;',fieldLabel:'层级',anchor:'100%',name:'value(ModuleLevel)'},
			{xtype:'textfield',style:'margin:0;', width:190,fieldLabel: '模块名称',emptyText: '请选择名称',name: 'value(ModuleName)'},
			{xtype:'ux_combobox',style:'margin:0;width:190;', 
					name:'value(DataAuthID)',
					hiddenName:'value(DataAuthID)',
					fieldLabel:'数据权限',
					haveEmptyOption:false,
					forceSelection :true,
					hideLabel:false,
					width:180,
					tableName : 'mis_sys.v_dataAuthority'
			},
			{xtype:'ux_combobox',style:'margin:0;width:190;', 
					name:'value(OrgAuthID)',
					hiddenName:'value(OrgAuthID)',
					fieldLabel:'组织权限',
					haveEmptyOption:false,
					forceSelection :true,
					hideLabel:false,
					width:180,
					tableName : 'mis_sys.v_orgAuthority'
			}
	        ],
	        tbar : [{xtype:'button',text:'保存',btnid:'save',scope:this,disabled:true,handler:this.save},
	        		'->',{xtype:'button',btnid:'add',text:'添加菜单',disabled:true,scope:this,handler:this.addMenu},
	        			{xtype:'button',btnid:'remove',text:'移除菜单',disabled:true,scope:this,handler:this.delMenu}]
		});
		
	},
	addTreeListener : function(){
		this.leftTree.addListener('click', function(pnode) {
			this.clearFormValue();
			this.prefileData.on('beforeload', function(loader, node) {
		        this.baseParams.id = node.attributes.id;
		        this.baseParams.nodelevel = node.attributes.nodelevel;
		        this.baseParams.roleID = pnode.id;
		    }, this.prefileData);
			this.perMenuTree.loader = this.prefileData;
			this.perMenuTree.getRootNode().reload();
			this.perMenuTree.getRootNode().expand();
			this.moduleData.on('beforeload', function(loader, node) {
	    		this.baseParams.id = node.attributes.id;
	    		this.baseParams.nodelevel = node.attributes.nodelevel;
	    		this.baseParams.roleID = pnode.id;
			}, this.moduleData);
			this.moduleTree.loader = this.moduleData;
			this.moduleTree.getRootNode().reload();
			this.moduleTree.getRootNode().expand();
	    },this);
	},
	addMenuTreeListener : function(){
		this.perMenuTree.addListener('click', function(node) {
			node.isExpanded()?node.collapse():node.expand();
	    	this.setFormValue(node);
	    	if(node.id=='0'){
				this.setBtnStatus(true,'save');
				this.setBtnStatus(true,'remove');
			}
	    },this);
	    this.moduleTree.addListener('click', function(node) {
			node.isExpanded()?node.collapse():node.expand();
			if(!node.hasChildNodes()&&!node.isLeaf()){
				this.setBtnStatus(true,'add');
			}else{
				this.setBtnStatus(false,'add');
			}
	    },this);
	},
	setFormValue : function(node){
		var form = this.permissionsForm.getForm();
		form.findField("value(ModuleName)").setValue(node.text);
		form.findField("value(ModuleID)").setValue(node.id);
		form.findField("value(DataAuthID)").setValue(node.attributes.dataauthid||'0');
		form.findField("value(OrgAuthID)").setValue(node.attributes.orgauthid||'0');
		form.findField("value(ModuleLevel)").setValue(node.attributes.nodelevel||'0');
		this.setBtnStatus(false,'save');
		this.setBtnStatus(false,'remove');
	},
	clearFormValue : function(){
		var form = this.permissionsForm.getForm();
		form.findField("value(ModuleName)").setValue('');
		form.findField("value(ModuleID)").setValue('');
		form.findField("value(DataAuthID)").setValue('');
		form.findField("value(OrgAuthID)").setValue('');
		form.findField("value(ModuleLevel)").setValue('');
		this.setBtnStatus(true);
	},
	setBtnStatus : function(status,btnid){
		Ext.each(this.permissionsForm.topToolbar.items.items,function(btn){
			if(Ext.isEmpty(btnid)){
				btn.setDisabled(status);
			}else{
				if(btn.btnid==btnid)
					btn.setDisabled(status);
			}
		},this);
	},
	save : function(){
		var params = {
			SysRoleID : this.leftTree.getSelectionModel().getSelectedNode().id,
			DataAuthID : this.permissionsForm.getForm().findField("value(DataAuthID)").getValue(),
			OrgAuthID : this.permissionsForm.getForm().findField("value(OrgAuthID)").getValue(),
			ModuleID : this.permissionsForm.getForm().findField("value(ModuleID)").getValue(),
			ModuleLevel : this.permissionsForm.getForm().findField("value(ModuleLevel)").getValue()
		};
		Ext.Ajax.request({
			url : './RoleAuth.do?object=save&token='+token,
			params : params,
			scope : this,
			success: function(resp,opts) { 
				var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			this.perMenuTree.getRootNode().reload();
					this.perMenuTree.getRootNode().expand();
					this.perMenuTree.getSelectionModel().select(this.perMenuTree.getRootNode());
					this.setBtnStatus(true,'add');
					this.setBtnStatus(true,'remove');
		 		}
		 		else
		 			alert(respText.error);
			},
			failure: function(){
				alert("保存失败");
			}
		});
	},
	
	addMenu : function(){
		if(this.moduleTree.getSelectionModel().getSelectedNode()==null){
			alert("请在可分配菜单中选择要增加的菜单");
			return ;
		}
		if(this.leftTree.getSelectionModel().getSelectedNode()==null){
			alert("请选择要被增加的角色");
			return ;
		}
		var params = {
			SysRoleID : this.leftTree.getSelectionModel().getSelectedNode().id,
			ModuleID : this.moduleTree.getSelectionModel().getSelectedNode().id,
			ModuleLevel : this.moduleTree.getSelectionModel().getSelectedNode().attributes.nodelevel
		};
		Ext.Ajax.request({
			url : './RoleAuth.do?object=add&token='+token,
			params : params,
			scope : this,
			success: function(resp,opts) { 
				var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			this.perMenuTree.getRootNode().reload();
					this.perMenuTree.getRootNode().expand();
					this.perMenuTree.getSelectionModel().select(this.perMenuTree.getRootNode());
					this.moduleTree.getRootNode().reload();
					this.moduleTree.getRootNode().expand();
					this.moduleTree.getSelectionModel().select(this.moduleTree.getRootNode());
					this.setBtnStatus(true,'add');
		 		}else
					alert(respText.error);
			},
			failure: function(){
				alert("操作错误");
			}
		});
	},
	delMenu : function(){
		if(this.perMenuTree.getSelectionModel().getSelectedNode()==null){
			alert("请在权限菜单中选择要删除的菜单");
			return ;
		}
		Ext.Msg.confirm("提示：","移除此菜单会移除此角色下所有角色对此模块的权限，确定移除吗？",function(button,text){
			if (button=="yes"){
				var params = {
					SysRoleID : this.leftTree.getSelectionModel().getSelectedNode().id,
					ModuleID : this.perMenuTree.getSelectionModel().getSelectedNode().id,
					ModuleLevel : this.perMenuTree.getSelectionModel().getSelectedNode().attributes.nodelevel
				};
				Ext.Ajax.request({
					url : './RoleAuth.do?object=del&token='+token,
					params : params,
					scope : this,
					success: function(resp,opts) { 
						var respText = Ext.util.JSON.decode(resp.responseText);
				 		if(respText.success){
				 			var currentPerNode = this.perMenuTree.getSelectionModel().getSelectedNode();
							var perrentPerNode = this.perMenuTree.getSelectionModel().getSelectedNode().parentNode;
							perrentPerNode.removeChild(currentPerNode);
							this.perMenuTree.getRootNode().reload();
							this.perMenuTree.getRootNode().expand();
							this.perMenuTree.getSelectionModel().select(this.perMenuTree.getRootNode());
							this.moduleTree.getRootNode().reload();
							this.moduleTree.getRootNode().expand();
							this.moduleTree.getSelectionModel().select(this.moduleTree.getRootNode());
							this.setBtnStatus(true,'remove');
				 		}else
							alert(respText.error);
					},
					failure: function(){
						alert("操作失败");
					}
				});
			}
		},this);
	}
});