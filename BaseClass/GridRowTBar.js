Ext.ns("app.harmony.system.BaseClass");
$import("app.harmony.system.BaseClass.GridTBar");
app.harmony.system.BaseClass.GridRowTBar = Ext.extend(app.harmony.system.BaseClass.GridTBar, {   
	add_e : function(func,params){
		var pg = this.getBubbleTarget().PGrid;
		var bp = pg.getStore().baseParams;
		var param = new Object();
		param.moduleID = pg.moduleID;
		param.className = pg.className;
		param.object = 'addInit';
		param.token = token;
		Ext.apply(param, bp);
		Ext.Ajax.request({    
			async : false,
		 	url: pg.connURL,  
		 	params:param,
		 	scope : this,
		 	callback:function(o,s, resp){
		 		//先判断与ajax与后台交互是否成功
		 		if(ajaxRequestFailure(resp.statusText))
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
					this.getBubbleTarget().initRowRecord(respText,pg,bp);
		 		}else{
		 			alert(respText.error);
		 		}
		 	}
		});
	},
	initRowRecord : function(respText,pg,bp){
		var retFields = Ext.util.JSON.decode(respText.field);
		var rec = Ext.data.Record.create(pg.recordType);
		Ext.applyIf(retFields, bp);
		var e = eval('new rec(retFields)');
		if(!pg.plugins)
			return;
	    pg.plugins.stopEditing();
	    var row = 0;
	    if(pg.lastRowToAdd)
	    	row = pg.store.getCount();
	    if(pg.editRowOnSelect){
	    	if(typeof pg.getSelectionModel().last=="boolean")
	    		row = 0;
	    	else
	    		row = pg.getSelectionModel().last+1;
	    }	
	   pg.getStore().insert(row, e);
	   pg.getView().refresh();
	   pg.getSelectionModel().selectRow(row);
	   pg.plugins.startEditing(row);
	}
});