Ext.ns("app.harmony.system.Module.HomePage");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
$import("app.ext3-2.script.DateTimeField");
app.harmony.system.Module.HomePage.HomePageSubDetail = function (config) {
    Ext.apply(this, config);
    app.harmony.system.Module.HomePage.HomePageSubDetail.superclass.constructor.call(this, config);
};

Ext.extend(app.harmony.system.Module.HomePage.HomePageSubDetail,app.harmony.system.BaseClass.DetailPanel, {
    dataDetail: [{
        autoHeight: true,
        autoWidth: false,
        width: 650,
        bodyStyle: Ext.isIE ? 'padding:20px 0 5px 10px;' : 'padding:10px 15px;',
        border: false,
        style: {
            "margin-left": "10px",
            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"
        },
        layout: 'table',
        layoutConfig: {
            columns: 6
        },
        defaults: {
            border: false,
            bodyStyle: 'padding-top:3px;',
            layout: 'form',
            frame: false,
            labelAlign: 'right',
            labelWidth: 75,
            width: 200
        },
        items: [{
                colspan: 2,
                items: {
                    xtype: 'numberfield',
                    style: 'margin:0;',
                    fieldLabel: '序号',
                    anchor: '100%',
                    name: 'value(serialnumber)'
                }
            }, {
                colspan: 2,
                style: 'margin:0;',
                items: new Ext.ux.ComboBox({
                    style: 'margin:0;',
                    fieldLabel: '分类名称',
                    name: 'value(prid)',
                    hiddenName: 'value(prid)',
                    tableName: 'mis_report.v_ChartSort_All',
                    anchor: '100%',
                    typeAhead: true
                })
            }, {
                colspan: 2,
                items: {
                    xtype: 'textfield',
                    style: 'margin:0;',
                    fieldLabel: '名称',
                    anchor: '100%',
                    name: 'value(name)'
                }
            }, {
                colspan: 2,
                style: 'margin:0;',
                items: new Ext.ux.ComboBox({
                    style: 'margin:0;',
                    fieldLabel: '表格类型',
                    name: 'value(type)',
                    hiddenName: 'value(type)',
                    tableName: 'mis_sys.V_TableType',
                    anchor: '100%',
                    haveEmptyOption: false
                })
            }, {
                colspan: 2,
                items: {
                    xtype: 'textfield',
                    style: 'margin:0;',
                    fieldLabel: 'JS路径',
                    anchor: '100%',
                    name: 'value(jsurl)'
                }
            },

            {
                colspan: 2,
                style: 'margin:0;',
                items: new Ext.ux.ComboBox({
                    style: 'margin:0;',
                    fieldLabel: '显示类型',
                    name: 'value(displaytype)',
                    hiddenName: 'value(displaytype)',
                    tableName: 'mis_sys.V_displaytype',
                    anchor: '100%',
                    haveEmptyOption: false
                })
            },
            {
                colspan: 2,
                items: {
                    xtype: 'textfield',
                    style: 'margin:0;',
                    fieldLabel: 'Action',
                    anchor: '100%',
                    name: 'value(action)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'textfield',
                    style: 'margin:0;',
                    fieldLabel: '字段x',
                    anchor: '100%',
                    name: 'value(x)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'textfield',
                    style: 'margin:0;',
                    fieldLabel: '字段y',
                    anchor: '100%',
                    name: 'value(y)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'textfield',
                    style: 'margin:0;',
                    fieldLabel: 'X名称',
                    anchor: '100%',
                    name: 'value(xname)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'textfield',
                    style: 'margin:0;',
                    fieldLabel: 'Y名称',
                    anchor: '100%',
                    name: 'value(yname)'
                }
            }, {
                colspan: 2,
                style: 'margin:0;',
                items: new Ext.ux.ComboBox({
                    style: 'margin:0;',
                    fieldLabel: '默认显示',
                    name: 'value(display)',
                    hiddenName: 'value(display)',
                    anchor: '100%',
                    haveEmptyOption: false
                })
            }, {
                colspan: 2,
                style: 'margin:0;',
                items: new Ext.ux.ComboBox({
                    style: 'margin:0;',
                    fieldLabel: '首页显示',
                    name: 'value(ishomepage)',
                    hiddenName: 'value(ishomepage)',
                    anchor: '100%',
                    haveEmptyOption: false
                })
            }, {
                colspan: 2,
                style: 'margin:0;',
                items: new Ext.ux.ComboBox({ //是的话会在高级按钮出现的表单中出现一个菜单，里边会显示同类的其他报表
                    style: 'margin:0;',
                    fieldLabel: '是否报表',
                    name: 'value(isreport)',
                    hiddenName: 'value(isreport)',
                    anchor: '100%',
                    haveEmptyOption: false
                })
            }, {
                colspan: 2,
                style: 'margin:0;',
                items: new Ext.ux.ComboBox({
                    style: 'margin:0;',
                    fieldLabel: '状态',
                    name: 'value(flag)',
                    hiddenName: 'value(flag)',
                    style: 'margin:0;',
                    tableName: 'MIS_Sys.V_SysCommonFlag',
                    anchor: '100%',
                    typeAhead: true
                })
            }, {
                colspan: 2,
                style: 'margin:0;',
                items: new Ext.ux.ComboBox({
                    style: 'margin:0;',
                    fieldLabel: '某局可见',
                    name: 'value(displaydept)',
                    hiddenName: 'value(displaydept)',
                    style: 'margin:0;',
                    tableName: 'mis_base.department',
                    anchor: '100%',
                    typeAhead: true
                })
            }, {
                colspan: 4,
                width: 400,
                items: {
                    xtype: 'textfield',
                    style: 'margin:0;',
                    fieldLabel: '存储过程',
                    anchor: '100%',
                    name: 'value(procedurename)'
                }
            },

            {
                colspan: 6,
                width: 600,
                items: {
                    xtype: 'textarea',
                    height: 30,
                    style: 'margin:0;',
                    fieldLabel: '备注',
                    anchor: '100%',
                    name: 'value(remark)'
                }
            }, {
                colspan: 6,
                width: 600,
                items: {
                    xtype: 'textarea',
                    height: 90,
                    style: 'margin:0;',
                    fieldLabel: 'sql语句',
                    anchor: '100%',
                    name: 'value(sql)'
                }
            },
            {
						colspan : 6,
						width : 600,
						items : {
							xtype : 'textarea',
							height : 30,
							style : 'margin:0;',
							fieldLabel : '分组sql',
							anchor : '100%',
							name : 'value(groupby)'
						}
					}, {
						colspan : 6,
						width : 600,
						items : {
							xtype : 'textarea',
							height : 30,
							style : 'margin:0;',
							fieldLabel : '排序sql',
							anchor : '100%',
							name : 'value(orderby)'
						}
					}, 
            {
                colspan: 6,
                width: 600,
                items: {
                    xtype: 'textarea',
                    height: 30,
                    style: 'margin:0;',
                    fieldLabel: '报表列名',
                    anchor: '100%',
                    name: 'value(namecn)'
                }
            }, {
                colspan: 6,
                width: 600,
                items: {
                    xtype: 'textarea',
                    height: 30,
                    style: 'margin:0;',
                    fieldLabel: '报表字段',
                    anchor: '100%',
                    name: 'value(nameen)'
                }
            }, {
                colspan: 6,
                width: 600,
                items: {
                    xtype: 'textarea',
                    height: 30,
                    style: 'margin:0;',
                    fieldLabel: '报表列宽',
                    anchor: '100%',
                    name: 'value(colwidth)'
                }
            },

            {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: 'RID',
                    anchor: '100%',
                    name: 'value(rid)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: 'PRID',
                    anchor: '100%',
                    name: 'value(prid)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: '局ID',
                    anchor: '100%',
                    name: 'value(orgid)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: '局名称',
                    anchor: '100%',
                    name: 'value(orgname)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: '部门ID',
                    anchor: '100%',
                    name: 'value(deptid)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: '部门名称',
                    anchor: '100%',
                    name: 'value(deptname)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: '模块ID',
                    anchor: '100%',
                    name: 'value(moduleid)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: '操作人ID',
                    anchor: '100%',
                    name: 'value(oprtid)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: '操作人',
                    anchor: '100%',
                    name: 'value(oprtname)'
                }
            }, {
                colspan: 2,
                items: {
                    xtype: 'hidden',
                    style: 'margin:0;',
                    fieldLabel: '操作时间',
                    anchor: '100%',
                    name: 'value(oprttime)'
                }
            }
        ]
    }]
});