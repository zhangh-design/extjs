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
	menu.height = 500;
	menu.width = 750;
	menu.clickurl = '0';
	var chart = eval("new " + sCls + "(menu)");
	var win = new Ext.Window({
		height : 545,
		width : 762,
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
Ext.ns("app.harmony.system.Module.HomePage");
app.harmony.system.Module.HomePage.HomePage = function(config) {
	Ext.apply(this, config);
	app.harmony.system.Module.HomePage.HomePage.superclass.constructor.call(this, config);
	this.contentPanel = new Ext.Panel({
		region : 'center',
		frame : false,
		border : false,
		split : true,
		layout : 'fit',
		collapsible : false
	});
	this.rowWidth = (screen.availWidth - 220) / this.rowNumber;
	this.initPanel();
};

Ext.extend(app.harmony.system.Module.HomePage.HomePage, Ext.util.Observable, {
	contentPanel : null,
	reportPanel : null,
	rowWidth : 0,
	rowNumber : 3,
	smallPanels : null,
	firstChart : null,
	canRefresh : false,
	timeout : 300*1000,//检索数据的延迟时间（毫秒）
	initReportPanel : function() {
		this.reportPanel = new Ext.Panel({
			region : 'center',
			border : false,
			height : 500,
			autoScroll : true,
			layoutConfig : {
				columns : 3
			},
			defaults : {
				frame : false,
				width : this.rowWidth,
				style : 'margin:5px;'
			},
			autoScorll : true,
			layout : 'table'
		});
	},
	initPanel : function() {
		this.initReportPanel();
		this.contentPanel.add(this.reportPanel);
		this.initSmallPanel();
	},
	initSmallPanel : function() {
		Ext.Ajax.request({
			url : "/HomePage.do?",
			params : {
				object : "getSmallPanel",
				token : token,
				rownumber : this.rowNumber,
				rowwidth : this.rowWidth
			},
			scope : this,
			callback : function(o, s, resp) {
				var respText = Ext.util.JSON.decode(resp.responseText);
				if (respText.success) {
					this.smallPanels = eval(respText.paneldata);
					if(this.smallPanels.length==0)//如果没首页，删除首页面板
						MainFrame.contentTab.remove(0);
					this.firstChart = eval(respText.firstchart);
					Ext.each(this.smallPanels, function(panel,index) {
						if(panel.more!="9"){
							if (panel.more == "1") {
								Ext.each(panel.ttbar[2].menu,
									function(btn) {
										btn.scope = this;
										btn.handler = this.panelMenuClick;
								}, this);
							}
							var tbar = new Ext.Toolbar({
								cls : 'x-panel-body-homepage-title',
								baseCls : 'ex-panel',
								height : 26,
								items : [panel.ttbar]
							});
							panel.tbar = this.initTbar(index,panel.ttbar) || tbar;
						}
					}, this);
					this.reportPanel.add(this.smallPanels);
					this.reportPanel.doLayout();
					this.initChartPanel();
					// 定时器
					Ext.TaskMgr.start({
								scope : this,
								run : function() {
									this.refreshChartPanel();
								},
								interval : this.timeout
							});
				} else {
					Ext.Msg.alert("错误", respText.error);
				}
			}
		});
	},
	initTbar : function(index,ttbar){
		index++;
		var arr = new Array();
		var toolbar1 = new Ext.Toolbar({
			toolbarCls : 'x-toolbar x-toolbar1',baseCls : 'ex-plan',
			height : 30,
			style : 'background-image:url(../app/harmony/root/Pay/Desktop/images/contenttt01.jpg);background-repeat:repeat-x;background-position:left;border:1px solid #e1c1c1;border-top:0;border-buttom:0;',
			border : false,
			items : [ttbar]});
		arr.push(toolbar1);
		var toolbar2 = new Ext.Toolbar({
			toolbarCls : 'x-toolbar x-toolbar1',baseCls : 'ex-plan',
			height : 30,
			style : 'background-image:url(../app/harmony/root/Pay/Desktop/images/contenttt02.jpg);background-repeat:repeat-x;background-position:left;border:1px solid #e1c1c1;border-top:0;border-buttom:0;',
			border : false,
			items : [ttbar]});
		arr.push(toolbar2);
		var toolbar3 = new Ext.Toolbar({
			toolbarCls : 'x-toolbar x-toolbar1',baseCls : 'ex-plan',
			height : 30,
			style : 'background-image:url(../app/harmony/root/Pay/Desktop/images/contenttt03.jpg);background-repeat:repeat-x;background-position:left;border:1px solid #e1c1c1;border-top:0;border-buttom:0;',
			border : false,
			items : [ttbar]});
		arr.push(toolbar3);
		var toolbar4 = new Ext.Toolbar({
			toolbarCls : 'x-toolbar x-toolbar1',baseCls : 'ex-plan',
			height : 30,
			style : 'background-image:url(../app/harmony/root/Pay/Desktop/images/contenttt04.jpg);background-repeat:repeat-x;background-position:left;border:1px solid #e1c1c1;border-top:0;border-buttom:0;',
			border : false,
			items : [ttbar]});
		var length = arr.push(toolbar4);
		var toolbar = null;
		if(index<length+1){
			toolbar = eval('toolbar' + index);
		}
		return toolbar;
	},
	initChartPanel : function() {
		var sCls = "app.harmony.system.report.Chart";
		$import(sCls);
		Ext.each(this.firstChart, function(cfg) {
			if (cfg.jsurl) {
				sCls = "app.harmony." + cfg.jsurl;
				$import(sCls);
			} else {
				sCls = "app.harmony.system.report.Chart";
			}
			var chart = eval("new " + sCls + "(cfg)");
			Ext.getCmp(cfg.pid).add(chart.contentPanel);
			Ext.getCmp(cfg.pid).doLayout();
		}, this);
	},
	setRefresh : function(refresh) {
		this.canRefresh = refresh;
	},
	refreshChartPanel : function() {
		if (!this.canRefresh) {
			this.canRefresh = true;
			return;
		}
		var sCls = "app.harmony.system.report.Chart";
		$import(sCls);
		Ext.each(this.firstChart, function(cfg) {
			if (cfg.jsurl) {
				sCls = "app.harmony." + cfg.jsurl;
				$import(sCls);
			} else {
				sCls = "app.harmony.system.report.Chart";
			}
			var chart = eval("new " + sCls + "(cfg)");
			Ext.getCmp(cfg.pid).remove(0);
			Ext.getCmp(cfg.pid).add(chart.contentPanel);
			Ext.getCmp(cfg.pid).doLayout();
		}, this);
	},
	panelMenuClick : function(menu) {
		Ext.getCmp(menu.pid).removeAll();
		var sCls = "app.harmony.system.report.Chart";
		if (menu.jsurl)
			sCls = "app.harmony." + menu.jsurl;
		$import(sCls);
		var chart = eval("new " + sCls + "(menu)");
		Ext.getCmp(menu.pid).add(chart.contentPanel);
		Ext.getCmp(menu.pid).doLayout();
	}
});