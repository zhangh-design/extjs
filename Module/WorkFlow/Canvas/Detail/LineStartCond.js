Ext.ns('app.harmony.system.Module.WorkFlow.Canvas.Detail');
$import('app.harmony.system.Plugin.ComboBox');
app.harmony.system.Module.WorkFlow.Canvas.Detail.LineStartCond = function(config){
    Ext.apply(this,config);
    app.harmony.system.Module.WorkFlow.Canvas.Detail.LineStartCond.superclass.constructor.call(this,config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Detail.LineStartCond,Ext.Window,{
	startCondition : null,
	line : null,
	Info : null,
	border : false,
	closeAction : 'close',
	modal : true,
	title : '启动条件',
	height : 260,
	resizable : false,
	width : 260,
	initComponent : function(){
		app.harmony.system.Module.WorkFlow.Canvas.Detail.LineStartCond.superclass.initComponent.call(this);
		this.add(this.initInfo());
		this.addButton({text:'保存',scope:this,handler:this.saveForm});
		this.addButton({text:'清空',scope:this,handler:this.deleteCondition});
		this.addButton({text:'关闭',scope:this,handler:this.close});
		if(!Ext.isEmpty(this.startCondition)){
			this.Info.getForm().loadRecord({json:this.startCondition});
		}
	},
	initInfo : function(){ 
		this.Info = new Ext.form.FormPanel({
			border : false,
			region : 'center',
			items : [this.detail()]
		});
		return this.Info;
	},
	detail : function(){
		var dataDetail={
	        autoHeight: true,
	        autoWidth : false,
	        bodyStyle: Ext.isIE ? 'padding:0;' : 'padding:0;padding-top:10px;',
	        border: false,
	        style: {
	            "margin-left": "5px", 
	            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "5px" : "5px") : "5px",
	            "border-bottom" : "0px"
	        },
	        layout:'table',
	        layoutConfig : {
	        	columns:2
	        },
	        defaults:{border:false,bodyStyle:'padding:0px;',labelAlign:'right',layout:'form',frame:false,colspan:2,width:230,labelWidth:55},
			items:[
				{colspan:2,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(condtype)',
					hiddenName:'value(condtype)',
			    	fieldLabel:'启动类型',
			    	value:'0',
			    	editable:false,
			    	allowBlank:false,
					anchor:'100%',
					tableName : 'MIS_WF.V_CondType'
				}},
				{colspan:2,items:{xtype:'textarea',style:'margin:0;',fieldLabel:'启动条件',emptyText:'a=1 and b=2',anchor:'100%',allowBlank:false,name:'value(condition)'}},
				{colspan:2,items:{xtype:'textarea',style:'margin:0;',fieldLabel:'说明',anchor:'100%',allowBlank:false,name:'value(remark)'}},
				{colspan:2,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(mustrun)',
					hiddenName:'value(mustrun)',
			    	fieldLabel:'满足必启',
			    	value:'1',
			    	editable:false,
			    	allowBlank:false,
					anchor:'100%',
					tableName : 'MIS_Sys.V_Boolean'
				}}
			]}
		return dataDetail;
	},
	saveForm : function (){
		var form=this.Info.getForm();
		var isVal = false;
		var sError = "";
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
        	return;
        }
		this.startCondition = {
			condition : form.findField('value(condition)').getValue(),
			condtype : form.findField('value(condtype)').getValue(),
			remark : form.findField('value(remark)').getValue(),
			mustrun : form.findField('value(mustrun)').getValue()
		};
		this.line.setStartCondition(this.startCondition);
		this.close();
	},
	deleteCondition : function(){
		this.line.clearStartCondition();
		this.close();
	}
});