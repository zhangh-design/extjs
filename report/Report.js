$import("app.ext3-2.script.ColumnHeaderGroup");
$import("app.ext3-2.script.DateTimeField");
$import("app.ext3-2.script.TimeField");
$import('app.harmony.system.Plugin.ComboBox');
$styleSheet("app.ext3-2.css.ColumnHeaderGroup");
Ext.ns("app.harmony.system.report");
app.harmony.system.report.Report = function(config){
	Ext.apply(this, config);
	app.harmony.system.report.Report.superclass.constructor.call(this, config);
	this.contentPanel = new Ext.Panel({
		region : this.region,
        frame : false,
        border : false,
        split : true,
        layout : 'fit',
        collapsible : false
	});
	this.analyticalXML();
	return this.contentPanel;
};
function rowClick(menu) {
	// 根据moduleid获取模块信息
	Ext.Ajax.request({
				url : "./MainFrame.do?",
				params : {
					object : "getModule",
					token : token,
					rid : menu.moduleid
				},
				scope : this,
				callback : function(o, s, resp) {
					var respText = Ext.util.JSON.decode(resp.responseText);
					if (respText.success) {
						var sModule = Ext.util.JSON.decode(respText.module);
						position(sModule.rid, sModule.jsurl,sModule.action, menu.text,menu.rid);
					} else {
						Ext.Msg.alert("错误", respText.error);
					}
				}
			});
}
function position(id, url,action, name, dataid) {
	var obj = new Object();
	var sObj = new Object();
	sObj.id = "panel" + id;
	var tab = Ext.getCmp('contentTab');
	if (tab.items.length > 10) {
		Ext.Msg.alert("提示", "模块打开过多，请关闭不用的模块!");
		return;
	}
	if (Ext.get(sObj.id)) {
		tab.setActiveTab(sObj.id);
		return;
	}
	/*var sCls = "app.harmony." + url;
	var cfg = {
		moduleID : id,
		title : name,
		dataID : dataid
	}
	$import(sCls);*/
	var panel = null;
	var src = "./"+action+"?ModuleID="+id+"&token="+token+"&rid="+dataid;
	panel = new Ext.Panel({
		border : false,
		region : 'center',
		layout : 'fit',
		body : new Ext.ux.ManagedIFrame({
	        autoCreate:{
	            xtype : "panel",
	    		src : src,                        
	            frameBorder : 0,
	            autoScroll : false,
	            width : '100%',
	            height : '100%'
	        }
	    })
	});	
	if(Ext.isEmpty(panel)){
		alert("无效的面板!");
		return;
	}
	sObj.title = name;
	sObj.closable = true;
	sObj.autoScroll = true;
	sObj.layout = 'fit',
	sObj.border = false;
	sObj.frame = false;
	tab.add(sObj).show();
    Ext.getCmp(sObj.id).add(panel); 
    Ext.getCmp(sObj.id).doLayout(true);
}
function chartJS(menu) {
	var sCls = "app.harmony.system.report.Chart";
	if (menu.jsurl)
		sCls = "app.harmony." + menu.jsurl;
	$import(sCls);
	menu.height = 400;
	menu.width = 600;
	menu.clickurl = '0';
	var chart = eval("new " + sCls + "(menu)");
	var win = new Ext.Window({
				width : 612,
				height : 445,
				modal : true,
				animateTarget : Ext.getBody(),
				closable : false,
				resizable : false,
				border : false,
				header : false,
				buttons : [
				{text:'高级',handler:function(){
					rowClick(menu);
				}},
				{
					text : '关闭',
					handler : function() {
						win.close();
					}
				}],
				items : [chart.contentPanel]
			});
	win.show();
}
Ext.extend(app.harmony.system.report.Report,Ext.util.Observable,{
	region : 'center',
	title : '',
	waitMessage : '正在获取数据,请稍候....',//进度条信息
	timeout : 300*1000,//检索数据的延迟时间（毫秒）
	pagesize : 30,//每页的大小
	contentPanel : null,
	store : null,
	grid : null,
	storebaseparam : '',//主grid的参数
	storebaseparamvalue : '',//主grid的值         参数和值都以数组的方式存储，一一对应
	moduleid : '',//模块ID
	rid:'',
	pid:'',
	text:'',
	type : '0',//报表类型
	xname:'',
	yname:'',
	jsurl:'',
	action : './GridReport.do?',//获取数据的URL
	menu : null,
	remark : '',
	picPanel : null,
	mainPanel : null,
	tbar : null,
	cond : null,//查询条件
	initCond:null,//查询条件初始值
	condID:null,
	showTip : false,
	forceFit : true,
	analyticalXML : function(){
		Ext.Ajax.request({    
		 	url: this.action,  
		 	params:{object:'initGrid',
		 			token:token,
		 			rid:this.rid},
		 	scope : this,
		 	callback:function(o,s, resp){
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			this.sField = eval(respText.field);
		 			this.sColumn = eval(respText.column);
		 			var group = respText.group;
		 			if(Ext.isEmpty(group)){
		 				group = "[]";
		 			}
		 			this.sGroup = eval(group);
		 			this.queryCondition();
		 		}else{
		 			Ext.Msg.alert("错误",respText.error);
		 		}
		 	}
		});
	},
	queryCondition: function(){
		this.tbar = new Ext.Toolbar();
		this.initCond = new Object();
		Ext.Ajax.request({    
		 	url: this.action,  
		 	params:{object:'queryCondtion',
		 			token:token,
		 			rid:this.rid},
		 	scope : this,
		 	callback:function(o,s, resp){
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			this.condID = new Array();
		 			this.queryCondtions = eval(respText.data);
		 			//如果查询条件大于2个,使用ButtonGroup
		 			if(this.queryCondtions.length>0){
						if(this.queryCondtions.length>2){
							this.tbargroup= new Ext.ButtonGroup({
								columns: 8,
								bodyStyle:'padding:3px;',
								defaults:{border:false, frame:false}
							});
				 			Ext.each(this.queryCondtions,function(cm,i){
			 					eval("this.initCond."+cm.EN+'_qry'+"='"+cm.INITVALUE+"'");//设置初始值，用于初始化数据
			 					this.condID.push(cm.EN+'_qry');
			 					this.tbargroup.add(new Ext.form.Label({width:50,text:cm.CN,style:'margin:0 0 0 5;',labelSeparator:':'}))
				 				if(cm.FIELDTYPE == 'textfield'){//1
				 					this.tbargroup.add(new Ext.form.TextField({width:120,style:'margin:0;',id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'datefield'){//2
				 					this.tbargroup.add(new Ext.form.DateField({format:'Y-m-d',width:120,style:'margin:0;',id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'timefield'){//3
				 					this.tbargroup.add(new Ext.ux.form.TimeField({format:'H:i:s',width:120,style:'margin:0;',id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'datetimefield'){//4
				 					this.tbargroup.add(new Ext.ux.form.DateTimeField({format:'Y-m-d H:i:s',style:'margin:0;',width:125,id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'numberfield'){//5
				 					this.tbargroup.add(new Ext.form.NumberField({width:120,style:'margin:0;',decimalPrecision:2,allowDecimals:false,allowNegative:false,id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'combo'){//6
				 					this.tbargroup.add(new Ext.ux.ComboBox({width:120,style:'margin:0;',tableName : cm.TABLENAME,id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'textarea'){//7
				 					this.tbargroup.add(new Ext.form.TextArea({width:120,style:'margin:0;',id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 			},this);
				 			this.tbar.add(this.tbargroup);
						}else{
			 				Ext.each(this.queryCondtions,function(cm,i){
			 					eval("this.initCond."+cm.EN+'_qry'+"='"+cm.INITVALUE+"'");//设置初始值，用于初始化数据
			 					this.condID.push(cm.EN+'_qry');
			 					this.tbar.add(new Ext.form.Label({width:50,text:cm.CN,style:'margin:0 0 0 5;',labelSeparator:':'}))
				 				if(cm.FIELDTYPE == 'textfield'){//1
				 					this.tbar.add(new Ext.form.TextField({width:120,style:'margin:0;',id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'datefield'){//2
				 					this.tbar.add(new Ext.form.DateField({format:'Y-m-d',width:120,style:'margin:0;',id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'timefield'){//3
				 					this.tbar.add(new Ext.ux.form.TimeField({format:'H:i:s',width:120,style:'margin:0;',id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'datetimefield'){//4
				 					this.tbar.add(new Ext.ux.form.DateTimeField({format:'Y-m-d H:i:s',style:'margin:0;',width:125,id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'numberfield'){//5
				 					this.tbar.add(new Ext.form.NumberField({width:120,style:'margin:0;',decimalPrecision:2,allowDecimals:false,allowNegative:false,id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'combo'){//6
				 					this.tbar.add(new Ext.ux.ComboBox({width:120,style:'margin:0;',tableName : cm.TABLENAME,id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 				if(cm.FIELDTYPE == 'textarea'){//7
				 					this.tbar.add(new Ext.form.TextArea({width:120,style:'margin:0;',id:cm.EN+'_qry',value:cm.INITVALUE}));
				 				}
				 			},this);
			 			}
		 			}else{
		 				this.addTbar();
		 			}
		 			this.initGrid(this.sField,this.sColumn,this.sGroup);
		 			this.initPanel();
		 		}else{
		 			Ext.Msg.alert("错误",respText.error);
		 			return;
		 		}
		 	}
		});
	},
	initTbar : function(){
		this.tbar.add({text:'初始化',scope:this,handler:this.InitProcedure});
		this.tbar.add("-");
		this.tbar.add({text:'查询',scope:this,handler:this.Query});
		this.tbar.add("-");
		this.tbar.add({text:'清空',scope:this,handler:this.clearQuery});
		this.tbar.add("->");
		this.tbar.add({text:'导出',iconCls:'upload-icon',scope:this,handler:this.toExcel});
		this.tbar.add("-");
		this.tbar.show();
		var menu = eval(this.menu);
		Ext.each(menu,function(btn){
			btn.scope = this;
			btn.handler = this.panelMenuClick;
			if(btn.rid == this.rid){
				var f = btn.text;
				btn.text = '<span style=\"color:red;\">'+f+'</span>';
			}
		},this);
		if(menu != null && menu.length>1)
			this.tbar.add({text:'更多',menu:menu});
	},
	initGrid : function(field,column,sGroup){
		this.initTbar();
		var group = new Ext.ux.grid.ColumnHeaderGroup({
	        rows: sGroup
	    });
	    this.store = new Ext.data.JsonStore({ 
		    root : 'root', 
		    totalProperty : 'totalProperty', 
		    fields : field, //解析后台表的左右字段
		    baseParams : {rid:this.rid},
		    proxy : new Ext.data.HttpProxy({url:this.action+'object=read&token='+token,timeout:this.timeout})
		});
		this.store.on('loadexception',function(ex,ex1,ex2){
			var respText = Ext.util.JSON.decode(ex2.responseText);
			var error = respText.error;
			if(error.length>100)
				error = error.substring(0,100)+'...';
			Ext.Msg.alert("错误提示",error,function(){	
					
			},this);		
		},this);
	    this.grid = new Ext.grid.GridPanel({
	        region : 'center',
	        border : false,
	        enableColumnMove:false,
	        enableHdMenu:false,
	        enableDragDrop:false,
	        store:this.store,
	        columns:column,
	        loadMask : true,
	        style : 'border-right:1px solid RGB(153,187,232);',
	        viewConfig: {
	            forceFit: this.forceFit,
	            scrollOffset: 15 //滚动条
	        },
	         listeners :{
	        	scope : this,
	        	'render' : function(grid) {
//	        		this.initTbar();
	        		if(!this.showTip)
	        			return;
	        		var store = grid.getStore();  
	        		var view = grid.getView();
	        		grid.tip = new Ext.ToolTip({
	        			target: view.mainBody,
	        			delegate: '.x-grid3-row',
	        			trackMouse: true, 
	        			renderTo: Ext.getBody(),
	        			listeners: {
	        				beforeshow: function updateTipBody(tip){
	        					var cell = view.findCell(tip.baseTarget);
	        					if(cell)
	        						tip.body.dom.innerHTML = cell.innerText; 
	        				}
	        			}
	        		});
	        	}
	        },
	        tbar:this.tbar,
	        bbar: new Ext.PagingToolbar({
			    store: this.store,
			    pageSize:this.pagesize,
	            displayInfo: true
		    }),
	        plugins: group
		});
		this.initCond.start = 0;
		this.initCond.limit = this.pagesize;
		this.initCond.rid = this.rid;
		this.store.load({params:this.initCond});
	},
	initChartPanel : function(cfg,cond){
		var sCls = this.jsurl;
		if(Ext.isEmpty(sCls))
			sCls = "Chart";
		sCls = "app.harmony.system.report."+sCls;
		$import(sCls);
		/*if(cond){
			cfg.cond = cond;
		}*/
		var chart = eval("new "+sCls+"(cfg)");
		var chartPanel = new Ext.Panel({
			frame:false,
			border:false,
			region : 'north',
			height : 200,
			maxHeight : 200,
			items : [chart.contentPanel]
		});
		return chartPanel;
	},
	initChart : function(){
		if(this.type=="0"||this.type=="5")//无图标或者列表
			return;
		var cfg = {
			rid:this.rid,
			pid:this.pid,
			text:this.text,
			type:this.type,
			action:this.action,
			moduleid:this.moduleid,
			xname:this.xname,
			yname:this.yname,
			height:200,
			width:298
		};
		var chartPanelDetail = this.initChartPanel(cfg,this.initCond);
		this.chartPanel = new Ext.Panel({
			border:false,
			region : 'north',
			layout : 'fit',
			height : 200,
			items:[chartPanelDetail]
		});
		var explain = new Ext.Panel({
			title : '计算公式',
			border:false,
			region : 'center',
			bodyStyle : 'padding:5px;',
			html:"<font color=blue>"+this.remark+"</font>"
		});
		this.picPanel = new Ext.Panel({
			title : '图表',
			width:300,
			collapsible :true,
			collapseMode:'mini',
			border:false,
			region : 'east',
			layout : 'border',
			style : 'margin-left:2px;border-left:1px solid RGB(153,187,232);',
			items : [this.chartPanel,explain]
		});
	},
	initPanel : function(){
		this.initChart();
		this.mainPanel = new Ext.Panel({
			//title : this.text,
			border : false,
			region : "center",
			layout : 'border',
			items : [this.grid]
		});
		if(this.type!="0"&&this.type!="5"){
			this.mainPanel.add(this.picPanel);
		}
		this.contentPanel.add(this.mainPanel);
		this.contentPanel.doLayout();
		this.afterInitAll();
	},
	afterInitAll : function(){},
	addTbar : function(){
		this.tbargroup= new Ext.ButtonGroup({
			columns: 4,
			bodyStyle:'padding:3px;',
			defaults:{border:false, frame:false}
		});
		this.tbar.add(this.tbargroup);
	},
	refreshChart : function(cond){
		if(this.type!="0"&&this.type!="5"){
			this.chartPanel.remove(0);
			var cfg = {
				rid:this.rid,
				pid:this.pid,
				text:this.text,
				type:this.type,
				action:this.action,
				moduleid:this.moduleid,
				xname:this.xname,
				yname:this.yname,
				height:200,
				width:298
			};
			var aa = this.initChartPanel(cfg,cond);
			this.chartPanel.insert(0,aa);
			this.chartPanel.doLayout(true);
		}
	},
	getConditions : function(){
		this.cond = new Object();
		Ext.each(this.queryCondtions,function(item,i){
			var xtype = item.FIELDTYPE;
			if(xtype&&(xtype=="datetimefield"||xtype=="datefield"||xtype=='timefield'||xtype=="combo"||xtype=='numberfield'||xtype=="textfield"||xtype=="textarea")){
				if(xtype=='datefield' || xtype == 'datetimefield'){
					var obj = Ext.getCmp(item.EN+'_qry').el.dom.value;
					eval("this.cond."+item.EN+'_qry'+"='"+obj+"'");
				} else {
					var obj = Ext.getCmp(item.EN+'_qry').getValue();
					eval("this.cond."+item.EN+'_qry'+"='"+obj+"'");
				}
			}
		},this);
		return this.cond;
	},
	Query : function(){
		this.getConditions();
		this.grid.getStore().on('beforeload',function(store,options){
			store.baseParams=this.cond;//外部传入的RID
			store.baseParams.rid = this.rid;
	    },this);
	    this.grid.getStore().load();
	    this.refreshChart(this.cond);
	},
	InitProcedure : function(){
		this.getConditions();
		var sURL = this.action+'object=initProcedure&token='+token+'&rid='+this.rid;
		for(var item in this.cond){
			//if(!Ext.isEmpty(eval('this.cond.'+item)))
			sURL +="&"+item+"="+eval('this.cond.'+item);
		}
		Ext.Ajax.request({    
			url: sURL, 
		 	scope : this,
		 	callback:function(o,s, resp){
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			Ext.Msg.alert("错误",respText.data);
		 			return;
		 		}else{
		 			Ext.Msg.alert("错误",respText.error);
		 			return;
		 		}
		 	}
		});
	},
	clearQuery : function(){
		Ext.each(this.condID,function(item,i){
			Ext.getCmp(item).setValue('');
		},this);
	},
	toExcel : function(){
		this.getConditions();
		var sURL = this.action+"object=export&rid="+this.rid+
			"&token="+token+"&moduleID="+this.moduleID+"&fileName="+this.text;
		for(var item in this.cond){
			if(!Ext.isEmpty(eval('this.cond.'+item)))
				sURL +="&"+item+"="+encodeURIComponent(encodeURIComponent(eval('this.cond.'+item)));
		}
		sURL +="&ie=utf-8";
		//window.open(sURL);
		Ext.get('report_export_frame').dom.src=sURL;
	},
	panelMenuClick : function(menu){
		var sURL = menu.url+"?ModuleID="+menu.moduleid+"&rid="+menu.rid+"&token="+token;
		document.URL = sURL;
	}
});