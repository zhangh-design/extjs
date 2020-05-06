Ext.ns('app.harmony.system.Module.PadSynchro');
$import("app.ext3-2.script.miframe");
app.harmony.system.Module.PadSynchro.Window = function(config){
    Ext.apply(this,config);
    app.harmony.system.Module.PadSynchro.Window.superclass.constructor.call(this,config);
};

Ext.extend(app.harmony.system.Module.PadSynchro.Window,Ext.Window,{
    title : '详情',
    /** 显示最大化控件 */
    maximizable : true,
    /** 选中的grid对象 */
    width : 400,
    height : 200,
    PTree : null,
    moduleID : '',
    className : '',
    pid : '',
    /** 操作的action */
    url : 'PadTableSynchro.do',
    layout : 'border',
    autoScroll : false,
    resizable : true,
    border : false,
    modal : true,
    tablename : '',
    localtablename : '',
    initComponent : function(){
		app.harmony.system.Module.PadSynchro.Window.superclass.initComponent.call(this);
		this.initPanel();
		this.addButton({text:'保存',scope:this,handler:this.formSubmit});
		this.addButton({text:'关闭',scope :this,handler:this.close});
	},
	initPanel : function(){
		var detailPanel = new Ext.Panel({
			border : false,
			region : 'center',
			layout : 'fit',
			items:[{
	            autoHeight: true,
	            bodyStyle: Ext.isIE ? 'padding:28px 0 5px 0px;' : 'padding:28px 0px;',
	            border: false,
	            style: {
	                "margin-left": "0px", 
	                "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"  
	            },
	            layout: 'table',
	            layoutConfig: {
	            	columns: 4
	            },
	            defaults: {
	            	border: false, bodyStyle: 'padding-top:8px;',  
					layout:'form', frame: false, labelAlign: 'right', labelWidth:85, width:320 
				},
				items:[
					{colspan:4,items:{xtype:'textfield',style:'margin:0;',value:this.localtablename,fieldLabel:'本地表名',anchor:'100%',name:'value(tablename)'}},
					{colspan:4,items:{xtype:'textfield',style:'margin:0;',value:this.tablename,fieldLabel:'PDA表名',anchor:'100%',name:'value(padtablename)'}},
					{colspan:2,items:{xtype:'hidden',style:'margin:0;',value:this.pid,fieldLabel:'PDA表名',anchor:'100%',name:'value(rid)'}}
				]
			}]
		});
		var outForm=new Ext.form.FormPanel({
			border : false,
			region : 'center',
			items : [detailPanel]
		});
		this.add(outForm);
	},
	formSubmit : function(){
		var form = this.items.items[0].getForm();
		var params = {object:'add',moduleID:this.moduleID,className:this.className,token:token};
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
					this.PTree.getRootNode().reload();
					this.close();
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

