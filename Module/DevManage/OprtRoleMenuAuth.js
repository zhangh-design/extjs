Ext.ns("app.harmony.system.Module.DevManage");
app.harmony.system.Module.DevManage.OprtRoleMenuAuth = Ext.extend(app.harmony.system.Analytic.SysModule,{
	mainClassName : 'OprtRoleMenuAuth',
	connURL : 'OprtRoleMenuAuth.do',
	isShowTree : false,
	definedTBarJS : 'app.harmony.system.Module.DevManage.OprtRoleMenuAuthTBar'
});