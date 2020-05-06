Ext.ns("app.harmony.system.BaseClass");
$import('app.ext3-2.script.ComboBoxTreeGrid');

app.harmony.system.BaseClass.DetailPanel = Ext.extend(Ext.form.FormPanel,{
	/** 模块ID */
	moduleID : '',
	/** 解析的xml模块名 */
	className : '',
	region : 'center', 
	/** 操作状态，添加、编辑、查询(add,edit,query) */
	isCanEdit : '',   
	/** 选中的记录 */
	record : null,   
	/** 主从表关联的字段 */
	uParams : '',
	/** action */
	url : '',
	/** 弹出窗口表单 */
	dataDetail : null,
	/** 面板类型 */
	gridType : 'GridPanel',
	/** 查询数据记录的id */
	rid : '',
	autoScroll:true,
	isReadInit : false,
	style : {
		"text-align":"center"
	},
	getDataDetail : function(){
		return this.dataDetail;
	},
	loadReadInit : function(record){
		if(!this.isReadInit)
			return;
		Ext.Ajax.request({
			url : this.url,
			params : {object : 'readInitDetail',
			          rid : this.rid,
			          moduleID : this.moduleID,
			          token : token},
			scope : this,
			callback:function(o,s, resp){
				if(ajaxRequestFailure(resp.statusText)){
			        return;
			    }
			    var respText = Ext.util.JSON.decode(resp.responseText);
			    if(!Ext.isEmpty(respText.field)){
			    	var retFields = Ext.util.JSON.decode(respText.field);
			    	if(this.uParams){//添加状态是否带有关联关系的字段需要赋值
			    		Ext.apply(retFields,this.uParams);
				    }
			    	this.loadRecord({json:retFields});
			    }
			}
		});
	},
	loadRecord : function(record){
		if(Ext.isEmpty(record))
			return;
		this.getForm().loadRecord(record);
	},
	readData : function(){
		Ext.Ajax.request({
			url : this.url,
			params : {object : 'readGridDetail',
			          rid : this.rid,
			          moduleID : this.moduleID,
			          token : token},
			scope : this,
			callback:function(o,s, resp){
				if(ajaxRequestFailure(resp.statusText)){
				   return;
				}
				var respText = Ext.util.JSON.decode(resp.responseText);
				var data = respText.root;
				if(!Ext.isEmpty(data)){
					this.loadRecord({json:data[0]});
				}
			}
		});
	},
	initComponent : function(){
		if(Ext.isEmpty(this.url))
			this.url = this.urlAction;
	    app.harmony.system.BaseClass.DetailPanel.superclass.initComponent.call(this);
	    this.add(this.getDataDetail());
	    if(this.isCanEdit=='add'){
	    	this.addInitRecord();
	    }else if(!Ext.isEmpty(this.rid)){//根据rid获取后台数据，一般用于查询明细
	    	this.readData();
	    	this.loadReadInit();
	    }else{//非添加状态，先去父窗口获取选中行的数据
	    	this.record = parent.window.openWindow.PGrid.getSelectionModel().getSelected();
    		this.loadRecord(this.record);
    		this.loadReadInit();
	    }
	    this.initFieldStatus();
	},
	/** 获取添加状态初始值 */
	addInitRecord : function(){
		Ext.Ajax.request({
		    url : this.url,
		    params : {object:'addInit',
		              moduleID : this.moduleID,
		              className:this.className,
		              token : token},
		    scope : this,
		    callback : function(o,s,resp){
		    	if(ajaxRequestFailure(resp.statusText)){
			        return;
			    }
			    var respText = Ext.util.JSON.decode(resp.responseText);
			    if(!Ext.isEmpty(respText.field)){
			    	var retFields = Ext.util.JSON.decode(respText.field);
			    	if(this.uParams){//添加状态是否带有关联关系的字段需要赋值
			    		Ext.apply(retFields,this.uParams);
				    }
			    	this.loadRecord({json:retFields});
			    }
		    }
		});
	},
	setFieldStatus : function(field){
		var fObj = this.getForm().findField('value('+field.name+')');
	    if(!Ext.isEmpty(fObj)){
	        fObj.setReadOnly(eval(field.readonly));
	        fObj.setAllowBlank(eval(field.allowBlank));
	    }	
	},
	initFieldStatus : function(){
		if(this.isCanEdit=='query'){      //查询设置状态
			this.setAllFieldReadonly();
			return;
		}else if(this.isCanEdit == 'edit' && !Ext.isEmpty(this.record)){   //编辑已经存在记录，则设置状态
			Ext.each(this.record.fields.items,function(field){
			    this.setFieldStatus(field);
			},this);
		}else{          //其他状态
			Ext.Ajax.request({
			    url : this.url,
			    params : {object:'readGridXML',
			              gridModuleID : this.moduleID,
			              gridType:this.gridType,
			              className:this.className,
			              token : token},
			    scope : this,
			    callback : function(o,s,resp){
			    	if(ajaxRequestFailure(resp.statusText)){
				        return;
				    }
			    	if(Ext.isEmpty(resp.responseText)) {
			    		return;
			    	}
				    var respText = Ext.util.JSON.decode(resp.responseText);
				    var fieldsArr = eval(respText.field);
				    Ext.each(fieldsArr,function(field){
				         this.setFieldStatus(field);
				    },this);
			    }
			});
		}
	},
	setAllFieldReadonly : function(){
		Ext.each(this.getForm().items.items,function(f){
			f.setReadOnly(true);
		},this);
	},
	/* 保存前对form值进行验证. */
	selfValidate : function(form){
		return true;
	},
	validate : function(form){
		var isVal = false;
		var sError = "";
		if(!this.selfValidate(form)){
			return false;
		}
		form.items.each(function(f){
           if(!f.validate()){
           		if(Ext.isEmpty(sError))
           			sError = "<font color=red>"+(Ext.isEmpty(f.fieldLabel)?'':f.fieldLabel).replace("<font color=red>*</font>","")+"</font>"+f.activeError;
           		else{
           			sError+='<br>'+"<font color=red>"+(Ext.isEmpty(f.fieldLabel)?'':f.fieldLabel).replace("<font color=red>*</font>","")+"</font>"+f.activeError;
           		}
				isVal = true;
           }
        });
        if(isVal){
        	Ext.Msg.alert("提示",sError);
        	return false;
        }
        return true;
	},
	clearWFStatus : function(){
		parent.window.openWindow.PGrid.showSubmit(false);
		parent.window.openWindow.PGrid.showBack(false);
	},
	/**
	 * 刷新主Grid
	 * @param {} form
	 * @return {Boolean}
	 */
	isReloadMainGrid : function(form){
		return false;
	},
	saveForm : function (btn){ 
		var form = this.getForm();
		var params = {object:'doSave',moduleID:this.moduleID,className:this.className,token:token};
		if(!this.validate(form)){
			this.clearWFStatus();
			return;
		}
		form.submit({
			url : this.url,
			waitTitle : '提示',
			method : 'POST',
			waitMsg : '提交保存中,请稍候....',
			params: params, 
			scope : this,
			success : function(form, action) {
				var returnMsg = Ext.util.JSON.decode(action.response.responseText);
				if(returnMsg.success){
					if(parent.window.openWindow){
						if(!Ext.isEmpty(returnMsg.dataID)&&parent.window.openWindow.isWantReload)
						{
							var dataID = returnMsg.dataID;
							if(this.isReloadMainGrid(form)){
								parent.window.openWindow.PGrid.ownerCt.ownerCt.ownerCt.ownerCt.mainGrid.reloadGrid();
							}else
								parent.window.openWindow.PGrid.reloadGrid(dataID);
						}
						parent.window.openWindow.close();
					}else{
						document.location.reload();
					}
				}else{
					this.clearWFStatus();
	      			alert(returnMsg.error);
	      			btn.setDisabled(false);
		 		}
			},
			failure : function(form, action) {
				var errmsg = action.result.error;
				alert(errmsg);
				btn.setDisabled(false);
			}
		});
	}
});