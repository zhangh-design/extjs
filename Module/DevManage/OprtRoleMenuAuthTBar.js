Ext.ns("app.harmony.system.Module.DevManage");
$import('app.harmony.system.BaseClass.GridDefinedTBar');
app.harmony.system.Module.DevManage.OprtRoleMenuAuthTBar = Ext.extend(app.harmony.system.BaseClass.GridDefinedTBar, {   
	query_e : function(){
		this.initParams();
		this.grid.reloadGrid();
	},
	initParams : function(){
		var store = this.grid.getStore();
		var operatorName = Ext.getCmp('operatorName').getValue();
		var sysRoleName = Ext.getCmp('sysRoleName').getValue();
		var menuName = Ext.getCmp('menuName').getValue();
		var deptName = Ext.getCmp('deptName').getValue();
		
		store.setBaseParam('operatorName', operatorName);
		store.setBaseParam('sysRoleName', sysRoleName);
		store.setBaseParam('menuName', menuName);
		store.setBaseParam('deptName', deptName);
	},
	initDefinedTBar : function(){
		this.add(new Ext.form.Label({
			text : '人员',
			width : 40,
			style : 'text-align:right;font-weight:bolder;'
		}));
		this.add(new Ext.form.TextField({
			style:'margin:0;',
			anchor:'100%',
			id:'operatorName',
		    width:140
		}));
		this.add(new Ext.form.Label({
			text : '角色',
			width : 40,
			style : 'text-align:right;font-weight:bolder;'
		}));
		this.add(new Ext.form.TextField({
			style:'margin:0;',
			anchor:'100%',
			id:'sysRoleName',
		    width:140
		}));
		
		this.add(new Ext.form.Label({
			text : '操作模块',
			width : 40,
			style : 'text-align:right;font-weight:bolder;'
		}));
		this.add(new Ext.form.TextField({
			style:'margin:0;',
			anchor:'100%',
			id:'menuName',
		    width:140
		}));this.add(new Ext.form.Label({
			text : '访问范围',
			width : 40,
			style : 'text-align:right;font-weight:bolder;'
		}));
		this.add(new Ext.form.TextField({
			style:'margin:0;',
			anchor:'100%',
			id:'deptName',
		    width:140
		}));
		this.add(new Ext.Button({text:'查询',scope:this,btnid:'query',handler:this.query_e,controlSearch:true}));
		this.add(new Ext.Button({text:'清空',scope:this,btnid:'query',handler:this.clear_e,controlSearch:true}));
	},
	clear_e : function(){
		Ext.getCmp('operatorName').setValue('');
		Ext.getCmp('sysRoleName').setValue('');
		Ext.getCmp('menuName').setValue('');
		Ext.getCmp('deptName').setValue('');
	}
});