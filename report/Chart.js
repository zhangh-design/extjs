$import("app.ext3-2.script.ColumnHeaderGroup");
$import("app.ext3-2.script.FusionCharts");
$styleSheet("app.ext3-2.css.ColumnHeaderGroup");
Ext.ns("app.harmony.system.report");
app.harmony.system.report.Chart = function(config){
	Ext.apply(this, config);
	app.harmony.system.report.Chart.superclass.constructor.call(this, config);
	this.ChartID = Ext.id();
	this.contentPanel = new Ext.Panel({
		region : this.region,
        frame : false,
        border : false,
        layout : 'fit'
	});
	this.cfg = "{rid:\""+this.rid+"\",pid:\""+this.pid+"\",text:\""+this.text+"\",type:\""+this.type
				+"\",action:\""+this.action+"\",moduleid:\""+this.moduleid+"\",xname:\""+this.xname
				+"\",yname:\""+this.yname+"\"";
	if(!Ext.isEmpty(config.cond)){
		var condition = ",cond:{";
		
		for(var item in config.cond){
			condition +=item+":\""+eval('this.cond.'+item)+"\"";
		}
		condition +="}";
		this.cfg +=condition;
	}
	this.cfg +="}";
	this.conn = new Ext.data.Connection({url:this.action+'?object=read&token='+token,timeout:this.timeout});
	this.analyticalXML();
};
Ext.extend(app.harmony.system.report.Chart,Ext.util.Observable,{
	region : 'center',
	rid :'',
	text : '',
	moduleid : '',
	type : '1',//报表类型    1:柱状图    2:饼状图  3:横形图  4:曲线图  5:列表 
	waitMessage : '正在获取数据,请稍候....',//进度条信息
	timeout : 300*1000,//检索数据的延迟时间（毫秒）
	contentPanel : null,
	action : './GridReport.do?',//获取数据的URL
	picPanel : null,
	mainPanel : null,
	xname : '',
	yname : '',
	DataXML : '',
	chart : null,
	width : 0,
	height : 280,
	ChartID : "",
	conn : null,
	store : null,
	grid : null,
	pagesize : 1000,
	cfg : "",
	clickurl : "",
	cond : new Object(),
	analyticalXML : function(){
		if(this.type=="5"){//表格
			Ext.Ajax.request({    
			 	url: this.action,  
			 	params:{object:'initGrid',token:token,rid:this.rid},
			 	scope : this,
			 	callback:function(o,s, resp){
			 		if(!resp.responseText||resp.responseText.indexOf("success")==-1){
			 			return;
			 		}
			 		var respText = Ext.util.JSON.decode(resp.responseText);
			 		if(respText.success){
			 			this.sField = eval(respText.field);
			 			this.sColumn = eval(respText.column);
			 			this.initScrollGrid(this.sField,this.sColumn);
			 		}else{
			 			Ext.Msg.alert("错误",respText.error);
			 		}
			 	}
			});
		}else{
			this.cond.object = "chartData";
			this.cond.rid = this.rid;
			this.cond.token = token;
			Ext.Ajax.request({    
			 	url: this.action,  
			 	params:this.cond,
			 	scope : this,
			 	callback:function(o,s, resp){
			 		if(!resp.responseText||resp.responseText.indexOf("success")==-1){
			 			return;
			 		}
			 		var respText = Ext.util.JSON.decode(resp.responseText);
			 		if(respText.success){
			 			this.initPanel(respText.xmlData);
			 		}else{
			 			Ext.Msg.alert("错误",respText.error);
			 		}
			 	}
			});
		}
		
	},
	initScrollGrid : function(field,column){
	    this.store = new Ext.data.JsonStore({ 
		    root : 'root', 
		    totalProperty : 'totalProperty', 
		    fields : field, //解析后台表的左右字段
		    baseParams : {rid:this.rid},
		    proxy : new Ext.data.HttpProxy(this.conn)
		});
		this.store.on('loadexception',function(ex,ex1,ex2){
			var respText = Ext.util.JSON.decode(ex2.responseText);
			var error = respText.error;
			if(error.length>100)
				error = error.substring(0,100)+'.......';
			alert(error);
		},this);
	    this.grid = new Ext.grid.GridPanel({
	        region : 'center',
	        border : false,
	        enableColumnMove:false,
	        enableHdMenu:false,
	        enableDragDrop:false,
	        store:this.store,
	        columns:column,
	        viewConfig: {
	            forceFit: true,
	            scrollOffset: 10 //滚动条
	        }
		});
		this.grid.getStore().load({callback:function(record){
			var sHTML = "<li style='width:100%;float:left;color:red;cursor:hand;padding-top:3px;font-size:12px;text-align:center;'>"+this.text+"</li>" ;
			var marq = 	"<marquee scrollamount=3 align=left width=100% hspace=5 direction=up onmouseover='this.stop();' onmouseout='this.start();'>";
			var columnname="<li style='margin:0;width:100%;float:left;color:red;cursor:hand;font-size:12px;text-align:left;'>";
			Ext.each(column,function(col){
					columnname +=col.header+"&nbsp;&nbsp;";
				},this);
				sHTML += columnname+"</li><br>";
			sHTML +=marq;
			/*if(this.moduleid==""||this.moduleid==null){
				alert("该模块是滚动模块，请维护对应的模块ID,才能定位!");
				return ;
			}*/
			Ext.each(record,function(rec){
				var sRID = "0";
				if(!rec.json.rid){
				}else{
					sRID = rec.json.rid;
				}
				var value = "<li onClick=\"rowClick("+this.moduleid+","+sRID+")\" style='margin:0;width:100%;float:left;color:blue;cursor:hand;font-size:12px;text-align:left;'>";
				Ext.each(this.grid.getStore().fields.keys,function(name){
					value +=eval("rec.json."+name)+"&nbsp;&nbsp;";
				},this);
				sHTML += value+"</li><br>";
			},this);
			sHTML += "</marquee>";
			this.initGridPanel(sHTML);
		},scope:this});
	},
	initGridPanel : function(html){
		this.mainPanel = new Ext.Panel({
			region : "center",
			cls:'x-panel-body-homepage-bg',
		 	baseCls:'ex-panel',
			border : false,
			html : html
		});
		this.contentPanel.add(this.mainPanel);
		this.contentPanel.doLayout();
	},
	initPanel : function(xmlData){
		this.mainPanel = new Ext.Panel({
			region : "center",
			border : false,
			cls:'x-panel-body-homepage-bg',
		 	baseCls:'ex-panel',
			html : this.initChartHTML(xmlData)
		});
		this.contentPanel.add(this.mainPanel);
		this.contentPanel.doLayout();
	},
	canvasBgColor : '0x87d1f6',
	canvasBgAlpha : '70',
	initChartHTML : function(xmlData){
		if(this.clickurl!="0")
			this.clickurl = "JavaScript:chartJS("+this.cfg+");";
		else
			this.clickurl="";
		if(this.type=="1"){
			this.DataXML = "<graph caption='"+this.text+"' bgAlpha='1' canvasBgColor='"+this.canvasBgColor+"' divLineColor='0xffffff' " +
					"canvasBgAlpha='"+this.canvasBgAlpha+"' unescapeLinks='0' clickURL='"+this.clickurl+"' xAxisName='"+this.xname+"' yAxisName='"+this.yname+"' " +
					"showNames='1' decimalPrecision='4' formatNumberScale='0'>"+xmlData+"</graph>";
			this.chart = new FusionCharts("app/harmony/system/Module/FusionCharts/Column3D.swf", this.ChartID, this.width, this.height);	
		}
		else if(this.type=="4"){
			this.DataXML = "<graph caption='"+this.text+"' bgAlpha='0' bgColor='ffffff' canvasbgColor='"+this.canvasBgColor+"' divLineColor='0xffffff' " +
					"canvasBgAlpha='"+this.canvasBgAlpha+"' unescapeLinks='0' clickURL='"+this.clickurl+"' xAxisName='"+this.xname+"' yAxisName='"+this.yname+"' " +
					"showNames='1' decimalPrecision='4' formatNumberScale='0' canvasborderColor='ff5800' " +
				"showValues='0' showAlternateHGridColor='1' AlternateHGridColor='895904' divLineAlpha='100' alternateHGridAlpha='5'>"+xmlData+"</graph>";
			this.chart = new FusionCharts("app/harmony/system/Module/FusionCharts/Line.swf", this.ChartID, this.width, this.height);
		}else if(this.type=="3"){
			this.DataXML = "<graph caption='"+this.text+"' bgAlpha='0' canvasBgColor='"+this.canvasBgColor+"' divLineColor='0xffffff' " +
					"canvasBgAlpha='"+this.canvasBgAlpha+"' unescapeLinks='0' clickURL='"+this.clickurl+"' xAxisName='"+this.xname+"' yAxisName='"+this.yname+"' " +
					"showNames='1' decimalPrecision='4' formatNumberScale='0' " +
				"showValues='0' showAlternateHGridColor='1' AlternateHGridColor='ff5904' divLineColor='ff5904' divLineAlpha='20' alternateHGridAlpha='5'>"+xmlData+"</graph>";
			this.chart = new FusionCharts("app/harmony/system/Module/FusionCharts/Doughnut2D.swf", this.ChartID, this.width, this.height);
		}
		else if(this.type=="2"){
			this.DataXML = "<graph caption='"+this.text+"' bgAlpha='0' canvasBgColor='"+this.canvasBgColor+"' divLineColor='0xffffff' " +
					"canvasBgAlpha='"+this.canvasBgAlpha+"' unescapeLinks='0' clickURL='"+this.clickurl+"' decimalPrecision='4' showPercentageValues='0' " +
					"showNames='1' numberPrefix='' " +
					"showValues='1' showPercentageInLabel='0' pieYScale='60' pieBorderAlpha='40' formatNumberScale='0' pieFillAlpha='70' pieSliceDepth='15' pieRadius='100'>"+xmlData+"</graph>";			
			this.chart = new FusionCharts("app/harmony/system/Module/FusionCharts/Pie3D.swf", this.ChartID, this.width, this.height);
		}else if(this.type=="6"){//多柱状
			this.DataXML = "<graph caption='"+this.text+"' bgAlpha='0' canvasBgColor='"+this.canvasBgColor+"' divLineColor='0xffffff' " +
					"canvasBgAlpha='"+this.canvasBgAlpha+"' unescapeLinks='0' clickURL='"+this.clickurl+"' showNames='1' decimalPrecision='4' " +
					"formatNumberScale='0'>"+xmlData+"</graph>";
			this.chart = new FusionCharts("app/harmony/system/Module/FusionCharts/MSColumn3D.swf", this.ChartID, this.width, this.height);	
		}
		this.chart.setDataXML(this.DataXML);
		return this.chart.getSWFHTML();
	}
});