Ext.ns("app.harmony.system.Module.GridColumn");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');

app.harmony.system.Module.GridColumn.ClassFieldDetail = Ext.extend(app.harmony.system.BaseClass.DetailPanel,{
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
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'字段英文名',anchor:'100%',name:'value(nameen)'}}, 	
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'字段中文名',anchor:'100%',name:'value(namecn)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'排序编号',anchor:'100%',name:'value(sortnum)'}}, 
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(hidden)',
				fieldLabel:'隐藏',
				haveEmptyOption : false
			})},
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(readonly)',
				fieldLabel:'只读',
				haveEmptyOption : false
			})},
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(notnull)',
				fieldLabel:'非空',
				haveEmptyOption : false
			})},
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(sortable)',
				fieldLabel:'排序',
				haveEmptyOption : false
			})},
			{colspan:2,items:new Ext.ux.ComboBox({
				name:'value(fieldtype)',
				tableName : 'Mis_Config.V_FileType',
				fieldLabel:'字段类型',
				haveEmptyOption : false
			})},
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'列宽',anchor:'100%',name:'value(width)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'调用地址',anchor:'100%',name:'value(url)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'调用方法',anchor:'100%',name:'value(action)'}}, 
		    {colspan:2,items:new Ext.ux.ComboBox({
				name:'value(align)',
				tableName : 'Mis_Config.V_Align',
				fieldLabel:'对齐方式',
				haveEmptyOption : false
			})},
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'最大长度',anchor:'100%',name:'value(maxlength)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'初始值',anchor:'100%',name:'value(initvalue)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'初始值类型',anchor:'100%',name:'value(initvaluetype)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'保存值',anchor:'100%',name:'value(savevalue)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'保存值类型',anchor:'100%',name:'value(savevaluetype)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'视图表',anchor:'100%',name:'value(viewtable)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'树节点名称',anchor:'100%',name:'value(nodename)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'选择树节点控制',anchor:'100%',name:'value(selmodel)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'下拉框宽度',anchor:'100%',name:'value(listwidth)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'下拉框内部Grid关联外部的字段名',anchor:'100%',name:'value(gridfield)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'下拉框内部Grid列解析',anchor:'100%',name:'value(gridcm)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'下拉框内部Grid列字段名',anchor:'100%',name:'value(griddm)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'时间的显示格式',anchor:'100%',name:'value(format)'}}, 
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'记录ID',anchor:'100%',name:'value(rid)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'是否是导入字段',anchor:'100%',name:'value(isimport)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'类ID',anchor:'100%',name:'value(classid)'}}
		]
	}
});