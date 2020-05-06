Ext.ns("app.harmony.system.Module.Param");
app.harmony.system.Module.Param.SysConstConfig = Ext.extend(app.harmony.system.Analytic.SysModule,{
	isShowTree : false,
	mainClassName : 'SysConstConfig',
	connURL : 'SysConstConfig.do',
	mainGridType : 'EditRowGrid',
	gridRowTBarJS : 'app.harmony.system.Module.Param.GridConstConfigTBar'
});