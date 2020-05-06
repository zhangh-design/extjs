Ext.ns("app.harmony.system.BaseClass");
app.harmony.system.BaseClass.GridDefinedTBar = Ext.extend(Ext.Toolbar, {   
	grid : null,
	moduleID : '',
	className : '',
	initComponent : function(){
		//先调用ToolBar初始化方法初始化ToolBar 
		app.harmony.system.BaseClass.GridDefinedTBar.superclass.initComponent.call(this);
		//用于自定义添加按钮,该方法在用于写模块时重写
		this.initDefinedTBar();
		//检索判断自定义
		if(this.isWantSearch()){
			this.getDefinedBtn();//如果需要到后台比对,比对完后确定最后可以的按钮
		}
	},
	/**
	 * 判断按钮是否需要到后台比对
	 * @return {}
	 */
	isWantSearch : function(){
		var search = false;
		//自定义按钮需要设置属性all,用于确定该按钮是否需要到后台去比对
		if(this.items && this.items.items){
			Ext.each(this.items.items,function(r,i){
				if(r.controlSearch){
					search = true;
					return;
				}
	  		});
		}
  		return search;
	},
	disabledButton : function(btns){
		if(Ext.isEmpty(btns)){
			for(var i=this.items.items.length-1;i>=0;i--){
				var btn = this.btns.items.items[i];
				if(btn.controlSearch== true){
					this.remove(btn);
				}
			}
			this.doLayout();
			return;
		}
		var b = eval(btns);
		for(var i=this.items.items.length-1;i>=0;i--){
			var btn = this.items.items[i];
			var has = false;
			Ext.each(b,function(r,i){
				if(btn.btnid == r.btnid&&btn.all != true&&btn.controlSearch== true){
					has = true;
					return;
				}
			});
			if(!has)
				this.remove(btn);
		}
		this.doLayout();
	},
	/**
	 * 添加按钮,模块中重写该方法，添加自定义按钮
	 */
	initDefinedTBar : function(){
//		this.add(new Ext.Button({text:'替换',scope:this,btnid:'replace',handler:this.aa,controlSearch:true}));
//		this.add(new Ext.Button({text:'转换',scope:this,btnid:'reverse',handler:this.aa}));
	},
	/**
	 * 从后天检索分配了权限的按钮
	 */
	getDefinedBtn : function(){
		Ext.Ajax.request({
			async : false,
			url: this.grid.connURL,  
		 	params:{object:'readGridTbar',moduleID:this.moduleID,className:this.className,token:token,btnType:9},//设置参数
		 	scope : this,
		 	callback:function(o,s, resp){
		 		//先判断与ajax与后台交互是否成功
		 		if(ajaxRequestFailure(resp.statusText))
		 			return;
		 		var respText = Ext.util.JSON.decode(resp.responseText);
		 		if(respText.success){
		 			this.disabledButton(respText.data);
		 		}else{
		 			alert(respText.error);
		 		}
		 	}
		});
	}
});