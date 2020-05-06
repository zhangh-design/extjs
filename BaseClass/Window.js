Ext.ns('app.harmony.system.BaseClass');
$import("app.ext3-2.script.miframe");
app.harmony.system.BaseClass.Window=Ext.extend(Ext.Window,{
    title : '详情',
    moduleID : '',
    /** 解析的xml模块名 */
    className : '',
    /** 显示最大化控件 */
    maximizable : true,
    /** 双击选中的grid对象 */
    PGrid : null,
    /** 对按钮的操作状态 有查询、编辑、添加 */
    isCanEdit : 'query',
    isCanSubmit : false,
	isCanCallback : false,
	isCanPrint : false,
    /** window窗口中存放面板的路径 */
    jsDetail : '',
    /** 查询时传入的id */
    rid : '',
    /** 模块id */
    gridModuleID : '',
    /** 操作的action */
    url : '',
    /** 主从表关联的字段 */
    uParams : '',
    layout : 'border',
    autoScroll : false,
    resizable : true,
    border : false,
    modal : true,
    isWantReload : true,
    saveText : '保存',
    initComponent : function(){
    	this.initDetailParams();
		app.harmony.system.BaseClass.Window.superclass.initComponent.call(this);
		this.initPanel();
		this.initBtn();
		this.addButton({text:'关闭',scope :this,handler:this.close});
	},
	initBtn : function(){
		if(this.isCanSubmit){
			this.addButton({text:'提交',scope:this,handler:this.recordSubmit});
		}
		if(this.isCanPrint){
			this.addButton({text:'打印',scope:this,handler:this.recordPrint});
		}
		if(this.isCanCallback){
			this.addButton({text:'退回',scope:this,handler:this.recordCallback});
		}
		if((!this.isCanSubmit||!this.PGrid.isHideSaveBtn)&&this.isCanEdit != 'query'){
			this.addButton({text:this.saveText,scope:this,handler:this.formSubmit});
		}
	},
	initDetailParams : function(){
		this.height = this.height>document.body.clientHeight?document.body.clientHeight:this.height;
    	window.openWindow = this;
    	if(Ext.isEmpty(this.url)&&this.PGrid)
    		this.url = this.PGrid.connURL;
	},
	initPanel : function(){
		var url = "./Window.jsp?a="+Math.random();
		if(!Ext.isEmpty(this.rid))
			url +="&cond="+this.rid;
		var detailPanel = new Ext.Panel({
			border : false,
			region : 'center',
			layout : 'fit',
			body : new Ext.ux.ManagedIFrame({
                autoCreate:{
                    xtype : "panel",
            		src : url,                        
                    frameBorder : 0,
                    autoScroll : false
                }
            })
		});
		this.add(detailPanel);
	},
	recordSubmit : function(){
		this.PGrid.showSubmit(true);
		this.formSubmit();
	},
	recordPrint : function(){
		
    	var pGrid=this.PGrid;
    	var record  = pGrid.getSelectionModel().getSelected();
    	if(Ext.isEmpty(record))
    		return;
		eval("new app.harmony.system.BaseClass.Print({ModuleID:'"+pGrid.moduleID+"',ClassName:'"
			+pGrid.className+"',token:'"+token+"',rid:"+record.json.rid+"})");
	},
	recordCallback : function(){
		this.PGrid.showBack(true);
		this.formSubmit();
	},
	formSubmit : function (btn){ 
		//btn.setDisabled(true);
		var detailPanel = this.items.items[0].body.getWindow().detailPanel;
		detailPanel.saveForm(btn);
	},
	close : function(){
		window.openWindow = null;
		app.harmony.system.BaseClass.Window.superclass.close.call(this);
	}
});

