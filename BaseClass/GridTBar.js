Ext.ns("app.harmony.system.BaseClass");
$import("app.harmony.system.BaseClass.Window");
$import("app.harmony.system.BaseClass.Print");
app.harmony.system.BaseClass.GridTBar=Ext.extend(Ext.Toolbar, {   
	tbarValue : null,
	PGrid : null,
	isCanEdit : false,
	isCanSubmit : false,
	isCanPrint : false,
	isCanCallback : false,
	setAllBtnStatus : function(record){
		var disabled = Ext.isEmpty(record);
		var allBtn = this.items.items;
		Ext.each(allBtn,function(rec){
			if(rec.btnid)
				rec.setDisabled(disabled);
		},this);
	},
	initBtnStatus : function(record){
		if(Ext.isEmpty(record))
			return;
		var allBtn = this.items.items;
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
	initBeforeOther : function(){},
	initOther : function(){
		
	},
	initComponent : function(){
		app.harmony.system.BaseClass.GridTBar.superclass.initComponent.call(this);
		this.initBeforeOther();
		Ext.each(this.tbarValue,function(t,index){
			if(t.btnid&&t.btnid=='submit'){//判断是否存在提交按钮
				this.isCanSubmit = true;
			}
			if(t.btnid&&t.btnid=='print'){//判断是否存在提交按钮
				this.isCanPrint = true;
			}
			if(t.btnid&&t.btnid=='back'){//判断是否存在退回按钮
				this.isCanCallback = true;
			}
			if(t.btnid&&t.btnid=='edit'){
				this.isCanEdit = true;
			}else{
				if(!Ext.isEmpty(t.handler))
					t.handler = eval(t.handler);
				if(!Ext.isEmpty(t.menu)){
					Ext.each(t.menu,function(obj,i){
						if(!Ext.isEmpty(obj.handler)){
							obj.handler = eval(obj.handler);
						}
					},this);
				}
				this.add(t);
			}
		},this);
		this.initOther();
	},
	add_e : function(){
		/** 获取主从表关联的字段值，用于添加时自动填充从表关联字段 */
		var uParams  = this.getBubbleTarget().PGrid.getStore().baseParams;
		var cfg = {
		   moduleID : this.getBubbleTarget().PGrid.moduleID,
		   jsDetail : this.getBubbleTarget().PGrid.detailURL,
		   width : this.getBubbleTarget().PGrid.winWidth,
		   height : this.getBubbleTarget().PGrid.winHeight,
		   title : '添加',
		   isCanEdit : 'add',
		   uParams : uParams,
		   isCanSubmit : this.getBubbleTarget().PGrid.topToolbar.isCanSubmit,
		   PGrid : this.getBubbleTarget().PGrid,
		   className : this.getBubbleTarget().PGrid.className
		};
		$import("app.harmony.system.BaseClass.Window");
		var detailWin = new app.harmony.system.BaseClass.Window(cfg);
		detailWin.show();
	},
	del_e : function(){
		var record  = this.getBubbleTarget().PGrid.getSelectionModel().getSelected();
		if(!Ext.isEmpty(record)){
			Ext.Msg.confirm("提示","是否删除数据",function(button,text){
				if(button!="yes")
					return;
				Ext.Ajax.request({
					url : this.getBubbleTarget().PGrid.connURL,
					params : {object:'destory',
							  rid:record.json.rid,
							  moduleID : this.getBubbleTarget().PGrid.moduleID,
							  token:token},
					scope : this,
					callback : function(o,s,resp){
						if(ajaxRequestFailure(resp.statusText)){
							return;
						}
						var respText = Ext.util.JSON.decode(resp.responseText);
						if(respText.success){
							if(this.getBubbleTarget().PGrid.fireEvent("isNotReloadMainGrid",record,'delete')==false){
								this.getBubbleTarget().PGrid.ownerCt.ownerCt.ownerCt.ownerCt.mainGrid.reloadGrid();
							}else
								this.getBubbleTarget().PGrid.reloadGrid();
						}else
							alert(respText.error);
					}
				});
			},this);
		}else{
		    alert("没有选择的记录");
		}
	},
	import_e : function(){
		var cfg = {
			   moduleID : this.getBubbleTarget().PGrid.moduleID,
			   className : this.getBubbleTarget().PGrid.className
			};
		$import("app.harmony.system.BaseClass.Import");
		var win = eval("new app.harmony.system.BaseClass.Import(cfg)");
		win.on("beforeDestroy",function(){
			this.getBubbleTarget().PGrid.reloadGrid();
		},this);
	},
	/** 流程提交 */
	submit_e : function(){
		this.getBubbleTarget().showHandlerWin('submit');
	},
	/** 流程退回 */
	back_e : function(){
		this.getBubbleTarget().showHandlerWin('back');
	},
	/** 流程转交 */
	change_e : function(){
		this.getBubbleTarget().showHandlerWin('change');
	},
	/** 流程终止 */
	stop_e : function(){
		this.getBubbleTarget().showHandlerWin('stop');
	},
	/** 流程召回 */
	callback_e : function(){
		this.getBubbleTarget().showHandlerWin('callback');
	},
	/** 流程作废 */
	invalid_e : function(){
		this.getBubbleTarget().showHandlerWin('invalid');
	},
	/** 流程还原 */
	restore_e : function(){
		this.getBubbleTarget().showHandlerWin('restore');
	},
	/** 打开流程页面 */
	showHandlerWin : function(action){
		var records  = this.PGrid.getSelectionModel().getSelections();
		if(Ext.isEmpty(records.join('')))
			return;
		var sRid = '';
		var isCanSubmit = true;
		if(action=='submit'){
			Ext.each(records,function(obj,i){
				if(i==0)
					sRid = obj.json.rid;
				else
					sRid += ','+obj.json.rid;
				if(this.PGrid.validate(obj,action)){
					isCanSubmit = false;
					return;
				}
			},this);
		}else{
			if(this.PGrid.validate(records[0],action))//验证不通过
				return;
		}
		if(!isCanSubmit)
			return;
		var WFOpition = this.getWFOpition(records,action,this.PGrid.moduleID);
		var WFItemOprt = this.getWFItemOprt(records,action,this.PGrid.moduleID);
		var cfg = {
			moduleID : this.PGrid.moduleID,
			action : action,
			dataIDs : sRid,
			dataID : records[0].json.rid,
			connURL : this.PGrid.connURL,
			PGrid : this.PGrid,
			WFOpition : WFOpition,
			WFItemOprt : WFItemOprt
		};
		$import("app.harmony.system.WorkFlow.WFWin");
		new app.harmony.system.WorkFlow.WFWin(cfg).show();
	},
	/**
	 * 返回步骤指定的人
	 * @param {} records
	 * @param {} action
	 * @param {} moduleID
	 */
	getWFItemOprt : function(records,action,moduleID){
		var oprts = [];
		var wfitem = {
			moduleid : '586113',
			oprtid : '1',
			oprtname : 'aaa'
		};
		oprts.push(wfitem);
		return null;
	},
	/**
	 * 返回审核意见
	 * @param {} records
	 * @param {} action
	 * @param {} moduleID
	 * @return {String}
	 */
	getWFOpition : function(records,action,moduleID){
		return "";
	},
	/** 归档按钮 */
	archive_e : function(){
		var record  = this.getBubbleTarget().PGrid.getSelectionModel().getSelected();
		if(Ext.isEmpty(record)){
			return;
		}
		Ext.Ajax.request({
			url : this.getBubbleTarget().PGrid.connURL,
			params : {object:'archive',
					  rid:record.json.rid,
					  moduleID:this.getBubbleTarget().PGrid.moduleID,
					  token:token},
			scope : this,
			callback : function(o,s,resp){
				if(ajaxRequestFailure(resp.statusText)){
					return;
				}
				var respText = Ext.util.JSON.decode(resp.responseText);
				if(respText.success){
					this.getBubbleTarget().PGrid.reloadGrid();
				}
			}
		});
	},
	/** 不归档按钮 */
	terminate_e : function(){
		var record  = this.getBubbleTarget().PGrid.getSelectionModel().getSelected();
		Ext.Ajax.request({
			url : this.getBubbleTarget().PGrid.connURL,
			params : {object:'terminate',
					  rid:record.json.rid,
					  moduleID:this.getBubbleTarget().PGrid.moduleID,
					  token:token},
			scope : this,
			callback : function(o,s,resp){
				if(ajaxRequestFailure(resp.statusText)){
					return;
				}
				var respText = Ext.util.JSON.decode(resp.responseText);
				if(respText.success){
					this.getBubbleTarget().PGrid.reloadGrid();
				}
			}
		});
	},
	getExportOrder : function(store){
		var sortInfo = store.sortInfo;
		if(Ext.isEmpty(sortInfo ))
			return "";
		return "&sort="+sortInfo.field+"&dir="+sortInfo.direction;
	},
	export_e : function(){
		var sURL = '';
		var gridModuleID =this.getBubbleTarget().PGrid.gridModuleID;
		var className = this.getBubbleTarget().PGrid.className;
		var url = this.getBubbleTarget().PGrid.connURL;
		sURL = url+"?token="+token+'&moduleID='+gridModuleID+'&className='+className;
    	var params = this.getBubbleTarget().PGrid.getStore().baseParams;
		 	
    	for(i in params){
    		sURL += '&'+i+'='+encodeURIComponent(encodeURIComponent(params[i]));
    	}
    	sURL += this.getBubbleTarget().getExportOrder(this.getBubbleTarget().PGrid.getStore());
		Ext.MessageBox.prompt('文件名','请输入文件名',function(btn,text){
			if(btn=='ok'){
				if(text==''){
					Ext.MessageBox.alert('提示','请输入文件名');
					return;
				}
				var fileName = encodeURIComponent(encodeURIComponent(text));
				sURL += '&object=export&fileName='+fileName;
				//window.open(sURL);
				Ext.get('export_frame').dom.src=sURL;
			}
		});
    },
    viewAudit_e : function (){
    	var pGrid=this.getBubbleTarget().PGrid;
    	var record  = pGrid.getSelectionModel().getSelected();
    	if(Ext.isEmpty(record))
    		return;
    	var cfg = {
				title : '审核意见',
				moduleID : pGrid.moduleID,
				gridModuleID : '219999',
				jsDetail : 'app.harmony.system.WorkFlow.DetailPanel.ViewGrid',
				className : 'ViewAudit',
				url : 'ViewAudit.do',
				PGrid : pGrid,
				uParams : {dataID : record.json.rid},
				width : 900,
				height : 300
			}
		var gridWin = new app.harmony.system.BaseClass.Window(cfg);
		gridWin.show();
    },
    print_e : function(){
    	var pGrid=this.getBubbleTarget().PGrid;
    	var record  = pGrid.getSelectionModel().getSelected();
    	if(Ext.isEmpty(record))
    		return;
    	isCanPrint=true;
		eval("new app.harmony.system.BaseClass.Print({ModuleID:'"+pGrid.moduleID+"',ClassName:'"
			+pGrid.className+"',token:'"+token+"',rid:"+record.json.rid+"})");
    },
    upload_e : function(){
    }
});