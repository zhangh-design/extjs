Ext.ns("app.harmony.system.Module.RoleMenu");
$import("app.harmony.system.BaseClass.DetailPanel");
$import('app.harmony.system.Plugin.ComboBox');
app.harmony.system.Module.RoleMenu.TabAddPanel = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.RoleMenu.TabAddPanel.superclass.constructor.call(this, config);
};
/**
 * add by zhanqiuwei 2012-12-28 详情页的js
 * @class app.module.DataMaintenance.LVolCutPowerPanel
 * @extends Ext.Panel
 */
Ext.extend(app.harmony.system.Module.RoleMenu.TabAddPanel,app.harmony.system.BaseClass.DetailPanel,{
    dataDetail : [{
	        bodyStyle: Ext.isIE ? 'padding:28px 0 5px 0px;' : 'padding:28px 0px;',
	        border: false,
	        style: {
	            "margin-left": "0px",
	            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
	        },
	        layout:'table',
	        layoutConfig : {
	        	columns: 4
	        },
	        defaults:{border:false,bodyStyle: 'padding-top:8px;',  
				layout:'form',frame:false,labelAlign:'right',labelWidth:85,width:280 
			},
			items:[
			     {colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'序号',anchor:'100%',name:'value(seqno)'}},
			     {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'按钮ID',anchor:'100%',name:'value(btnid)'}},
			     {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'按钮名',anchor:'100%',name:'value(text)'}},
			     {colspan:2,items:{
			    	name:'value(pbtn)',
			    	url:'RoleMenuCombo.do',
			    	action : 'getParentBtn',
			    	xtype:'ux_combobox',
			    	style:'margin:0;', 
					fieldLabel:'父按钮名',
					tableName : 'mis_sys.v_boolean',
					gridField : ['rid','classname','moduleid']
				 }},
			     {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'按钮图片',anchor:'100%',name:'value(btncss)'}},
			     {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'触发事件',anchor:'100%',name:'value(btnevent)'}},
			     {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'按钮类型',anchor:'100%',name:'value(btntype)'}},
			     {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'模块ID',anchor:'100%',name:'value(moduleid)'}},
			     {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'className',anchor:'100%',name:'value(classname)'}},
			     {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'按钮类型',anchor:'100%',name:'value(defaultpermission)'}},
			     {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'记录ID',anchor:'100%',name:'value(rid)'}}
			]
		}]

});