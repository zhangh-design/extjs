$import('app.harmony.system.BaseClass.GridRowTBar');
Ext.ns("app.harmony.system.BaseClass");
app.harmony.system.BaseClass.GridCellTBar = function(config){
	Ext.apply(this, config);
	app.harmony.system.BaseClass.GridCellTBar.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.BaseClass.GridCellTBar,app.harmony.system.BaseClass.GridRowTBar, {   
	initRowRecord : function(respText,pg,bp){
		var retFields = Ext.util.JSON.decode(respText.field);
		var rec = Ext.data.Record.create(pg.recordType);
		Ext.applyIf(retFields, bp);
		var e = eval('new rec(retFields)');
		if(!pg)
			return;
	    pg.stopEditing();
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
	   var column = this.getEditCell(row,pg);
       pg.startEditing(row,column);
       pg.getSelectionModel().selectRow(row);
	},
	/**获取编辑单元格列*/
	getEditCell : function(row,grid){
		var column = 1;
		for(var i=1;i<=grid.colModel.getColumnCount();i++){
			if(grid.colModel.isCellEditable(i,row)){
				column = i;
				break;
			}
		}
		return column;
	}
});