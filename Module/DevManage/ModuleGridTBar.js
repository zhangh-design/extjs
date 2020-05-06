Ext.ns("app.harmony.system.Module.DevManage");
$import('app.harmony.system.BaseClass.GridTBar');
app.harmony.system.Module.DevManage.ModuleGridTBar = Ext.extend(app.harmony.system.BaseClass.GridTBar,{
	exportsql_e : function() {
		var sURL = '';
    	sURL = "ModuleExportSQL.do?token=" + token;
    	var records = this.getBubbleTarget().PGrid.getSelectionModel().getSelected();
    	var rid = records.json.rid;
    	var params = this.getBubbleTarget().PGrid.getStore().baseParams;
    	for(param in params) {
    		sURL += '&'+param+'='+encodeURIComponent(encodeURIComponent(params[param]));
    	}
    	Ext.MessageBox.prompt('文件名','请输入文件名',function(btn,text) {
    		if(btn == 'ok') {
    			if(Ext.isEmpty(text)) {
    				Ext.MessageBox.alert('提示','请输入文件名！');
    				return;
    			}
    			var fileName = encodeURIComponent(encodeURIComponent(text));
    			sURL += '&object=exportSQL&fileName=' + fileName + '&rid=' + rid;
    			Ext.get('export_frame'	).dom.src = sURL;
    		}
    	});
    }
});