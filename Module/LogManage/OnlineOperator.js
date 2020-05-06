Ext.ns("app.harmony.system.Module.LogManage");
app.harmony.system.Module.LogManage.OnlineOperator = function(config) {
	Ext.apply(this, config);
	app.harmony.system.Module.LogManage.OnlineOperator.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.LogManage.OnlineOperator,app.harmony.system.Analytic.SysModule, {
	mainClassName : 'OnlineOperator',
	connURL : 'OnlineOperator.do',
	isShowTree : false,
	isReadOnly : true,
	isShowDetail : false,
	definedTBarJS : 'app.harmony.system.Module.LogManage.OnlineOperatorTBar'
});