Ext.ns('app.harmony.system.Plugin')
Ext.QuickTips.init();
Ext.ux.TreePanel = function(config) {
	Ext.apply(this, config);
	this.initProperty();
	Ext.ux.TreePanel.superclass.constructor.call(this, config);
	this.initTree();
}
Ext.extend(Ext.ux.TreePanel, Ext.tree.TreePanel, {
	/********************** Begin TreePanel的参数 *************************/
	url : '/PublicTree.do',							//树的url参数
	action : 'example',								//树调用的Action
	treeTitle : '',									//树根目录的名称
	region : 'west',								//树布局的位置(左边)
	autoScroll : true,								//是否有滚动条
	width : 200,									//树的默认宽度
	searchFieldWidth : 195,							//搜索框的宽度
	rootVisible : false,							//树的根目录是否可见,如果设置了title属性,则此属性自动转换为true
	nodemenu : new Ext.menu.Menu(),					//树节点的右键菜单
	rootID : '0',
    root: {											
    	nodeType: 'async',							//异步
		id : '0',									//树的根目录id
		qtip : '目录',								//树节点提示名称
		text : '目录'								//树节点显示名称
    },
	hiddenPkgs : [],								//隐藏的节点
	baseParams : [],								//节点展开前传给后台的参数,例如baseParams : ['id','text','qtip'],
													//注意：这里的参数要统一设置成小写
	/********************** End TreePanel的参数 *************************/
	/*
	 * 初始化树的属性.
	 */
	initProperty : function(){
		this.dataUrl = this.url+'?action='+this.action;
		if(!Ext.isEmpty(this.treeTitle)) {								//如果有treeTitle属性,显示根目录
			this.rootVisible = true,
			this.root = {
				nodeType: 'async',
				id : this.rootID,
				qtip : this.treeTitle,
				text : this.treeTitle
			}
		};
		this.tbar = [new Ext.form.TextField({ 
	    	width: this.searchFieldWidth, 
	    	emptyText:'请输入过滤条件...', 
	    	listeners:{ 
	     		render: function(field){
      				field.el.on('keydown', field.getBubbleTarget().getBubbleTarget().filterBy, field, {buffer: 350}); 
	     		} 
	    	} 
		})]
	},
	/*
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
	/*
	 * 重新加载节点函数.
	 */
	refreshNode : function(node){
		if(node.hasChildNodes()){
    		node.reload();
    	}
	},
	/*
	 * 给树节点右键添加菜单函数.
	 */
	addmenu : function(){
		
	},
	/*
	 * 树展开之前添加传到后台的参数.
	 */
	addBaseParams : function(){
		if(this.baseParams) {
			this.on("beforeload", function(node, e) {
				var paramObj = {};
				for(var i=0; i<this.baseParams.length; i++) {
					paramObj[this.baseParams[i]] = node.attributes[this.baseParams[i]];
				}
			    node.attributes.loader.baseParams = paramObj;
		    });
		}
	},
	/*
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
		this.addmenu();
		this.addListener('contextmenu',function(node,e){
			node.select();
    		e.preventDefault();
    		this.nodemenu.node = node;
    		this.nodemenu.showAt(e.getXY());
		},this);
		this.addBaseParams();
	}
});

Ext.reg('ux_treepanel', Ext.ux.TreePanel);
