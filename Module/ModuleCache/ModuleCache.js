Ext.ns("app.harmony.system.Module.ModuleCache");
app.harmony.system.Module.ModuleCache.ModuleCache = Ext.extend(app.harmony.system.Analytic.SysModule,{
	isShowTree : false,
	singleSelect : false,
	mainClassName : 'ModuleCache',
	connURL : 'ModuleCache.do',
	definedTBarJS : 'app.harmony.system.Module.ModuleCache.ModuleCacheTBar'
});