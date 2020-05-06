Ext.ns("app.harmony.system.Module.PrintConfig");
$import("app.harmony.system.BaseClass.Window");
$import("app.harmony.system.Tool.Upload");

app.harmony.system.Module.PrintConfig.PrintConfigTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.PrintConfig.PrintConfigTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Module.PrintConfig.PrintConfigTBar,app.harmony.system.BaseClass.GridTBar, {
	 upload_e : function(){
	 	var pGrid=this.getBubbleTarget().PGrid;
    	var record  = pGrid.getSelectionModel().getSelections()[0];
    	if(Ext.isEmpty(record))
    		return;
	    var tablename='MIS_CONFIG.PRINTCONFIG';
		$import("app.harmony.system.Tool.Upload");
		var cfg = {
				url : "./PublicUpload.do?rid="+record.data.rid+"&savetable="+tablename+"&token="+token,
				height:200,
				saveTable:tablename,
				isCover:true,
				onlyOne:true
		};
		var win = new app.harmony.system.Tool.Upload(cfg);
		win.show();
    }	
});