Ext.ns("app.harmony.system.BaseClass");
$import("app.ext3-2.script.FileUploadField");
app.harmony.system.BaseClass.Import = function(config){
	Ext.apply(this, config);
	app.harmony.system.BaseClass.Import.superclass.constructor.call(this, config);
	return this.initWin();
};
Ext.extend(app.harmony.system.BaseClass.Import,Ext.util.Observable,{
	width : 300,
	height : 110,
	title : '详情',
    moduleID : '',
    className : '',
	initWin : function(){
		var fp = new Ext.FormPanel({
	        fileUpload: true,
	        width: 286,
	        frame : true,
	        autoHeight: true,
	        bodyStyle: 'padding: 10px 10px 0 10px;',
	        labelWidth: 50,
	        labelAlign : 'right',
	        defaults: {
	            anchor: '95%',
	            allowBlank: false,
	            msgTarget: 'side'
	        },
	        items: [{
	            xtype: 'fileuploadfield',
	            emptyText: '请选择一个数据文件!',
	            fieldLabel: '文件',
	            name: 'excel-path',
	            buttonText: '',
	            buttonCfg: {
	                iconCls: 'import_e'
	            }
	        }],
	        buttons: [{
	            text: '导入',
	            scope : this,
	            handler: function(){
	            	var sURL = "ExcelImport.do?moduleID="+this.moduleID+"&className="+this.className+
	            	"&token="+token;
	            	if(!Ext.isEmpty(this.keyword))
	            		sURL += "&keyword=" + this.keyword;
	                if(fp.getForm().isValid()){
		                fp.getForm().submit({
							waitTitle : '提示',
							waitMsg : '数据正在导入...',
							url : sURL,
							params: {}, 
							scope : this,
							success : function(form, action) {
								if(!Ext.isEmpty(action.result.msg))
									Ext.Msg.alert('提示', action.result.msg);
							},
							failure : function(form, action) {
								Ext.Msg.alert('错误提示', action.result.msg);
							}
		                });
	                }
	            }
	        },{
	            text: '关闭',
	            handler: function(){
	                win.close();
	            }
	        }]
	    });
		var win = new Ext.Window({
			title : '数据导入',
			modal : true,
			resizable : false,
			border : false,
			width : 298,
			height : 114,
			items : [fp]
		});
		win.show();
		return win;
	}
});