Ext.ns("app.harmony.system.Plugin");
$styleSheet("app.ext3-2.css.ColumnHeaderGroup");
$import("app.ext3-2.script.ColumnHeaderGroup");
app.harmony.system.Plugin.GridPanel = function(config){
	Ext.apply(this, config);
	if(Ext.isEmpty(this.gridModuleID))
		this.gridModuleID = this.moduleID;
	/** 为Grid提供选区模型 */
	this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect:this.singleSelect});
	/** 向服务器端方面负责发起请求的Connection对象 */
	this.conn = new Ext.data.Connection({
		url:this.connURL+"?object="+this.gridMethod+"&moduleID="+this.moduleID+"&className="+this.className+"&token="+token,
		timeout:this.timeOut
	});
	app.harmony.system.Plugin.GridPanel.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Plugin.GridPanel,Ext.grid.GridPanel, {   
	/********************** Begin 模块信息 ************************/
	/** 当前选择的模块ID */
	moduleID : '',
	/** 当前Grid模块ID */
	gridModuleID : '',
	/** 当前Grid方法 */
	gridMethod : 'read',
	/** 对应xml中的classname */
	className : '',									
	/** 连接Action的URL */
	connURL : '',									
	/** 对应xml中的classname */
	conn : null,									
	/** 外部传入的RID,用于定位行 */
	dataID : '',				
	/** 选中的行记录的dataID */
	selectDataID : '',
	/** 检索数据的延迟时间（毫秒） */
	timeOut : 30000,								 
	/** 详情页URL */
	detailURL : '',									
	/** 要刷新的Tab Grid,存放在数组中 */
	refreshGrids : new Array(),					
	/** 定义了字段类型，是否只读，是否为空等信息*/
	recordType : null,
	/** 外面传入Grid的其他参数可以以对象形式放在这个参数中 */
	param : null,
		/** 是否检索按钮 */
	isSearchBbar : true,
	/** 自定义按钮JS地址 */
	definedTBarJS : "",
	/********************** End 模块信息 **************************/
	/********************** Begin Grid属性 ************************/
	/** grid布局 */
	region : 'center',
	/** 默认不显示边框 */
	style : 'padding:1px',
	border : true,
	/** 表头的菜单,默认为false,不显示 */
	enableHdMenu : false,						
	/** 行的拖动,默认为false, 不支持拖动 */
	enableDragDrop : false,							
	/** 列的拖动,默认为false，不支持拖动 */
	enableColumnMove : false,						
	/** 竖滚动条,默认true,超出范围时显示滚动条 */
	autoScroll : true,								
	/** 自动展开/缩小列的宽度以适应grid的宽度，这样就不会出现水平的滚动条 */
	ForceFit : true,								
	/** 要刷新的Tab Grid,存放在数组中 */
	trackMouseOver: true,
	/** 面板闭合附有动画效果，默认没有 */
	animCollapse: false,
	/** 面板是可伸缩的,默认不可伸缩 */
	collapsible: false, 
	/** 默认的Grid每页显示行数 */
	pageSize : 30,									
	/** 是否显示提示,默认不显示 */
	showTip : false,
	/** 显示所有的内容 */
	isShowAll : true,								
	/** 显示行的分隔符,默认为true */
	stripeRows : true, 
	/** 判断行是单选还是多选 */
	singleSelect : true,	
	/** 显示前面的选择框 **/
	showRowClick : false,
	/** 解析后台表的字段 */
	field : null, 			
	/** 顶部工具栏 */
	tbar : [],	
	/** 按钮工具栏默认使用的JS */
	tbarJS : 'app.harmony.system.BaseClass.GridTBar',
	/********************** End Grid属性 ************************/
	/** 是否打开提交窗口 */
	isShowSubmit : false,  
	/** 是否打开退回窗口 */
	isShowBack : false,
	/** 遮罩 */
	loadMask : {msg:'正在加载数据，请稍侯……'},
	/** 选区模型 */
	sm : null,
	/** 详情页窗口 */
	detailWindow : null,
	/** 窗口高度 */
	winHeight : 400,
	/** 窗口宽度 */
	winWidth : 400,
	/** 是否根据标识选中多行 */
	dqxzh : false,
	/** 主键 */
	primaryKey : 'rid',
	isKeyFind : false,
	isHiddenBBar : false,
	definedBBarJS: '',
	definedBBar : null,
	isHideSaveBtn : false,
	/** 多表头插件 **/
	plugins : null,
	/** 判断是否拥有双击事件 **/
	hasRowDblClick : true,
	/** 显示行号 **/
	showRowNumber : true,
	/** 数据加载完后是否默认选中第一行 **/
	setFirstRowSelect : true,
	/********************** Begin Grid初始化 ************************/
    /**
     * 为数据源设置参数
     * @param {} param
     * @param {} action
     */
	setStoreParam : function(param,action){				//设置grid的store参数
		this.getStore().on('beforeload',function(store,options){
			if(action=="replace")     //替换
				store.baseParams = param;
			else if(action=="insert") //追加
				Ext.apply(store.baseParams,param);
			else
				Ext.apply(store.baseParams,param);
	    },this);
	},
	/**
	 * 初始化参数
	 */
	initStoreParam : function(){
		this.setStoreParam(this.param);
	},
	/**
	 * 刷新Grid
	 * @param {} dataID
	 * @param {} row
	 */
	reloadGrid : function(dataID,row){//刷新grid
		this.dataID = dataID;
		var start = row;
		if(Ext.isEmpty(start))
			start = this.getBottomToolbar()?this.getBottomToolbar().cursor||0:0;  //获得当前页的第一条在总记录数中的第几条
		if(Ext.isEmpty(dataID))
			this.store.reload({params:{start:start, limit:this.pageSize}});
		else
			this.store.reload({params:{start:start, limit:this.pageSize,dataID:dataID}});
	},
	/**
	 * 初始化Grid中的field, columns
	 * @param {} respText
	 */
	initGrid : function(respText){
		//返回后台取到的field 和 column
		this.field = eval(respText.field);
		this.columns = eval(respText.column);
		if(!this.singleSelect||this.showRowClick){
			this.columns.unshift(new Ext.grid.RowNumberer());
			this.columns[1] = this.sm;
		}
		if(!this.showRowNumber){
			this.columns = this.columns.slice(0,0).concat(this.columns.slice(1,this.columns.length));
		}
			
		this.recordType = eval(respText.recordtype);
		this.initGridParams();
	},
	initGridParams : function(){
		this.store = new Ext.data.JsonStore({ 
		    root : 'root', 
		    totalProperty : 'totalProperty', 
		    /** 字段的定义对象组成的数组 */
		    fields : this.field, 
		    /** True表示在proxy配合下，要求服务器提供一个更新版本的数据对象以便排序，反之就是在Record缓存中排序 */
		    remoteSort:true,
		    /** Proxy对象，用于访问数据对象 */
		    proxy : new Ext.data.HttpProxy(this.conn)
		});
		if(!this.isHiddenBBar){
			this.bbar = new Ext.PagingToolbar({
				/** 数据源 */
			    store: this.store,
			    /** 每页要展现的记录数 */
			    pageSize:this.pageSize,
			    /** 为true时展示展现信息（默认为false） */
		        displayInfo: true
		    });
		}
	    this.viewConfig = {
	    	/** True表示为自动展开/缩小列的宽度以适应grid的宽度，这样就不会出现水平的滚动条 */
	        forceFit:this.ForceFit,
	        getRowClass : function(record,rowIndex,rowParams,store){
				if(!record.json||!record.json.bhhys)//变换行颜色
					return "";
				return 'x-grid-record-'+record.json.bhhys;
			},
			isShowAll : this.isShowAll,
			/** 预留给滚动条的空白位置（默认为19像素） */
	        scrollOffset: 15 //滚动条
	    };
	    this.listeners = {
	    	scope : this,
	    	'render' : function(grid) {
	    		//判断是否显示快捷提示
	    		if(!this.showTip)
	    			return;
	    		var store = grid.getStore();  
	    		var view = grid.getView();    
	    		grid.tip = new Ext.ToolTip({
	    			target: view.mainBody,
	    			delegate: '.x-grid3-row',
	    			/** 值为 true 时当鼠标经过目标对象时快捷提示将跟随鼠标移动(默认为 false) */
	    			trackMouse: true, 
	    			renderTo: Ext.getBody(),
	    			listeners: {
	    				//在组件显示出来之前，为快捷提示赋值
	    				beforeshow: function updateTipBody(tip){
	    					var cell = view.findCell(tip.baseTarget);
	    					if(cell)
	    						tip.body.dom.innerHTML = cell.innerText; 
	    				}
	    			}
	    		});
	    	}
	    };
	},
	/**
	 * 设置读取XML所需要的参数
	 * @return {}
	 */
	getAnalyticalXMLParams : function(){
		var param = {  
			object : "readGridXML",//后台读取XML配置的方法名
			gridModuleID:this.gridModuleID,//模块ID
			moduleID : this.moduleID,
			className : this.className,//对应的grid
			singleSelect : this.singleSelect,//是否单选
			gridType : 'GridPanel',//grid类型
			token : token//令牌
		};
		return param;
	},
	/**
	 * 与后台交互，获取生成Grid所需的columns和field
	 */
	analyticalXML : function(){	
		var params = this.getAnalyticalXMLParams();
		Ext.Ajax.request({
			async : false,
			url: this.connURL,  
		 	params:params,//设置参数
		 	scope : this,
		 	callback:function(o,s, resp){
		 		if(ajaxRequestFailure(resp.statusText))//判断ajax调用是否失败
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			//返回成功，则逐一初始化Grid, Store参数, 工具栏
		 			this.initGrid(respText);
		 			this.initStoreParam();
					this.initToolbar();
		 		}else{
		 			alert(respText.error);
		 		}
		 	}
		});
	},
	hiddenNullTBar : function(){
		if(this.topToolbar.items&&this.topToolbar.items.length<1){
			this.tbar.dom.innerHTML = this.tbar.dom.innerHTML.replace("x-toolbar ","");
		}
	},
	/**
	 * 重写initComponent方法,该方法会在js初始化时执行
	 */
	initComponent : function(){ 
		this.analyticalXML();//初始化Grid及相关组件
		this.addEvents(//添加事件
			"loadClick",		//流程中，保存成功后会弹出办理窗口，需要触发该事件
			"beforeRowDblClick", //双击行之前触发的事件
			"afterRowDblClick", //双击行之后触发的事件
			"beforeGridInit",   //Grid初始化之前触发的事件
			"afterGridInit" ,    //Grid初始化之后触发的事件
			"afterRowChange",   
			"isNotReloadMainGrid",//是否刷新主Grid
            'columnChange',       //行编辑单元变化事件
            'columnkeyup',
            'afterRecordLoad',    //数据加载完成
            'afterCellClick',    //点击单元格事件
			"WFValidate"        //流程验证
		);
		//在Grid生成之前触发事件,需要在Grid生成之前的工作都在改事件中处理
		this.fireEvent("beforeGridInit",this);
		app.harmony.system.Plugin.GridPanel.superclass.initComponent.call(this);
		//在Grid生成后触发事件，需要在Grid生成后的工作都在改事件中处理
		this.fireEvent("afterGridInit",this);
	},
	/**
	 * 设置是否打开提交窗口
	 * @param {} showSubmit
	 */
	showSubmit : function(isShowSubmit){
		this.isShowSubmit = isShowSubmit;
	},
	/**
	 * 设置是否打开退回窗口
	 * @param {} showBack
	 */
	showBack : function(isShowBack){
		this.isShowBack = isShowBack;
	},
	/**
	 * 流程中保存后判断是否触发办理按钮事件
	 * @param {} records
	 */
	loadClick : function(record){
		if(this.isShowSubmit){//如果为true,调用办理按钮的方法
			this.showSubmit(false);
			this.topToolbar.showHandlerWin("submit");
		}
		if(this.isShowBack){//如果为true,调用办理按钮的方法
			this.showBack(false);
			this.topToolbar.showHandlerWin("back");
		}
	},
	/**
	 * Grid渲染之后，为数据源store添加load监听事件，加载完后成后
	 * 同时去刷新Tab Grid
	 */
	afterRender : function(){
		this.getStore().on({   
  			load:{   
          		fn:function(){   
					this.afterLoad.defer(100,this);
	          	}       
     		},   
       		scope:this       
  		});
  		this.addGridListener();//添加Grid事件
  		app.harmony.system.Plugin.GridPanel.superclass.afterRender.call(this);
  		this.initOtherTBar();
	},
	isEmptyData : function(){
		//判断非第1页,且无数据
		var cursor = this.getBottomToolbar()?this.getBottomToolbar().cursor||0:0;
		var pageSize = this.getBottomToolbar()?this.getBottomToolbar().pageSize||1:1;
		var size = cursor/pageSize;
		if(this.getStore())
			return this.getStore().getCount()==0&&size>=1;
		return false;
	},
	afterLoad : function(){
		if(this.isEmptyData()){
			this.reloadGrid(null,0);
			return;
		}
		if(this.setFirstRowSelect){
			this.setFirstRowToStore();//加载完成后默认选中第一行
		}
		this.fireEvent("afterRecordLoad",this);
     	this.dataID = "";//清掉,防止2次用
     	var record = this.getSelectionModel().getSelected();
     	this.RowChange(Ext.isEmpty(record)?null:record);//根据主grid去刷新tab grid
     	this.fireEvent("loadClick",this,Ext.isEmpty(record)?null:record);//触发打开办理窗口事件
	},
	initOtherTBar : function(){
		this.hiddenNullTBar();
		if(Ext.isEmpty(this.definedTBarJS))
			return;
		$import(this.definedTBarJS);
		var cfg = {
			grid:this,
			moduleID:this.moduleID,
			gridModuleID:this.gridModuleID,
			className:this.className
		};
		this.definedTBar = eval("new "+this.definedTBarJS+"(cfg)");
  		if(this.definedTBar.items&&this.definedTBar.items.items.length>0)
			this.definedTBar.render(this.tbar);
		if(Ext.isEmpty(this.definedBBarJS))
			return;
		$import(this.definedBBarJS);
		this.definedBBar = eval("new "+this.definedBBarJS+"()");
		this.definedBBar.render(this.bbar);
	},
	/**
	 * 设置选中第一行
	 */
	setFirstRowToStore : function(){	
		var d = this.dataID || this.selectDataID;
		var isSelect = false;
		if(!Ext.isEmpty(d)||this.dqxzh){//在GRID中找RID=dataID的行，再定位
     		 Ext.each(this.getStore().data.items,function(r,index){
     		 	if(this.dqxzh){
     		 		isSelect = true;
     		 		if(r.json.dqxzh&&r.json.dqxzh=='1'){
	     		 		this.getSelectionModel().selectRow(index,true);  
	     		 	}
     		 	}else{
     		 		if(r.json.rid==d){
	     		 		this.getSelectionModel().selectRow(index,true);  
	     		 		isSelect = true;
	     		 	}
     		 	}
     		 },this);
     	}else
     		this.getSelectionModel().selectFirstRow(); 
     	if(!isSelect)
     		this.getSelectionModel().selectFirstRow(); 
	},
	/********************** End Grid初始化 ************************/
	/********************** Begin Tbar初始化 ************************/
	/**
	 * 从后台获取当前模块的某个Grid的按钮
	 */
	initToolbar : function(){
		if(this.isSearchBbar){
			//获取按钮,同样需要传递moduleID, className, token到后台
			Ext.Ajax.request({
				async : false,
				url: this.connURL,  
			 	params:{object : "readGridTbar",moduleID:this.moduleID,className:this.className,token:token,btnType:1},
			 	scope : this,
			 	callback:function(o,s, resp){
			 		//先判断与ajax与后台交互是否成功
			 		if(ajaxRequestFailure(resp.statusText))
			 			return;
			 		var respText = Ext.util.JSON.decode(resp.responseText);
			 		if(respText.success){
			 			//获取按钮后，先生成tbar
			 			if(Ext.isEmpty(respText.data))
			 				return;
			 			$import(this.tbarJS);
			 			this.tbar = eval("new "+this.tbarJS+"({tbarValue:eval(respText.data),PGrid:this})");
			 		}else{
			 			alert(respText.error);
			 		}
			 	}
			});
		}
	},
	/********************** End Tbar初始化 ************************/
	/********************** Begin Grid事件 ************************/
	addGridListener : function(){		
		this.on('cellclick',this.cellclick,this);
		if(this.hasRowDblClick)
			this.on('rowdblclick',this.rowDblClick,this);
		this.on("loadClick",this.loadClick,this);
	},
	cellclick : function(grid, rowIndex, columnIndex, e){
		var record = grid.store.getAt(rowIndex);
		this.selectDataID = record?record.json?record.json.rid:'':'';
		this.RowChange(record);
		this.fireEvent("afterCellClick",grid,rowIndex, columnIndex, e);
	},
	RowChange : function(record){	
		Ext.each(this.refreshGrids,function(obj,index){//根据主Grid刷新tab页的Grid
			var param = obj.params;
			var p = new Object();
			//遍历Tab Grid 参数，赋值给当前参数对象
			for(var item in param){
				p[param[item]] = record?record.json[item]:'';
			}
			obj.grid.setStoreParam(p,"update");
			this.initChildBtnStatus(obj.grid,record);
        	obj.grid.reloadGrid();
        },this);
        this.initBtnStatus(record);
		this.fireEvent("afterRowChange",record);
	},
	initChildBtnStatus : function(grid,record){
		if(grid.topToolbar.items&&grid.topToolbar.items.length>0&&grid.topToolbar.setAllBtnStatus)
			grid.topToolbar.setAllBtnStatus(record);
	},
	initBtnStatus : function(record){
		if(this.topToolbar.items&&this.topToolbar.items.length>0&&this.topToolbar.initBtnStatus)
			this.topToolbar.initBtnStatus(record);
	},
	rowDblClick : function(grid, rowIndex, e){
		var record = grid.store.getAt(rowIndex);
		if(this.fireEvent("beforeRowDblClick",this,record)!=true)
			return;
		if(!Ext.isEmpty(this.detailURL)){
			//引用详情页窗口，传递详情页地址和记录record对象,详情页中的表单需要继承中根据实际情况重写
			$import("app.harmony.system.BaseClass.Window");
			var key = record.json[this.primaryKey];
			var param = {
				moduleID:this.moduleID,
				className:this.className,
				jsDetail: this.detailURL, 
				rid : this.isKeyFind?key:null,
				PGrid:this,
				height : this.winHeight,
				width : this.winWidth,
				isCanSubmit : grid.topToolbar.isCanSubmit,
				isCanCallback : grid.topToolbar.isCanCallback,
				isCanEdit : grid.topToolbar.isCanEdit?'edit':'query'
			};
			this.detailWindow = new app.harmony.system.BaseClass.Window(param);
			this.detailWindow.show();
		}
		this.fireEvent("afterRowDblClick",this,record);
    },
    validate : function(record,action){
    	return this.fireEvent("WFValidate",this,record,action);
    }
	/********************** End Grid事件 ************************/
});