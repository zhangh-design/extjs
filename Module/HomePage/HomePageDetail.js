Ext.ns("app.harmony.system.Module.HomePage");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
$import("app.ext3-2.script.DateTimeField");
app.harmony.system.Module.HomePage.HomePageDetail = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.HomePage.HomePageDetail.superclass.constructor.call(this, config);
};

Ext.extend(app.harmony.system.Module.HomePage.HomePageDetail,app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : [{
            autoHeight: true,
            autoWidth : false,
            width : 400,
            bodyStyle: Ext.isIE ? 'padding:20px 0 5px 0px;' : 'padding:10px 15px;',
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
				layout:'form',frame:false,labelAlign:'right',labelWidth:45,width:200 
			},
			items:[
				{colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'序号',anchor:'100%',name:'value(serialnumber)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'分类名',anchor:'100%',name:'value(name)'}},
			    {colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'列数',anchor:'100%',name:'value(colspan)'}},
			    {colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'行数',anchor:'100%',name:'value(rowspan)'}},
			    {colspan:4,width:400,items:{xtype:'textarea',height:60,style:'margin:0;',fieldLabel:'备注',anchor:'100%',name:'value(remark)'}},
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'RID',anchor:'100%',name:'value(rid)'}},
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'局ID',anchor:'100%',name:'value(orgid)'}},
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'局名称',anchor:'100%',name:'value(orgname)'}},
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'部门ID',anchor:'100%',name:'value(deptid)'}},
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'部门名称',anchor:'100%',name:'value(deptname)'}},
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'状态',anchor:'100%',name:'value(flag)'}},
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'操作人ID',anchor:'100%',name:'value(oprtid)'}},
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'操作人',anchor:'100%',name:'value(oprtname)'}},
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'操作时间',anchor:'100%',name:'value(oprttime)'}}
			]
		}]
});