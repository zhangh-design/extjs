$import("app.harmony.system.BaseClass.GridDefinedTBar");
Ext.ns("app.harmony.system.Module.ModuleCache");
app.harmony.system.Module.ModuleCache.ModuleCacheTBar = Ext.extend(app.harmony.system.BaseClass.GridDefinedTBar, {   
	/**
	 * 添加按钮,模块中重写该方法，添加自定义按钮
	 */
	initDefinedTBar : function(){
	   this.add(new Ext.form.TextField({id:'name',width:300}));
	   this.add('-');
	   this.add(new Ext.Button({text:'查询',scope:this,handler:this.query_e}));
	   this.add('-');
	   this.add(new Ext.Button({text:'清空',scope:this,handler:this.clear}));
	   this.add('-');
	   this.add(new Ext.Button({text:'清空缓存',scope:this,handler:this.clear_huancun}));
	},
	query_e : function(){
		var name = Ext.getCmp('name').getValue();
		this.grid.setStoreParam({name:name}, 'update');
		this.grid.reloadGrid();
	},
	clear : function(){
		Ext.getCmp("name").setValue('');
	},
	clear_huancun : function (){
		var arr=new Array();
		var records  = this.grid.getSelectionModel().getSelections();
		if(records.length<1){
			alert('请至少选择一条缓存');
			return;
		}
		Ext.each(records,function(r,index){
			arr.push("{'name':'"+r.json.name+"'}"); 
		},this);
		arr2="["+arr.join(",")+"]";
		Ext.Msg.confirm("提醒","确定要清除所选缓存吗?",function(btn){
			if(btn!='yes')
	 		return;
	     	Ext.Ajax.request({    
				 	url: this.grid.connURL,
				 	params:{object:"Clear",name:arr2,token:token},
				 	scope : this,
				 	callback:function(o,s, resp){
				 		this.grid.reloadGrid();
				 	}
				});
	     },this);
	}
});