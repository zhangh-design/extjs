Ext.ns("app.harmony.system.Module.PrintConfig");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
app.harmony.system.Module.PrintConfig.PrintConfigDetail = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.PrintConfig.PrintConfigDetail.superclass.constructor.call(this, config);
};
Ext.extend(app.harmony.system.Module.PrintConfig.PrintConfigDetail,app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : {
        autoHeight: true,
        width : 590,
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
			layout:'form',frame:false,labelAlign:'right',labelWidth:50,width:140 
		},
		items:[
			{colspan:4,width:590,items:{xtype:'textarea',style:'margin:0;',height:230,width:590,fieldLabel:'SQL',anchor:'100%',name:'value(sql)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'模块类ID',anchor:'100%',name:'value(classid)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'RID',anchor:'100%',name:'value(rid)'}}
		]
	}
});