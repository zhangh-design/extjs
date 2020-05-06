Ext.ns("app.harmony.system.Plugin");
app.harmony.system.Plugin.EditCellGrid = function(config){
   Ext.apply(this,config);
   if(Ext.isEmpty(this.gridModuleID))
		this.gridModuleID = this.moduleID;
   this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect:this.singleSelec,width:28});
   this.conn =  new Ext.data.Connection({url:this.connURL+'?object=read&moduleID='+this.moduleID+'&token='+token,timeout:this.timeOut});
   app.harmony.system.Plugin.EditCellGrid.superclass.constructor.call(this,config);
};
Ext.extend(app.harmony.system.Plugin.EditCellGrid,Ext.grid.EditorGridPanel,{
	/********************** Begin 模块信息 ************************/
	moduleID : '',				//当前模块ID
	gridModuleID : '',
	className : '',									//对应xml中的classname
	connURL : '',						//连接Action的URL
	conn : null,						//声明的Connection连接Action的URL
	dataID : '',									//外部传入的RID,用于定位行
	timeOut : 30000,								//检索数据的延迟时间（毫秒） 
	isSearchBbar : true,								//是否检索按钮
	recordType :'',
	selectDataID : '',								///选中行的记录id
	refreshGrids : new Array(),						//要刷新的Tab Grid,存放在数组中
	showTip : false,								//是否显示提示,默认不显示
	lastRowToAdd : false,							//是否最后一行插入
	/********************** End 模块信息 **************************/
	/********************** Begin Grid属性 ************************/
	region : 'center',								//grid布局
	border : false,									//是否显示边框
	enableHdMenu : false,							//表头的菜单
	enableDragDrop : false,							//行的拖动
	enableColumnMove : false,						//列的拖动
	autoScroll : true,								//竖滚动条
	ForceFit : true,								//横滚动条
	trackMouseOver: true,							//鼠标移动时高亮显示
	animCollapse: false,							//面板闭合过程附有动画效果
	collapsible: false, 							//面板是可收缩的
	pageSize : 30,									//Grid每页显示行数
	isShowAll : true,								//显示所有的内容
	stripeRows : true, 								//显示行的分隔符
	singleSelect : true,							//判断行是单选还是多选
	field : null, 									//解析后台表的字段
	tbar : null,									//面板顶部的工具条
	definedTBar : null,                             //第二工具栏
	tbarJS : '',//顶部工具栏
	clicksToEdit : 2,								//要转换单元格为编辑状态所需的鼠标点击数
	editRowOnSelect:false,							//点击新增时在选中行上新增一行
	isSaveLoadGrid : true,                          //刷新数据
	remoteSort : true,
	isHiddenBBar : false,
	/** 自定义按钮JS地址 */
	definedTBarJS : "",
	/********************** End Grid属性 ************************/
	/********************** Begin Grid初始化 ************************/
	loadMask : {msg:'正在加载数据，请稍侯……'},
	sm : null,
    /**
     * 为数据源设置参数
     * @param {} param
     * @param {} action
     */
	setStoreParam : function(param,action){				//设置grid的store参数
		this.store.on('beforeload',function(store,options){
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
			start = this.isHiddenBBar?0:this.getBottomToolbar().cursor||0;//获得当前页的第一条在总记录数中的第几条
		if(Ext.isEmpty(dataID))
			this.store.reload({params:{start:start, limit:this.pageSize}});
		else{
			this.store.reload({params:{start:start, limit:this.pageSize,dataID:dataID}});
		}
	},
	/**
	 * 初始化Grid中的field, columns,record
	 * @param {} respText
	 */
	initGrid : function(respText){
		this.field = eval(respText.field);
		this.columns = eval(respText.column);
		if(!this.singleSelect){
			this.columns.unshift(new Ext.grid.RowNumberer());
			this.columns[1] = this.sm;
		}
		this.recordType = eval(respText.recordtype);
		this.on('afterGridInit',this.afterInitGrid,this);
		this.initGridParams();
	},
	initGridParams : function(){
		this.store = new Ext.data.JsonStore({ 
		    root : 'root', 
		    totalProperty : 'totalProperty', 
		    /** 字段的定义对象组成的数组 */
		    fields : this.field, 
		    /** True表示在proxy配合下，要求服务器提供一个更新版本的数据对象以便排序，反之就是在Record缓存中排序 */
		    remoteSort:this.remoteSort,
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
	        scrollOffset: 15, //滚动条
	        //刷新后保留滚动条原位置
	        onLoad : Ext.emptyFn, 
	        listeners : { 
                beforerefresh : function(v) { 
                    v.scrollTop = v.scroller.dom.scrollTop; 
                    v.scrollHeight = v.scroller.dom.scrollHeight; 
                }, 
                refresh : function(v) { 
                    v.scroller.dom.scrollTop = v.scrollTop + (v.scrollTop == 0 ? 0 : v.scroller.dom.scrollHeight  - v.scrollHeight); 
                } 
	        }
	    },
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
	    }
	},
	/**
	 * Grid初始化后触发的事件
	 */
	afterInitGrid : function(){
		//如果从最后一行添加新记录
		if(this.lastRowToAdd){
			this.getSelectionModel().addRow = this.addLastRow;
			this.getSelectionModel().selfJS = this;
		}
	},
	/**
	 * 从最后一行添加
	 */
	addLastRow : function(){
		if(!this.hasNext())
			this.selfJS.add_e();
	},
	/**
	 * 设置读取XML所需要的参数
	 * @return {}
	 */
	getAnalyticalXMLParams : function(){
		var param = {  
			object : "readGridXML",//后台读取XML配置的方法名
			moduleID : this.moduleID,//模块ID
			gridModuleID:this.gridModuleID,//模块ID
			className : this.className,//对应的grid
			singleSelect : this.singleSelect,//是否单选
			gridType : 'EditCellGrid',//grid类型
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
	/**
	 * 重写initComponent方法,该方法会在js初始化时执行
	 */
	initComponent : function(){              //Grid初始化完成
		this.analyticalXML();
		this.addEvents(//添加事件
				"beforeGridInit",   //Grid初始化之前触发的事件
				"afterGridInit"   ,  //Grid初始化之后触发的事件
				"afterRowChange"
			);
		//在Grid生成之前触发事件,需要在Grid生成之前的工作都在改事件中处理
		this.fireEvent("beforeGridInit",this);
		app.harmony.system.Plugin.EditCellGrid.superclass.initComponent.call(this);
		//在Grid生成后触发事件，需要在Grid生成后的工作都在改事件中处理
		this.fireEvent("afterGridInit",this);
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
  		app.harmony.system.Plugin.EditCellGrid.superclass.afterRender.call(this);
  		this.initOtherTBar();
	},
	afterLoad : function(){
		this.setFirstRowToStore();//加载完成后默认选中第一行
     	this.dataID = "";//清掉,防止2次用
     	var records = this.getSelectionModel().getSelections();
     	this.RowChange(records.length<1?null:records[0]);//根据主grid去刷新tab grid
	},
	/**
	 * 生成自定义按钮栏
	 */
	initOtherTBar : function(){
		if(Ext.isEmpty(this.definedTBarJS))
			return;
		$import(this.definedTBarJS);
		var cfg = {
			grid:this,
			moduleID:this.moduleID,
			className:this.className
		};
		this.definedTBar = eval("new "+this.definedTBarJS+"(cfg)");
  		if(this.definedTBar.items&&this.definedTBar.items.items.length>0)
			this.definedTBar.render(this.tbar);
	},
	/**
	 * 设置选中第一行
	 */
	setFirstRowToStore : function(){	
		var d = this.dataID||this.selectDataID;
		var isSelect = false;
		if(!Ext.isEmpty(d)){//在GRID中找RID=dataID的行，再定位
     		 var i =0;
     		 Ext.each(this.getStore().data.items,function(r){
     		 	if(r.json.rid==d){
     		 		this.getSelectionModel().selectRow(i);  
     		 		isSelect = true;
     		 	}
     		 	i++;
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
	/**
	 * 加载监听事件
	 */
	addGridListener : function(){		
		this.on('cellclick',this.cellclick,this);
		this.on("beforeedit",this.beforeedit,this);
		this.on("afteredit",this.afterEdit,this);
		this.on("validateedit",this.validateedit,this);
	},
	/**
	 * 行单击事件，用来刷新Tab页
	 */
	cellclick : function(grid, rowIndex, columnIndex, e){
		var record = grid.store.getAt(rowIndex);
		this.selectDataID = record.data.rid;
		if(Ext.isEmpty(this.selectDataID))
		return;
		this.RowChange(record);
	},
	RowChange : function(record){	
		Ext.each(this.refreshGrids,function(obj,index){//根据主Grid刷新tab页的Grid
			var param = obj.params;
			var p = new Object();
			//遍历Tab Grid 参数，赋值给当前参数对象
			for(var item in param){
				p[param[item]] = record.json[item];
			}
			obj.grid.setStoreParam(p,"update");
			this.initChildBtnStatus(obj.grid,record);
        	obj.grid.reloadGrid();
        },this);
        this.initBtnStatus(record);
		this.fireEvent("afterRowChange",record);
	},
	initChildBtnStatus : function(grid,record){
		if(grid.topToolbar&&grid.topToolbar.items&&grid.topToolbar.items.length>0&&grid.topToolbar.setAllBtnStatus)
			grid.topToolbar.setAllBtnStatus(record);
	},
	initBtnStatus : function(record){
		if(this.topToolbar&&this.topToolbar.items&&this.topToolbar.items.length>0&&this.topToolbar.initBtnStatus)
			this.topToolbar.initBtnStatus(record);
	},
	/**
	 * 单元格编辑之前检索条件
	 */
	beforeedit : function(e){
		var gridfield = eval("e.record.fields.map."+e.field+".gridfield");
		var isRet = true;
		if(gridfield){//需前提条件
			var r = e.row;
			var c = e.column;
			var sF = gridfield.split(",");
			var cm = e.grid.getColumnModel();
			Ext.each(sF,function(f){
				if(Ext.isEmpty(e.record.data[f])){
					var rownum = 0;
					for(var i = 0, len = cm.getColumnCount(); i < len; i++){
		                if(cm.getDataIndex(i)==f){
		                	rownum = i;
		                	break;
		                }
		            }
		            Ext.Msg.alert("提示","请先填写<font color=red>"+cm.getColumnHeader(rownum)+"</font>字段!");
					isRet = false;
					return;
				}
			},this);
		}
		return isRet;
	},
	changeRowColor : function(grid){
		//grid.grid.getView().addRowClass(grid.row,'x-grid-record-red');
	},
	/**
	 * 单元格编辑后保存数据
	 */
	afterEdit : function(grid){
		if(this.validateData(grid)==false)
			return;
		var param=new Object();
		Ext.apply(param,this.store.baseParams,{root:Ext.util.JSON.encode(grid.record.data)});
		this.changeRowColor(grid);
		Ext.Ajax.request({ 
			url   : this.connURL+"?object=doSave&moduleID="+this.moduleID+"&className="+this.className+"&token="+token,
	      	method: 'post', 
	      	scope : this,
	      	params: param, 
	      	callback:function(o,s, resp){
				//先判断与ajax与后台交互是否成功
		 		if(ajaxRequestFailure(resp.statusText))
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			var sRid = respText.dataID;
		 			if(this.isSaveLoadGrid){
	     				if(Ext.isEmpty(sRid))
							this.reloadGrid();
						else
							this.reloadGrid(sRid);
		 			}
		 		}else{
	      			Ext.Msg.alert("错误",respText.error);
	      			this.reloadGrid();
		 		}
		 	}
	   	});
	},
	/**
	 * 验证字段
	 * */
	validateedit: function(e){
		return true;
	},
	validateData : function(e){
		var rec = Ext.data.Record.create(this.recordType);
		var canSub = true;
		Ext.each(rec.prototype.fields.items, function(r) {
			if(r.allowBlank==false)
			{
				if(Ext.isEmpty(eval("e.record.data."+r.name))){
					canSub = false;
					return;
				}
			}
		});
		return canSub;
	},
	startEditing : function(row, col){
		if(!this.topToolbar.isCanEdit)
			return;
		app.harmony.system.Plugin.EditCellGrid.superclass.startEditing.call(this,row,col);
	}
	/********************** End Grid事件 ************************/
});