Ext.ns("app.harmony.system.Module.ModuleImport");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
app.harmony.system.Module.ModuleImport.ClassImportFieldDetail = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.ModuleImport.ClassImportFieldDetail.superclass.constructor.call(this, config);
};
/**
 * add by zhanqiuwei 2012-12-28 详情页的js
 * @class app.module.DataMaintenance.LVolCutPowerPanel
 * @extends Ext.Panel
 */
Ext.extend(app.harmony.system.Module.ModuleImport.ClassImportFieldDetail,app.harmony.system.BaseClass.DetailPanel,{
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
        	columns: 4
        },
        defaults:{border:false,bodyStyle: 'padding-top:8px;',  
			layout:'form',frame:false,labelAlign:'right',labelWidth:80,width:230 
		},
		items:[
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'字段英文名',anchor:'100%',name:'value(nameen)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'字段中文名',anchor:'100%',name:'value(namecn)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'取值excel列',anchor:'100%',name:'value(colnum)'}}, 
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(notnull)',
				fieldLabel:'是否非空',
				haveEmptyOption : false
			})},
			//type="string"或者空，则表示该字段是字符型的，如果type="number"则表示是数字型的，如果type="date"则表示该列是日期型的
			{colspan:2,items:new Ext.ux.ComboBox({
				name:'value(type)',
				fieldLabel:'字段类型',
				haveEmptyOption : false,
				tableName : 'MIS_sys.V_ImportFieldType'
			})},
			//defaultType=1 则defaultvalue为常量，
			//defaultType=2 则defaultvaluedefaultvalue要从logInfo里读的属性，
			//defaulttype=3 则defaultvalue为要执行的方法，
			//defaulttype=4 则defaultvalue中要填另一个列的英文名
			{colspan:2,items:new Ext.ux.ComboBox({
				name:'value(defaulttype)',
				fieldLabel:'默认值类型',
				haveEmptyOption : false,
				tableName : 'MIS_sys.V_ImportFieldDefaultType'
			})},
			//常量
			//属性名（oprtid，oprtname,deptid,deptname,orgid,orgname）、
			//方法名（getNewRID，getNowDateTime）
			//列名（同表中的）
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'默认值数值',anchor:'100%',
			name:'value(defaultvalue)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'日期显示格式',anchor:'100%',name:'value(format)'}}, 
/*		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'映射视图',anchor:'100%',name:'value(validatetable)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'映射字段',anchor:'100%',name:'value(validatefield)'}}, 
*/		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'对应视图',anchor:'100%',name:'value(reftable)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'对应字段',anchor:'100%',name:'value(reffield)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'关联字段',anchor:'100%',name:'value(refobjectfield)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'外置取值方法',anchor:'100%',name:'value(refobject)'}}, 

		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'记录ID',anchor:'100%',name:'value(rid)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'类ID',anchor:'100%',name:'value(classid)'}}
		]
	}
});