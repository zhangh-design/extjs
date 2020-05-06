Ext.ns("app.harmony.system.Module.GridColumn");
$import('app.harmony.system.BaseClass.DetailPanel');
app.harmony.system.Module.GridColumn.ModuleCopyDetail = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.GridColumn.ModuleCopyDetail.superclass.constructor.call(this, config);
};
function setOtherValue(node) {
	var form = this.ownerCt.ownerCt.ownerCt.form;
	form.findField('value(classname)').setValue(node.text.split('-')[1]);
	form.findField('value(tablecomment)').setValue(node.text.split('-')[2]);
	if(node.attributes.treelevel=='3'){//选中模块复制
		form.findField('value(copymoduleid)').setValue(node.id);
	}else
		form.findField('value(copymoduleid)').setValue('');
};
/**
 * add by zhanqiuwei 2012-12-28 详情页的js
 * @class app.module.DataMaintenance.LVolCutPowerPanel
 * @extends Ext.Panel
 */
Ext.extend(app.harmony.system.Module.GridColumn.ModuleCopyDetail,app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : {
        autoHeight: true,
        autoWidth: false,
        bodyStyle: Ext.isIE ? 'padding:28px 0 5px 0px;' : 'padding:28px 0px;',
        border: false,
        style: {
            "margin-left": "0px",
            "margin-bottom":"50px",
            "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
        },
        layout:'table',
        layoutConfig : {
        	columns: 2
        },
        defaults:{border:false,bodyStyle: 'padding-top:8px;',  
			layout:'form',frame:false,labelAlign:'right',labelWidth:85,width:400 
		},
		items:[
		    {colspan:2,items:new Ext.ux.ComboBoxTree({
				fieldLabel: '复制的模块',
				style: 'margin:0;',					
				anchor: '100%',
				fieldClass:'x-form-text1',
				name:'value(copymodule)',
				autoLoad:true,
				listWidth : 300,
				mode:'local',
				displayField:'id',
				valueField:'id',
				triggerAction:'all',
				allowBlank:true,
				autoScroll:false,
				treeUrl:'ModuleTree.do?action=moduleClass',
				forceSelection:true,
				rootVisible:true,
				allowBlank : false,
				selectNodeModel : 'canSelect',
				rootId:'0',
				rootText:'系统',
				setOtherValue:setOtherValue
			})},
			{colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'名称',anchor:'100%',name:'value(classname)'}}, 
		    {colspan:2,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'表注释',anchor:'100%',name:'value(tablecomment)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'复制模块ID',anchor:'100%',name:'value(copymoduleid)'}},
		    {colspan:2,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'模块ID',anchor:'100%',name:'value(moduleid)'}}
		]
	},
	saveForm : function (){ 
		var form = this.getForm();
		var params = {object:'copy',moduleID:this.moduleID,className:this.className,token:token};
		if(!this.validate(form))
			return;
		if(parent.window.openWindow.PGrid.getStore().getCount()>0&&!Ext.isEmpty(form.findField('value(copymoduleid)').getValue())){
			Ext.Msg.alert("提示","当前模块下已经存在数据，不能进行整个模块列的复制!");
			return;
		}
		form.submit({
			url : this.url,
			waitTitle : '提示',
			method : 'POST',
			waitMsg : '提交保存中,请稍候....',
			params: params, 
			scope : this,
			success : function(form, action) {
				var returnMsg = Ext.util.JSON.decode(action.response.responseText);
				if(returnMsg.success){
					if(parent.window.openWindow){
						if(!Ext.isEmpty(returnMsg.dataID))
						{
							var dataID = returnMsg.dataID;
								parent.window.openWindow.PGrid.reloadGrid(dataID);
						}
						parent.window.openWindow.close();
					}else{
						document.location.reload();
					}
				}else{
	      			alert(returnMsg.error);
		 		}
			},
			failure : function(form, action) {
				var errmsg = action.result.error;
				alert(errmsg);
			}
		});
	}

});