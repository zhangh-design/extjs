Ext.ns('app.harmony.system.Module.WorkFlow.Canvas.Detail');
$import('app.harmony.system.Plugin.ComboBox');
app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleAttributes = function(config){
    Ext.apply(this,config);
    app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleAttributes.superclass.constructor.call(this,config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleAttributes,Ext.Window,{
	moduleAttributes : null,
	modulePanle : null,
	WFID : '',
	border : false,
	WFInfo : null,
	closeAction : 'close',
	modal : true,
	resizable : false,
	title : '模块属性',
	isReadOnly : false,
	height : 270,
	width : 230,
	initComponent : function(){
		app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleAttributes.superclass.initComponent.call(this);
		this.add(this.initWFInfo());
		this.addButton({text:'保存',scope:this,handler:this.saveForm});
		this.addButton({text:'关闭',scope:this,handler:this.close});
		if(!Ext.isEmpty(this.moduleAttributes))
			this.WFInfo.getForm().loadRecord({json:this.moduleAttributes});
	},
	initWFInfo : function(){ 
		this.WFInfo = new Ext.form.FormPanel({
			border : false,
			region : 'center',
			items : [this.detail()]
		});
		return this.WFInfo;
	},
	detail : function(){
		var datadetail={
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
	        defaults:{border:false,bodyStyle:'padding:0px;',labelAlign:'right',layout:'form',frame:false,colspan:2,width:200,labelWidth:65},
			items:[
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'步骤名称',anchor:'100%',name:'value(name)'}},
				{colspan:2,width:200,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(moduleid)',
					hiddenName:'value(moduleid)',
					url : 'WorkFlow/WFModuleIDCombo.do',					//ComboBox的URL参数
					fieldLabel:'处理模块',
					anchor:'100%',
					tableName : this.WFID,
					listeners : {
						'select' : function(a,b,c){
							a.getBubbleTarget().getBubbleTarget().getBubbleTarget().getForm().findField("value(name)").setValue(a.lastSelectionText);
						}
					}
				}},
				{colspan:2,items:{xtype:'numberfield',style:'margin:0;',value:'24',fieldLabel:'处理时间',anchor:'100%',name:'value(processtime)'}},
				{colspan:2,items:{xtype:'numberfield',style:'margin:0;',value:'24',fieldLabel:'预警时间',anchor:'100%',name:'value(alarmtime)'}},
				{colspan:2,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(flowfiltertypeid)',
					hiddenName:'value(flowfiltertypeid)',
			    	fieldLabel:'过滤类型',
			    	value:'1',
					anchor:'100%',
					tableName : 'MIS_WF.V_FLowFilterType'
				}},
				{colspan:2,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(nextitemseltypeid)',
					hiddenName:'value(nextitemseltypeid)',
			    	fieldLabel:'下一步骤',
			    	value:'1',
					anchor:'100%',
					tableName : 'MIS_WF.V_NextItemSelType'
				}},
				{colspan:2,items:{xtype:'numberfield',style:'margin:0;',value:'0',fieldLabel:'自动执行',anchor:'100%',name:'value(autoprocess)'}}
			]}
		return datadetail;
	},
	saveForm : function (){
		var form=this.WFInfo.getForm();
		this.moduleAttributes = {
			name : form.findField('value(name)').getValue(),
			moduleid : form.findField('value(moduleid)').getValue(),
			processtime : form.findField('value(processtime)').getValue(),
			alarmtime : form.findField('value(alarmtime)').getValue(),
			flowfiltertypeid : form.findField('value(flowfiltertypeid)').getValue(),
			nextitemseltypeid : form.findField('value(nextitemseltypeid)').getValue(),
			autoprocess : form.findField('value(autoprocess)').getValue(),
			modulename : form.findField('value(name)').getValue()
		}
		this.modulePanle.setModuleAttributes(this.moduleAttributes);
		this.close();
	}
});