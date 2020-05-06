Ext.ns("app.harmony.system.Module.WorkFlow");
$import('app.harmony.system.BaseClass.DetailPanel');
app.harmony.system.Module.WorkFlow.ObjModelDetail = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.ObjModelDetail.superclass.constructor.call(this, config);
};
/**
 * add by zhanqiuwei 2012-12-28 详情页的js
 * @class app.module.DataMaintenance.LVolCutPowerPanel
 * @extends Ext.Panel
 */
Ext.extend(app.harmony.system.Module.WorkFlow.ObjModelDetail,app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : {
        autoHeight: true,
        autoWidth: false,
        bodyStyle: Ext.isIE ? 'padding:28px 0 5px 0px;' : 'padding:28px 0px;',
        border: false,
        style: {
            "margin-left": "0px",
            "margin-bottom":"50px",
            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
        },
        layout:'table',
        layoutConfig : {
        	columns: 2
        },
        defaults:{border:false,bodyStyle: 'padding-top:8px;',  
			layout:'form',frame:false,labelAlign:'right',labelWidth:85,width:300 
		},
		items:[
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'对象名称',anchor:'100%',name:'value(name)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'对象表名',anchor:'100%',name:'value(tablename)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'对象描述',anchor:'100%',name:'value(describe)'}}, 	
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'记录ID',anchor:'100%',name:'value(rid)'}},		   
		   	{colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'模块组ID',anchor:'100%',name:'value(moduleclassid)'}}
		]
	}

});