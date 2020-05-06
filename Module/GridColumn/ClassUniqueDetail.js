Ext.ns("app.harmony.system.Module.GridColumn");
$import('app.harmony.system.BaseClass.DetailPanel');
app.harmony.system.Module.GridColumn.ClassUniqueDetail = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.GridColumn.ClassUniqueDetail.superclass.constructor.call(this, config);
};
/**
 * add by zhanqiuwei 2012-12-28 详情页的js
 * @class app.module.DataMaintenance.LVolCutPowerPanel
 * @extends Ext.Panel
 */
Ext.extend(app.harmony.system.Module.GridColumn.ClassUniqueDetail,app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : {
        autoHeight: true,
        bodyStyle: Ext.isIE ? 'padding:28px 0 5px 5px;' : 'padding:28px 5px;',
        border: false,
        style: {
            "margin-left": "5px", 
            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
        },
        layout:'table',
        layoutConfig : {
        	columns: 6
        },
        defaults:{border:false,bodyStyle: 'padding-top:8px;',  
			layout:'form',frame:false,labelAlign:'right',labelWidth:70,width:200 
		},
		items:[
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'关键字名称',anchor:'100%',name:'value(keyname)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'属性名称',anchor:'100%',name:'value(property)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'提示消息',anchor:'100%',name:'value(message)'}}, 	
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'记录ID',anchor:'100%',name:'value(rid)'}},		   
		   	{colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'模块ID',anchor:'100%',name:'value(classid)'}}
		]
	}
});