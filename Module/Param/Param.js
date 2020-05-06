Ext.ns("app.harmony.system.Module.Param.Param");
app.harmony.system.Module.Param.Param = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.Param.Param.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.Param.Param,app.harmony.system.Analytic.SysModule,{
	isShowTree : false,
	mainClassName : 'Param',
	connURL : 'Param.do',
	mainGridType : 'EditRowGrid'
});