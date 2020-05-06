Ext.ns("app.harmony.system.Module.HomePage");
$import('app.harmony.system.BaseClass.DetailPanel');
$import('app.harmony.system.Plugin.ComboBox');
$import("app.ext3-2.script.DateTimeField");
app.harmony.system.Module.HomePage.HomePageCondDetail = function(config){
	Ext.apply(this, config);
	app.harmony.system.Module.HomePage.HomePageCondDetail.superclass.constructor.call(this, config);
};

Ext.extend(app.harmony.system.Module.HomePage.HomePageCondDetail,app.harmony.system.BaseClass.DetailPanel,{
	dataDetail : [{
				autoHeight: true,
				autoWidth : false,
            	width : 430,
	            bodyStyle: Ext.isIE ? 'padding:20px 0 5px 10px;' : 'padding:10px 15px;',
	            border: false,
	            style: {
	                "margin-left": "0px", 
	                "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
	            },
	            layout:'table',
	            layoutConfig : {
	            	columns: 6
	            },
	            defaults:{border:false,bodyStyle: 'padding-top:4px;',  
					layout:'form',frame:false,labelAlign:'right',labelWidth:75,width:200 
				},
				items:[
				    {colspan:3,items:{xtype:'numberfield',style:'margin:0;',fieldLabel:'序号',      anchor:'100%',   name:'value(seqno)'}}, 
					{colspan:3,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'英文名',    anchor:'100%',   name:'value(nameen)'}}, 
					{colspan:3,items:{xtype:'textfield',style:'margin:0;',fieldLabel:'中文名',    anchor:'100%',   name:'value(namecn)'}},
					{colspan:3,style:'margin:0;',
					  	items:new Ext.ux.ComboBox({style:'margin:0;', 
						fieldLabel:'类型',
						name:'value(fieldtype)',
						hiddenName:'value(fieldtype)',
						style:'margin:0;',
						tableName : 'mis_report.v_typefield',
					    anchor:'100%',
					    typeAhead: true,
					    listeners : {
					    	select : function(a,b,c){
					    		//如果选择了函数选项
					    		if(a.value == '6'){
					    			//先将类型视图设置为可写
						    		Ext.getCmp('hpcd_tablename').setReadOnly(false);
					    		}else{
					    			//如果选择的不是函数选项，将类型视图设置为不可写
					    			Ext.getCmp('hpcd_tablename').setReadOnly(true);
					    		}
					    	}
					    }
				 	})},
					{colspan:3,items:{id:'hpcd_tablename',xtype:'textfield',style:'margin:0;',fieldLabel:'类型视图',    anchor:'100%',   name:'value(tablename)'}},
				 	{colspan:6,style:'margin:0;',
					  	items:new Ext.ux.ComboBox({style:'margin:0;', 
						fieldLabel:'初始值类型',
						name:'value(inittype)',
						hiddenName:'value(inittype)',
						style:'margin:0;',
						tableName : 'mis_report.v_initType',
					    anchor:'100%',
					    typeAhead: true,
					    listeners : {
					    	select : function(a,b,c){
					    		//如果选择了函数选项
					    		if(a.value == '3'){
					    			//先将初始值空间设置为只读
						    		Ext.getCmp('initvalue').setReadOnly(true);
						    		if(this.tWin){
						    			this.tWin.show();
						    			return;
						    		}
							    	var funcPanel = new Ext.form.FormPanel({
										border : false,
										layout : 'fit',
										height : 120
									});	
									//展示可选函数的combobox
						    		var funcCombo = new Ext.form.ComboBox({
											style:'margin:0;',
											hiddenName:'rid',//提交到后台的值
											name:'name',
											id : 'funcCombo',
									    	store:new Ext.data.JsonStore({
										    	root: 'root',
										    	totalProperty:'totalProperty',
										    	autoLoad : true,
										    	fields: ['rid', 'name'],
										    	proxy: new Ext.data.HttpProxy({url:'./GridReport.do?object=getFuncValue'})
										    }),
										    anchor:'100%',
										    editable:false,
										    displayField:'name',valueField:'rid',typeAhead: true,forceSelection: true,triggerAction: 'all'
							    		});
							    	//将函数combobox放入一个面板中
							    	funcPanel.add(funcCombo);
							    	//将面板放入一个窗口中
						    		this.tWin = new Ext.Window({
											modal : true,
											title : '函数列表',
											width : 280,
											height : 120,
											closeAction : 'hide',
											resizable : false,
											items : funcPanel
								    });
								    //为窗口添加按钮及事件
								    this.tWin.addButton(new Ext.Button({text: '确定',scope : this,
										handler : function(){
											var fv = Ext.getCmp('funcCombo').getValue();
											if(fv==''){
												alert('请选择一个函数');
												return;
											}
											Ext.getCmp('initvalue').setValue(fv);
											this.tWin.hide();
										}
									}));
									this.tWin.addButton(new Ext.Button({text: '取消',scope : this,
										handler : function(){
											this.tWin.hide();
										}
									}));
								    this.tWin.show();
					    		}else{
					    			//如果选择的不是函数选项，将初始值设置为可写
					    			Ext.getCmp('initvalue').setReadOnly(false);
					    		}
					    	}
					    }
				 	})},
				    {colspan:6,width:400,items:{xtype:'textarea',style:'margin:0;height:50;',fieldLabel:'初始值',  anchor:'100%', id:'initvalue', name:'value(initvalue)'}},
				    {colspan:6,width:400,items:{xtype:'textarea',style:'margin:0;',fieldLabel:'where语句',      anchor:'100%',   name:'value(wheresql)'}},
					{colspan:6,width:400,items:{xtype:'textarea',style:'margin:0;',fieldLabel:'备注',      anchor:'100%',   name:'value(remark)'}},
					{colspan:3,items:{xtype:'hidden',style:'margin:0;',fieldLabel:' 记录ID',      anchor:'100%',   name:'value(rid)'}},
					{colspan:3,items:{xtype:'hidden',style:'margin:0;',fieldLabel:'关联字段',      anchor:'100%',   name:'value(prid)'}}
				]
		  }]
});