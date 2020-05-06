Ext.ns("app.harmony.system.Module.DevManage");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
app.harmony.system.Module.DevManage.SysRoleDetail = Ext.extend(app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : {
		autoHeight: true,
        autoWidth : false,
        width : 600,
        bodyStyle: Ext.isIE ? 'padding:28px 0 5px 5px;' : 'padding:28px 5px;',
        border: false,
        style: {
            "margin-left":"0px",
            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
        },
        layout:'table',
        layoutConfig : {
        	columns: 4
        },
        defaults:{border:false,bodyStyle: 'padding-top:8px;',  
			layout:'form',frame:false,labelAlign:'right',width:270
		},
		items:[
				{colspan:2,items:{xtype:'ux_combobox',style:'margin:0;',
					name:'value(prid)',
					hiddenName:'value(prid)',
					fieldLabel:'上级角色',
					width:180,
					tableName : 'mis_base.sysRole'
				  }
				},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称',anchor:'100%',name:'value(name)'}},
				{colspan:2,items:{xtype:'ux_combobox',style:'margin:0;',
					name:'value(oprtid)',
					hiddenName:'value(oprtid)',
					fieldLabel:'操&nbsp;作&nbsp;人',
					width:180,
					tableName : 'mis_base.v_operator_u'
				  }
				},
				{colspan:2,items:{xtype:'datetimefield',style:'margin:0;',fieldLabel:'操作时间',format:'Y-m-d H:i:s',anchor:'100%',name:'value(oprttime)'}},
			    
			    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'记&nbsp;录&nbsp;ID',anchor:'100%',name:'value(rid)'}}
			]
		}

});