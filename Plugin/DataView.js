Ext.ns("app.harmony.system.Plugin");
$styleSheet("app.ext3-2.css.DataView");
app.harmony.system.Plugin.DataView = function(config){
	Ext.apply(this, config);
	if(Ext.isEmpty(this.gridModuleID))
		this.gridModuleID = this.moduleID;
	/** 向服务器端方面负责发起请求的Connection对象 */
	this.conn = new Ext.data.Connection({
		url:this.connURL+"?object="+this.gridMethod+"&token="+token,
		timeout:this.timeOut
	});
	app.harmony.system.Plugin.DataView.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Plugin.DataView,Ext.DataView, {   
	/** 连接Action的URL */
	connURL : '',									
	conn : null,		
	gridMethod : 'read',
	/** 检索数据的延迟时间（毫秒） */
	timeOut : 30000,	
	/** grid布局 */
	region : 'center',
	border : true,
	loadMask : new Ext.LoadMask(document.body,{msg : '正在加载数据，请稍候......',removeMask : false}),
	/** 判断行是单选还是多选 */
    singleSelect: false,
    /** 解析后台表的字段 */
	field : ['rid', 'name'], 		
    store: null,
    pageSize : 30,
    emptyText : '无数据...',
    tpl  : new Ext.XTemplate(
        '<ul style="width:100%;height:100%;text-align:center;">',
            '<tpl for=".">',
                '<li class="row_data" style="float:left;border:1px solid blue;font-size:20px;text-align:center;padding:5px;width:30%;height:45%;margin:20px;margin-top:12%;">',
                    '<img width="100%" height="100%" src="{values.image}"/><br>',
                    '<strong>{name}</strong>',
                '</li>',
            '</tpl>',
        '</ul>'
    ),
    id: Ext.id(),
    itemSelector: 'li.row_data',
    overClass   : 'row_data-hover',
    autoScroll  : true,
    multiSelect: true,
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
	 * 刷新Grid
	 * @param {} dataID
	 * @param {} row
	 */
	reloadGrid : function(){//刷新grid
		this.loadMask.show();
		this.store.reload({params:{start:0, limit:this.pageSize}});
	},
	afterLoad : function(){
		this.loadMask.hide();
		this.fireEvent("afterLoad",this);
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
		this.getStore().on({   
  			load:{   
          		fn:function(){   
					this.afterLoad.defer(100,this);
	          	}       
     		},   
       		scope:this       
  		});
	},
	/**
	 * 重写initComponent方法,该方法会在js初始化时执行
	 */
	initComponent : function(){ 
		this.addEvents(//添加事件
			"beforeGridInit",   //Grid初始化之前触发的事件
			"afterGridInit" ,    //Grid初始化之后触发的事件
			"afterLoad"
		);
		//在Grid生成之前触发事件,需要在Grid生成之前的工作都在改事件中处理
		this.fireEvent("beforeGridInit",this);
		app.harmony.system.Plugin.DataView.superclass.initComponent.call(this);
		//在Grid生成后触发事件，需要在Grid生成后的工作都在改事件中处理
		this.fireEvent("afterGridInit",this);
		this.initGridParams();
	}
});