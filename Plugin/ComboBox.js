Ext.ns('app.harmony.system.Plugin')
Ext.ux.ComboBox = function(config) {
	Ext.apply(this, config);
	this.initCombo();
	Ext.ux.ComboBox.superclass.constructor.call(this, config);
}


Ext.extend(Ext.ux.ComboBox, Ext.form.ComboBox, {
	/********************** Begin ComboBox的参数 *************************/
	url : 'PublicComboBox.do',					//ComboBox的URL参数
	action : 'select',							//调用的方法名
	tableName : 'mis_sys.v_boolean',			//查询的表名，查询的字段是rid,name
	gridField : [],								//联动的上级字段,若上级字段没有选择,此下拉框不能选择,上级改变选项,此下拉框重新加载对应数据
	relatedField : [],							//相关的字段,通过id去查找
	clearField : [],							//联动选择清除的字段,通过id去查找
	allowBlank : true,							//是否允许为空,默认true
	store : null,								
	editable : false,							//ComboBox编辑属性,默认为false
	anchor :'100%',
	forceSelection : true,
	triggerAction : 'all',
	displayField:'name',						//显示的值
	valueField:'rid',							//实际的值
	haveEmptyOption : true,						//是否在第一行添加空值
	selectFirstRow : false,						//是否选中第一行
	selectByRid : '',							//根据RID选中对应行
	morecolumn : '',							//获取更多的列值
	/********************** End ComboBox的参数 *************************/
	
	/*
	 * 给ComboBox在第一行添加一个空值.
	 */
	addEmptyOption : function(records){
		if(this.haveEmptyOption) {
			records.insert(0,new Ext.data.Record({name:'',rid:''}));
			if(!this.tpl) {
				this.tpl = new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item">{', 
								this.displayField , ':this.blank}</div></tpl>', {blank: function(value){return value==='' ? '&nbsp' : value;}
				  });
			}
		}
		var val = this.getValue();
		if(!Ext.isEmpty(val)) {
			this.setValue(val);
		}
		this.fireEvent("loadData",val);
	},
	initComponent : function(){
		Ext.ux.ComboBox.superclass.initComponent.call(this);
		this.addEvents("loadData");
	},
	/** 只能在form表单中用 */
	listeners: {
 		beforequery : function(a){
 			if(a.combo.gridField.length>0) {
 				var form = a.combo.getBubbleTarget().getBubbleTarget().getBubbleTarget().getForm();
 				Ext.each(a.combo.gridField,function(item){
 					a.combo.getStore().setBaseParam(item, form.findField("value("+item+")").getValue());
 				})
			}
 		},
 		select : function(combo){
 			if(combo.clearField.length>0) {
 				Ext.each(combo.clearField,function(item){
 					Ext.getCmp(item).setValue('');
 					if(Ext.getCmp(item).initialConfig.relatedField.length>0) {
 						Ext.each(Ext.getCmp(item).initialConfig.relatedField,function(field){
 							Ext.getCmp(item).getStore().setBaseParam(field, Ext.getCmp(field).getValue());
 		 				})
 		 				Ext.getCmp(item).getStore().load();
 					}
 				})
 			}
 		},
 		scope : this
	},
	initCombo : function(){
		this.store = new Ext.data.JsonStore({			
			root: 'root',
			totalProperty:'totalProperty',
			autoLoad : true,
			fields: ['rid','name'],
			proxy: new Ext.data.HttpProxy({
				url:this.url+'?object='+this.action+'&tableName='+this.tableName+'&gridField='+this.gridField+"&morecolumn="+this.morecolumn+"&token="+token
			}),
			listeners : {
				load : function(records){
					this.addEmptyOption(records);
					var data = this.store.data;
					if(this.selectFirstRow){
						if(data.items.length>0){
							this.setValue(data.items[0].data.rid);
						}
					}
					if(this.selectByRid){
						this.setValue(this.selectByRid);
					}
				},
				scope : this
			}
		});
		if(!this.hiddenName) {
			this.hiddenName = this.name
		}
		/* 
		 * 当ComboBox可输入时,使其在指定的延迟之后会自动匹配剩下的内容
		 * 默认是输入四个字符开始进行自动匹配,可设置minChars修改
		 */
		if(this.editable) {
			this.typeAhead=true;
		}
	}
});

Ext.reg('ux_combobox', Ext.ux.ComboBox);


//new Ext.ux.ComboBox({action:''});