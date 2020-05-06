Ext.ns("app.harmony.system.Module.DevManage");
$import("app.harmony.system.BaseClass.GridTBar");
app.harmony.system.Module.DevManage.OperatorTBar = Ext.extend(app.harmony.system.BaseClass.GridRowTBar, {
	initBtnStatus : function(record){
		var deptID = this.getBubbleTarget().store.baseParams.deptid;
		var allBtn = this.items.items;
		if(deptID == 0 ) {	
			Ext.each(allBtn, function(rec) {
				rec.setDisabled(true);		
			})
			return;
		} else {
			Ext.each(allBtn, function(rec) {
				rec.setDisabled(false);
			});		
		}
		if(Ext.isEmpty(record)) {
			return;
		}		
		var flag = record.data.flag||1;
		Ext.each(allBtn,function(rec){
			if(rec.btnid=="archive"){
				rec.setDisabled(flag==128);
			}
			if(rec.btnid=="terminate"){
				rec.setDisabled(flag!=128);
			}
			if(rec.btnid=="del"){
				rec.setDisabled(flag!=1);
			}
		},this);
	},
	/** 初始化密码按钮 */
	initpsw_e : function(){
		var record = this.getBubbleTarget().PGrid.getSelectionModel().getSelected();
		Ext.Ajax.request({
			url : this.getBubbleTarget().PGrid.connURL,
			params : {
						object : 'initpsw',
						rid : record.data.rid,
						token : token
					 },
			scope : this,
			callback : function(o,s,resp) {
				if(ajaxRequestFailure(resp.statusText)) {
					return;
				}
				var respText = Ext.util.JSON.decode(resp.responseText);
				if(respText.success) {
					this.getBubbleTarget().PGrid.reloadGrid();
					Ext.Msg.alert('提示',respText.data);
				}
			}
		});
	}
});