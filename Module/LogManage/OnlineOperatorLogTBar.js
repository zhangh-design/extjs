Ext.ns("app.harmony.system.Module.LogManage");
$import('app.harmony.system.BaseClass.GridDefinedTBar');
$import("app.ext3-2.script.DateTimeField");
app.harmony.system.Module.LogManage.OnlineOperatorLogTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.LogManage.OnlineOperatorLogTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Module.LogManage.OnlineOperatorLogTBar,app.harmony.system.BaseClass.GridDefinedTBar, {   
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
		
		var logintime_qry = Ext.getCmp('logintime_qry').getValue();
		if(typeof(logintime_qry) == 'undefined') {
			logintime_qry = '';
		}
		if(!Ext.isEmpty(logintime_qry)){
			logintime_qry = logintime_qry.format('Y-m-d H:i:s');
		}
		
		var logouttime_qry = Ext.getCmp('logouttime_qry').getValue();
		if(typeof(logouttime_qry) == 'undefined') {
			logouttime_qry = '';
		}
		if(!Ext.isEmpty(logouttime_qry)){
			logouttime_qry = logouttime_qry.format('Y-m-d H:i:s');
		}
		store.setBaseParam('oprtname_qry',oprtname_qry);
		store.setBaseParam('logintime_qry', logintime_qry);
		store.setBaseParam('logouttime_qry', logouttime_qry);
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
			text : '进入系统时间',
			width : 60,
			style : 'text-align:right;'
		}));
		this.add('&nbsp;');
		this.add(new Ext.ux.form.DateTimeField({
			format:'Y-m-d H:i:s',
			style:'margin:0;',
			anchor:'100%',
			id:'logintime_qry',
		    width:140
		}));
		this.add('&nbsp;');
		this.add(new Ext.form.Label({
			text : '退出系统时间',
			width : 60,
			style : 'text-align:right;'
		}));
		this.add('&nbsp;');
		this.add(new Ext.ux.form.DateTimeField({
			format:'Y-m-d H:i:s',
			style:'margin:0;',
			anchor:'100%',
			id:'logouttime_qry',
		    width:140
		}));
		this.add('&nbsp;');
		this.add(new Ext.Button({text:'查询',scope:this,btnid:'query',handler:this.query_e,controlSearch:true}));
		this.add('-');
		this.add(new Ext.Button({text:'清空',scope:this,btnid:'clear',handler:this.clear_e,controlSearch:true}));
	},
	clear_e : function(){
		Ext.getCmp('oprtname_qry').setValue('');
		Ext.getCmp('logintime_qry').setValue('');
		Ext.getCmp('logouttime_qry').setValue('');
	}
});