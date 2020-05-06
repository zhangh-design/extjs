Ext.ns("app.harmony.system.Module.LogManage");
app.harmony.system.Module.LogManage.OnlineOperatorLog = function(config) {
	Ext.apply(this, config);
	app.harmony.system.Module.LogManage.OnlineOperatorLog.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.LogManage.OnlineOperatorLog,app.harmony.system.Analytic.SysModule, {
	mainClassName : 'OnlineOperatorLog',
	connURL : 'OnlineOperatorLog.do',
	isShowTree : false,
	isReadOnly : true,
	isShowDetail : false,
	definedTBarJS : 'app.harmony.system.Module.LogManage.OnlineOperatorLogTBar'
});