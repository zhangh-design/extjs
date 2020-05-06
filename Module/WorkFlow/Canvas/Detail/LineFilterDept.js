Ext.ns('app.harmony.system.Module.WorkFlow.Canvas.Detail');
app.harmony.system.Module.WorkFlow.Canvas.Detail.LineFilterDept = function(config){
    Ext.apply(this,config);
    app.harmony.system.Module.WorkFlow.Canvas.Detail.LineFilterDept.superclass.constructor.call(this,config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Detail.LineFilterDept,Ext.Window,{
	filterDept : null,
	line : null,
	Info : null,
	border : false,
	modal : true,
	resizable : false,
	closeAction : 'close',
	title : '过滤部门',
	height : 120,
	width : 260,
	initComponent : function(){
		app.harmony.system.Module.WorkFlow.Canvas.Detail.LineFilterDept.superclass.initComponent.call(this);
		this.add(this.initInfo());
		this.addButton({text:'保存',scope:this,handler:this.saveForm});
		this.addButton({text:'清空',scope:this,handler:this.deleteCondition});
		this.addButton({text:'关闭',scope:this,handler:this.close});
		if(!Ext.isEmpty(this.filterDept))
			this.Info.getForm().loadRecord({json:this.filterDept});
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
	        defaults:{border:false,bodyStyle:'padding:0px;',labelAlign:'right',layout:'form',frame:false,colspan:2,width:230,labelWidth:90},
			items:[
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'过滤字段(英文)',anchor:'100%',allowBlank:false,name:'value(rid)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'过滤字段(中文)',anchor:'100%',allowBlank:false,name:'value(name)'}}
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
		this.filterDept = {
			rid : form.findField('value(rid)').getValue(),
			name : form.findField('value(name)').getValue()
		};
		this.line.setFilterDept(this.filterDept);
		this.close();
	},
	deleteCondition : function(){
		this.filterDept = {
			rid : '',
			name : '默认'
		};
		this.line.setFilterDept(this.filterDept);
		this.close();
	}
});