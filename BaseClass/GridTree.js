Ext.ns("app.harmony.system.BaseClass");
app.harmony.system.BaseClass.GridTree = Ext.extend(Ext.tree.TreePanel, {
	/********************** Begin TreePanel的参数 *************************/
	/** 树的url参数 */
	url : '/PublicTree.do',		
	/** 树调用的Action */	
	action : 'example',								
	/** 树布局的位置(左边) */	
	region : 'west',								
	/** 是否有滚动条 */
	autoScroll : true,								
	/** 树的默认宽度 */
	width : 200,									
	/** 搜索框的宽度 */
	searchFieldWidth : 195,							
	/** 树的根目录是否可见,如果设置了title属性,则此属性自动转换为true */
	rootVisible : false,							
	/** 根节点ID */
	rootID : '',									
	/** 树根目录的名称 */
	rootText : '',	
	/** 点击数节点刷新的对象 */
	clickRefresh : null,
	/** 树节点的右键菜单 */
	nodemenu : new Ext.menu.Menu(),	
	style : 'padding:1 0 1 1',
	/** 隐藏的节点 */
	hiddenPkgs : [],	
	/** 节点展开前传给后台的参数,例如baseParams : ['id','text','qtip'],注意：这里的参数要统一设置成小写 */
	baseParams : [],			
	/** 点击节点刷新的Grid */
	refreshGrids : null,		
	isShowText : true,
	/********************** End TreePanel的参数 *************************/
	/**
	 * 初始化树的属性.
	 */
	initComponent : function(){
		this.root = new Ext.tree.AsyncTreeNode({
			id : this.rootID,
			qtip : this.rootText,
			text : this.rootText
		});
		if(this.isShowText){
			this.tbar = [new Ext.form.TextField({ 
		    	width: this.searchFieldWidth, 
		    	emptyText:'请输入过滤条件...', 
		    	listeners:{ 
		     		render: function(field){
	      				field.el.on('keydown', field.getBubbleTarget().getBubbleTarget().filterBy, field, {buffer: 350}); 
		     		} 
		    	} 
			})];
		}
		this.initLoader();
		this.addEvents(//添加事件
			"afterAddMenu",
			"afterClick",
			"refreshMenu"      //点击节点更新右键菜单
		);
		app.harmony.system.BaseClass.GridTree.superclass.initComponent.call(this);
		this.initTree();
	},
	initLoader : function(){
		this.loader = new Ext.tree.TreeLoader({ url: this.url+'?action='+this.action+'&token='+token});
	},
	/**
	 * 刷新关联的Grid
	 * @param {} node
	 * @param {} obj
	 */
	refreshGrid : function(node,obj){
		var grid = obj.grid;
		var params = obj.params;
		var p = new Object();
		for(var item in params){
			p[params[item]] = node.attributes[item];
		}
		grid.setStoreParam(p,'update');
		grid.reloadGrid('',0);
	},
	isAddMenu : false,
	/**
	 * 树事件
	 */
	addTreeListener : function(){
		this.on('beforeexpandnode',this.beforeExpandNode,this);
		this.on('click', function(node){
			Ext.each(this.refreshGrids,function(obj){
				this.refreshGrid(node,obj);
			},this);
			this.fireEvent("afterClick",this,node);
			node.isExpanded()?node.collapse():node.expand();
		},this);
		this.on("expandnode",function(node){
			Ext.each(node.childNodes,function(child){
				if(!Ext.isEmpty(node.attributes.image))
					child.getUI().getIconEl().src = node.attributes.image;  
			},this);
		},this);
		this.on('contextmenu',function(node,e){
			if(!this.isAddMenu){
				this.fireEvent("afterAddMenu",this);
				this.isAddMenu = true;
			}
			this.fireEvent("refreshMenu",this,node);
			node.select();
    		e.preventDefault();
    		this.nodemenu.node = node;
    		this.nodemenu.showAt(e.getXY());
		},this);
	},
	/**
	 * 搜索函数.
	 */
	filterBy : function(e){
		var tree = this.getBubbleTarget().getBubbleTarget();
		for(var i=0;i<tree.hiddenPkgs.length;i++){ 
			tree.hiddenPkgs[i].ui.show(); 
		}
		var matched = []; 
		var text = e.target.value;
		this.treeFilter = new Ext.tree.TreeFilter(tree, {   
                    clearBlank: true,   
                    autoClear: true  
                });  
        if(!text){   
            return;   
        }   
        var re = new RegExp(Ext.escapeRe(text), 'i');   							//根据输入制作一个正则表达式，'i'代表不区分大小写
        tree.root.cascade(function(n) {   											//找出所有匹配的结点   
            if(re.test(n.attributes.text)){   
                matched.push(n);   
            }   
        },this);   
 		tree.root.cascade(function(n) { 											//处理每一条子结点路径
            n.bubble(function(nbb){   												//从叶子到根,逐个剪掉   
                var contain = false;   
                for ( var mted = 0; mted < matched.length; mted++) { 
                    if(nbb.contains(matched[mted]) || nbb == matched[mted] ){   	//包含匹配的结点
                        contain = true;   
                        break;   
                    }   
                }   
                if(!contain){   									//把不包含匹配结点的结点隐藏   
                    nbb.ui.hide(); 
                    tree.hiddenPkgs.push(nbb); 
                    this.treeFilter.filtered[nbb.id]=nbb; 
                }   
            },this);  
     	},this); 
	},
	/**
	 * 重新加载节点函数.
	 */
	refreshNode : function(node){
		if(node.hasChildNodes()){
    		node.reload();
    	}
	},
	beforeExpandNode : function(){
		this.loader.on('beforeload', function(loader, node) {
			for(att in node.attributes){
				if(typeof node.attributes[att] != 'Object'){
					this.baseParams[att] = node.attributes[att];
				}
			}
	    }, this.loader);
	},
	/**
	 * 树展开之前添加传到后台的参数.
	 */
	addBaseParams : function(){
		var params = this.baseParams;
		if(params) {
		    this.loader.on('beforeload', function(loader, node) {
		    	for(var i=0; i<params.length; i++) {
					this.baseParams[params[i]] = node.attributes[params[i]];
				}
		    }, this.loader);
		}
	},
	/**
	 * 初始化树
	 */
	initTree : function(){
		this.nodemenu.addItem({										//给树节点右键添加刷新菜单
			text:'刷新',
			scope:this,
			handler:function(){
				this.refreshNode(this.nodemenu.node);
			}
		});
		this.addTreeListener();
		this.addBaseParams();
		this.rootExpand.defer(500,this);
	},
	rootExpand : function(){
		this.getRootNode().expand();
	}
});

