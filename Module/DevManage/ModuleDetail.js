Ext.ns("app.harmony.system.Module.DevManage");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
$styleSheet("app.harmony.user.WorkPaper.style.detailForm");
app.harmony.system.Module.DevManage.ModuleDetail = Ext.extend(app.harmony.system.BaseClass.DetailPanel,{
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
				{colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'记&nbsp;&nbsp;录&nbsp;&nbsp;ID',anchor:'100%',name:'value(rid)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'名称(中文)',anchor:'100%',name:'value(namecn)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'名称(英文)',anchor:'100%',name:'value(nameen)'}},
				{colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'模块组ID',anchor:'100%',name:'value(moduleclassid)'}},
				{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'所在动态库',anchor:'100%',name:'value(dll)'}},
			    {colspan:2,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(dlltype)',
					hiddenName:'value(dlltype)',
					fieldLabel:'动态库类型',
					width:180,
					tableName : 'mis_sys.v_interfaceType'
				}
			   },
				{colspan:2,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(moduleusertypeid)',
					hiddenName:'value(moduleusertypeid)',
					fieldLabel:'模块使用者',
					width:180,
					tableName : 'mis_sys.v_oprtType'
				}
				},
			    {colspan:2,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(isouter)',
					hiddenName:'value(isouter)',
					fieldLabel:'外部调用',
					width:180,
					tableName : 'mis_sys.v_boolean'
				}
			   },
			    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',anchor:'100%',name:'value(url)'}},
			    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'模块图标',anchor:'100%',name:'value(imgpath)'}},
			    {colspan:2,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'序&nbsp;&nbsp;列&nbsp;&nbsp;号',anchor:'100%',name:'value(seqno)'}},
			    {colspan:2,items:{xtype:'ux_combobox',style:'margin:0;', 
					name:'value(inlayhtml)',
					hiddenName:'value(inlayhtml)',
					fieldLabel:'内置HTML',
					width:180,
					tableName : 'mis_sys.v_boolean'
				}
			    },
			    {colspan:6,width:810,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'JSURL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',anchor:'100%',name:'value(jsurl)'}}
			]
		}

});