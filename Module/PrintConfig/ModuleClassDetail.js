Ext.ns("app.harmony.system.Module.PrintConfig");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
app.harmony.system.Module.PrintConfig.ModuleClassDetail = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.PrintConfig.ModuleClassDetail.superclass.constructor.call(this, config);
};
/**
 * add by zhanqiuwei 2012-12-28 详情页的js
 * @class app.module.DataMaintenance.LVolCutPowerPanel
 * @extends Ext.Panel
 */
Ext.extend(app.harmony.system.Module.PrintConfig.ModuleClassDetail,app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : {
        autoHeight: true,
        autoWidth: false,
        bodyStyle: Ext.isIE ? 'padding:28px 0 5px 0px;' : 'padding:28px 0px;',
        border: false,
        style: {
            "margin-left": "0px",
            "margin-bottom":"5px",
            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
        },
        layout:'table',
        layoutConfig : {
        	columns: 2
        },
        defaults:{border:false,bodyStyle: 'padding-top:8px;',  
			layout:'form',frame:false,labelAlign:'left',labelWidth:70,width:230 
		},
		items:[
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'名称',anchor:'100%',name:'value(classname)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'表名',anchor:'100%',name:'value(tablename)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'表注释',anchor:'100%',name:'value(tablecomment)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'表头行数',anchor:'100%',name:'value(titleline)'}}, 	
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(insertbyline)',
				fieldLabel:'按行导入',
				haveEmptyOption : false
			})},
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'继承Action',anchor:'100%',name:'value(importaction)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'表序列名',anchor:'100%',name:'value(tablesequence)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'导入开始页',anchor:'100%',name:'value(startsheet)'}}, 	
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'记录ID',anchor:'100%',name:'value(rid)'}},		   
		   	{colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'模块ID',anchor:'100%',name:'value(moduleid)'}}
		]
	}

});