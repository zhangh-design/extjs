Ext.ns('app.harmony.system.Module.WorkFlow.Canvas.Detail');
app.harmony.system.Module.WorkFlow.Canvas.Detail.RemarkAttributes = function(config){
    Ext.apply(this,config);
    app.harmony.system.Module.WorkFlow.Canvas.Detail.RemarkAttributes.superclass.constructor.call(this,config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Detail.RemarkAttributes,Ext.Window,{
	remarkAttributes : null,
	remarkPanel : null,
	Info : null,
	border : false,
	closeAction : 'close',
	modal : true,
	resizable : false,
	title : '线属性',
	height : 200,
	width : 260,
	initComponent : function(){
		app.harmony.system.Module.WorkFlow.Canvas.Detail.RemarkAttributes.superclass.initComponent.call(this);
		this.add(this.initInfo());
		this.addButton({text:'保存',scope:this,handler:this.saveForm});
		this.addButton({text:'关闭',scope:this,handler:this.close});
		if(!Ext.isEmpty(this.remarkAttributes))
			this.Info.getForm().loadRecord({json:this.remarkAttributes});
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
	        defaults:{border:false,bodyStyle:'padding:0px;',labelAlign:'right',layout:'form',frame:false,colspan:2,width:230,labelWidth:45},
			items:[
				{colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'宽度',anchor:'100%',name:'value(width)'}},
				{colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'高度',anchor:'100%',name:'value(height)'}},
				{colspan:2,items:{xtype:'textarea',style:'margin:0;',fieldLabel:'说明',anchor:'100%',name:'value(html)'}}
			]}
		return dataDetail;
	},
	saveForm : function (){
		var form=this.Info.getForm();
		this.remarkAttributes = {
			width : form.findField('value(width)').getValue(),
			height : form.findField('value(height)').getValue(),
			html : form.findField('value(html)').getValue()
		};
		this.remarkPanel.setRemarkAttributes(this.remarkAttributes);
		this.close();
	}
});