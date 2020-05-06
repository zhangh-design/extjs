Ext.ns("app.harmony.system.Module.LogManage");
app.harmony.system.Module.LogManage.OperatorLog = function(config) {
	Ext.apply(this, config);
	app.harmony.system.Module.LogManage.OperatorLog.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.LogManage.OperatorLog,app.harmony.system.Analytic.SysModule, {
	mainClassName : 'OperatorLog',
	connURL : 'OperatorLog.do',
	isShowTree : false,
	isReadOnly : true,
	isShowDetail : false,
	definedTBarJS : 'app.harmony.system.Module.LogManage.OperatorLogTBar'
});