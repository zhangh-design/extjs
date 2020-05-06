Ext.ns("app.harmony.system.Module.LogManage");
$import('app.harmony.system.BaseClass.GridDefinedTBar');
$import("app.ext3-2.script.DateTimeField");
app.harmony.system.Module.LogManage.OperatorLogTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.LogManage.OperatorLogTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Module.LogManage.OperatorLogTBar,app.harmony.system.BaseClass.GridDefinedTBar, {   
	query_e : function(){
		this.initParams();
		this.grid.reloadGrid();
	},
	initParams : function(){
		var store = this.grid.getStore();
			
		var oprtname_qry = Ext.getCmp('oprtname_qry').getValue();
		if(typeof(oprtname_qry) == 'undefined') {
			oprtname_qry = '';
		}
		if(!Ext.isEmpty(oprtname_qry)) {
			oprtname_qry = encodeURIComponent(encodeURIComponent(oprtname_qry));
		}
		
		var sysrole_qry = Ext.getCmp('sysrole_qry').getValue();
		if(typeof(sysrole_qry) == 'undefined') {
			sysrole_qry = '';
		}
		if(!Ext.isEmpty(sysrole_qry)) {
			sysrole_qry = encodeURIComponent(encodeURIComponent(sysrole_qry));
		}
		
		var oprtmodule_qry = Ext.getCmp('oprtmodule_qry').getValue();
		if(typeof(oprtmodule_qry) == 'undefined') {
			oprtmodule_qry = '';
		}
		if(!Ext.isEmpty(oprtmodule_qry))	{
			oprtmodule_qry = 	encodeURIComponent(encodeURIComponent(oprtmodule_qry));
		}
		
		var oprttime_qry = Ext.getCmp('oprttime_qry').getValue();
		if(typeof(oprttime_qry) == 'undefined') {
			oprttime_qry = '';
		}
		if(!Ext.isEmpty(oprttime_qry)){
			oprttime_qry = oprttime_qry.format('Y-m-d H:i:s');
		}
		
		store.setBaseParam('oprtname_qry',oprtname_qry);
		store.setBaseParam('oprtmodule_qry',oprtmodule_qry);
		store.setBaseParam('sysrole_qry', sysrole_qry);
		store.setBaseParam('oprttime_qry', oprttime_qry);
	},
	initDefinedTBar : function(){
		this.add(new Ext.form.Label({
			text : '用户名',
			width : 60,
			style : 'text-align:right;'
		}));
		this.add('&nbsp;');
		this.add(new Ext.form.TextField({
			style : 'margin:0',
			anchor : '100%',
			id : 'oprtname_qry',
			width : 140
		}));
		this.add('&nbsp;');
		this.add(new Ext.form.Label({
			text : '系统角色',
			width : 60,
			style : 'text-align:right;'
		}));
		this.add('&nbsp;');
		this.add(new Ext.ux.ComboBoxTree({
					id: 'sysrole_qry',
					style: 'margin:0;',					
					anchor: '100%',
					fieldClass:'x-form-text1',
					name:'value(sysroleid)',
					autoLoad:true,
					width:120,
					listWidth:246,
					mode:'local',
					displayField:'text',
					valueField:'id',
					triggerAction:'all',
					autoScroll:false,
					treeUrl:'DevManageTree.do?action=sysrole',
					forceSelection:true,
					rootVisible:true,
					allowBlank : false,
					rootId:'0',
					rootText:'角色'
		}));
		this.add(new Ext.form.Label({
			text : '操作模块',
			width : 60,
			style : 'text-align:right;'
		}));
		this.add('&nbsp;');
		this.add(new Ext.form.TextField({
			style : 'margin:0',
			anchor : '100%',
			id : 'oprtmodule_qry',
			width : 140
		}));
		this.add('&nbsp;');
		this.add(new Ext.form.Label({
			text : '操作时间',
			width : 60,
			style : 'text-align:right;'
		}));
		this.add('&nbsp;');
		this.add(new Ext.ux.form.DateTimeField({
			format:'Y-m-d H:i:s',
			style:'margin:0;',
			anchor:'100%',
			id:'oprttime_qry',
		    width:140
		}));
		this.add('&nbsp;');
		this.add(new Ext.Button({text:'查询',scope:this,btnid:'query',handler:this.query_e,controlSearch:true}));
		this.add('-');
		this.add(new Ext.Button({text:'清空',scope:this,btnid:'clear',handler:this.clear_e,controlSearch:true}));
	},
	clear_e : function(){
		Ext.getCmp('oprtname_qry').setValue('');
		Ext.getCmp('sysrole_qry').setValue('');
		Ext.getCmp('oprtmodule_qry').setValue('');
		Ext.getCmp('oprttime_qry').setValue('');
	}
});