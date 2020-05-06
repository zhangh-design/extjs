Ext.ns("app.harmony.system.Module.ModuleCache");
$import('app.harmony.system.BaseClass.DetailPanel');
app.harmony.system.Module.ModuleCache.RemoteLogInfoDetail = Ext.extend(app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : {
		autoHeight: true,
        autoWidth : false,
        width : 860,
        bodyStyle: Ext.isIE ? 'padding:28px 0 5px 5px;' : 'padding:28px 5px;',
        border: false,
        style: {
            "margin-left": "0px",
            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
        },
        layout:'table',
        layoutConfig : {
        	columns: 6
        },
        defaults:{border:false,bodyStyle: 'padding-top:0px;',  
			layout:'form',frame:false,labelAlign:'right',width:270 
		},
		items:[
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'人员ID',anchor:'100%',name:'value(OprtID)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'人员编号',anchor:'100%',name:'value(OprtNO)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'人员名称',anchor:'100%',name:'value(OprtName)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'角色ID',anchor:'100%',name:'value(SysRoleID)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'部门ID',anchor:'100%',name:'value(DeptID)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'部门编号',anchor:'100%',name:'value(DeptNO)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'部门名称',anchor:'100%',name:'value(DeptName)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'局ID',anchor:'100%',name:'value(OrgID)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'局名称',anchor:'100%',name:'value(OrgName)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'局编号',anchor:'100%',name:'value(OrgNO)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'创建时间',anchor:'100%',name:'value(CreateTime)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'修改时间',anchor:'100%',name:'value(ModifyTime)'}}
			]
		}
});