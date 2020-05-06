Ext.ns("app.harmony.system.Plugin");
$import("app.ext3-2.script.RowEditor");
$styleSheet("app.ext3-2.css.RowEditor");
$import("app.harmony.system.Plugin.GridPanel");

app.harmony.system.Plugin.EditRowGrid = function(config){
	Ext.apply(this,config);
	Ext.QuickTips.init();
	/** 为Grid提供选区模型 */
	this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect:this.singleSelect});
	/** 向服务器端方面负责发起请求的Connection对象 */
	this.conn = new Ext.data.Connection({url:this.connURL+'?object=read&moduleID='+this.moduleID+"&className="+this.className+"&token="+token,timeout:this.timeOut});
	app.harmony.system.Plugin.EditRowGrid.superclass.constructor.call(this, config);
}
Ext.extend(app.harmony.system.Plugin.EditRowGrid, app.harmony.system.Plugin.GridPanel ,{
	/** 点击新增时是在最后一行，还是在最后一行显示新增行 */
	lastRowToAdd : false,
	/** 点击新增时在选中行上新增一行 */
	editRowOnSelect : false,
	/**
	 * 验证编辑内容 
	 * @param {} roweditor
	 * @param {} changes
	 * @param {} record
	 * @param {} rowIndex
	 * @return {Boolean}
	 */
	validateEdit:	function(roweditor, changes, record, rowIndex){
		return true;
	},
	/**
	 * 是否显示编辑 
	 * @param {} grid
	 * @param {} rowIndex
	 * @return {Boolean}
	 */
	isShowEdit : function(grid, rowIndex){
		return grid.topToolbar.isCanEdit;
	},
	columnChange : function(field,newValue,oldValue){
    	this.fireEvent('columnChange',field,newValue,oldValue);
    },
    columnKeyUp : function(field,fields,cm){
    	this.fireEvent('columnkeyup',field,fields,cm);
    },
	/**
	 * 初始化Grid
	 * @param {} respText
	 */
	initGrid : function(respText){
		//赋值 记录record的类型
		this.field = eval(respText.field);
		//赋值渲染Grid所使用的列模型
		this.columns = eval(respText.column);
		if(!this.singleSelect){
			this.columns.unshift(new Ext.grid.RowNumberer());
			this.columns[1] = this.sm;
		}
		//字段类型属性设置
		this.recordType = eval(respText.recordtype);
		//初始化Grid属性组件
		this.initGridParams();
		//行编辑插件
		this.plugins = new Ext.ux.grid.RowEditor({
			saveText : '保存',
			cancelText : '取消',
			errorSummary : false,
			validateedit : this.validateEdit,
			columnChange : this.columnChange,
			isshowedit : this.isShowEdit		
		});
		this.plugins.on({
			scope : this,
			columnkeyup : this.columnKeyUp,
			//注册编辑提交事件处理
			afteredit : this.saveRowRecord,
			//注册取消编辑事件处理
			canceledit : function(roweditor, changes, record, rowIndex){
				this.getStore().reload({params:{start:0, limit:this.pageSize}});
			}
		});
		//Grid初始化后 调用初始化事件
		this.on('afterGridInit',this.afterInitGrid,this);
		//this.on('isNotReloadMainGrid',this.isNotReloadMainGrid,this);
	},
	/**
	 * 保存记录
	 * @param {} roweditor
	 * @param {} changes
	 * @param {} record
	 * @param {} rowIndex
	 */
	saveRowRecord : function(roweditor, changes, record, rowIndex){
		var store = this.store;
		var param = new Object();
		param.root = Ext.util.JSON.encode(record.data);
		//点击树时,树的信息参数都会传递给grid.store,保存时将这些信息从store.baseParams中获取
		Ext.apply(param, store.baseParams);
		Ext.Ajax.request({
			async : false,
			url : this.connURL+"?object=doSave&moduleID="+this.moduleID+"&className="+this.className+"&token="+token,
			method : 'post',
			params : param,
			scope : this,
			callback : function(options, success, resp){
			//先判断与ajax与后台交互是否成功
		 		if(ajaxRequestFailure(resp.statusText))
		 			return;
				var respText = Ext.util.JSON.decode(resp.responseText);
				if(respText.success){
					var sRid = respText.dataID;
					if(this.fireEvent("isNotReloadMainGrid",record)==false){
						this.ownerCt.ownerCt.ownerCt.ownerCt.mainGrid.reloadGrid();
					}else{
						if(Ext.isEmpty(sRid))
							this.reloadGrid();
						else
							this.reloadGrid(sRid);
					}
				}else{
					Ext.Msg.alert('错误',respText.error);
					this.reloadGrid();
				}
			}
		});
	},
	/**
	 * 判断保存是否刷新主Grid
	 * @param {} record
	 * @return {Boolean}
	 */
	isNotReloadMainGrid : function(record){
		return true;
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
	}
});

