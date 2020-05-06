Ext.ns("app.harmony.system.Module.WorkFlow");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
app.harmony.system.Module.WorkFlow.ObjModelSubDetail = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.WorkFlow.ObjModelSubDetail.superclass.constructor.call(this, config);
};
/**
 * add by zhanqiuwei 2012-12-28 详情页的js
 * @class app.module.DataMaintenance.LVolCutPowerPanel
 * @extends Ext.Panel
 */
Ext.extend(app.harmony.system.Module.WorkFlow.ObjModelSubDetail,app.harmony.system.BaseClass.DetailPanel,{
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
			layout:'form',frame:false,labelAlign:'right',labelWidth:100,width:230 
		},
		items:[
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'属性名称',anchor:'100%',name:'value(namecn)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'属性代码',anchor:'100%',name:'value(nameen)'}}, 
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(fieldtypeid)',
				tableName : 'Mis_Sys.V_FieldType',
				fieldLabel:'属性类型',
				haveEmptyOption : false
			})},
			{colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'宽度',anchor:'100%',name:'value(length)'}}, 	
			{colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'显示宽度',anchor:'100%',name:'value(visiblelength)'}}, 	
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(bvisible)',
				fieldLabel:'是否显示',
				haveEmptyOption : false
			})},
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(bdefaultprint)',
				fieldLabel:'是否默认打印',
				haveEmptyOption : false
			})},
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(unitid)',
				tableName : 'Mis_Sys.v_unit',
				fieldLabel:'单位',
				haveEmptyOption : false
			})},
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(editor)',
				tableName : 'MIS_Sys.V_EditorType',
				fieldLabel:'编辑器',
				haveEmptyOption : false
			})},
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(limit)',
				tableName : 'Mis_Sys.V_DataRestriction',
				fieldLabel:'属性限制',
				haveEmptyOption : false
			})},
			{colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'属性小数位',anchor:'100%',name:'value(precision)'}},
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'默认值',anchor:'100%',name:'value(defaultvalue)'}},
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'参考对象(中文)',anchor:'100%',name:'value(refobjectnamecn)'}},
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'映射列字段(中文)',anchor:'100%',name:'value(reffieldnamecn)'}},
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'映射名称字段(中文)',anchor:'100%',name:'value(refedfieldnamecn)'}},
			{colspan:2,items:new Ext.ux.ComboBox({
				name:'value(bmainfield)',
				fieldLabel:'是否为关键字',
				haveEmptyOption : false
			})},
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'格式掩码',anchor:'100%',name:'value(mask)'}},	
			{colspan:2,items:new Ext.ux.ComboBox({
				name:'value(bself)',
				fieldLabel:'是否为添加的字段',
				haveEmptyOption : false
			})},
			{colspan:2,items:new Ext.ux.ComboBox({
				name:'value(bcanbatchupdate)',
				fieldLabel:'是否能批量更新',
				haveEmptyOption : false
			})},
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'格式掩码',anchor:'100%',name:'value(updatefieldname)'}},		
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'参考对象(中文)ID',anchor:'100%',name:'value(refobjectid)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'参考对象(英文)',anchor:'100%',name:'value(refobjectnameen)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'映射列字段(中文)ID',anchor:'100%',name:'value(reffieldid)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'映射列字段(英文)',anchor:'100%',name:'value(reffieldnameen)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'映射名称字段(中文)ID',anchor:'100%',name:'value(refedfieldid)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'映射名称字段(英文)',anchor:'100%',name:'value(refedfieldnameen)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'记录ID',anchor:'100%',name:'value(rid)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'对象ID',anchor:'100%',name:'value(sysobjectid)'}}
		]
	}
});