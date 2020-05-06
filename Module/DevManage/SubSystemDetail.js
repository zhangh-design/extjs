Ext.ns("app.harmony.system.Module.DevManage");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
$styleSheet("app.harmony.user.WorkPaper.style.detailForm");
app.harmony.system.Module.DevManage.SubSystemDetail = Ext.extend(app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : {
		autoHeight: true,
        autoWidth : false,
        width : 600,
        bodyStyle: Ext.isIE ? 'padding:28px 0 5px 5px;' : 'padding:28px 5px;',
        border: false,
        style: {
            "margin-left": "0px",
            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
        },
        layout:'table',
        layoutConfig : {
        	columns: 4
        },
        defaults:{border:false,bodyStyle: 'padding-top:0px;',  
			layout:'form',frame:false,labelAlign:'right',width:270
		},
		items:[
				{colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'记&nbsp;&nbsp;&nbsp;录&nbsp;&nbsp;&nbsp;ID',anchor:'100%',name:'value(rid)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'名称(中文)',anchor:'100%',name:'value(namecn)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'名称(英文)',anchor:'100%',name:'value(nameen)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'表&nbsp;&nbsp;空&nbsp;&nbsp;间',anchor:'100%',name:'value(tablespacename)'}},
				{colspan:2,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(moduleusertypeid)',
					hiddenName:'value(moduleusertypeid)',
					fieldLabel:'模块使用者',
					width:180,
					tableName : 'mis_sys.v_oprtType'
				  }
				},
			    {colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'序&nbsp;&nbsp;列&nbsp;&nbsp;号',anchor:'100%',name:'value(seq)'}}
			]
		}

});