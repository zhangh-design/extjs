Ext.ns('app.harmony.system.Module.WorkFlow.Canvas.Detail');
$styleSheet("app.harmony.system.Module.WorkFlow.Canvas.Detail.data-view");
app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleImg = function(config){
    Ext.apply(this,config);
    app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleImg.superclass.constructor.call(this,config);
};
Ext.extend(app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleImg,Ext.Window,{
	/********************** Begin 面板属性 ************************/
	/** Window内容布局 */
	layout : 'column',                   
	/** Window的布局 */
	modulePanle : null,
	border : false,
	WFInfo : null,
	ImgDetail : null,
	closeAction : 'close',
	isReadOnly : false,
	resizable : false,
	modal : true,
	width : 600,
	height:400,
	ActionUrl : '/WorkFlow/ModuleImg.do',
	/********************** End 面板属性 ************************/
	/**
	 * Window初始化完成
	 */
	initComponent : function(){
		app.harmony.system.Module.WorkFlow.Canvas.Detail.ModuleImg.superclass.initComponent.call(this);
		this.add(this.initWFInfo());
		this.addButton({text:'保存',scope:this,handler:this.saveImg});
		this.addButton({text:'关闭',scope:this,handler:this.close});
	},
	initWFInfo : function(){ 
		this.WFInfo=new Ext.Panel({
			border : false,
			frame:true,
			id : 'images-view',
			height:400,
		    layout:'fit',
			region : 'center',
			items : [this.detail()]
		});
		return this.WFInfo;
	},
	detail:function(){
		var store= new Ext.data.JsonStore({ 
		    root : 'root', 
		    totalProperty : 'totalProperty', 
		    /** 字段的定义对象组成的数组 */
		    fields :['imgname'], 
		    /** True表示在proxy配合下，要求服务器提供一个更新版本的数据对象以便排序，反之就是在Record缓存中排序 */
		    remoteSort:true,
		    /** Proxy对象，用于访问数据对象 */
		    proxy : new Ext.data.HttpProxy(
		    		new Ext.data.Connection({
		    			url:this.ActionUrl+'?object=getImgName&filesrc='+this.modulePanle.imgSrc+"&token="+token,
		    			timeout:this.timeOut
		    		}))
		});
		store.load();
		var tpl = new Ext.XTemplate(
		    '<tpl for=".">',
		    '<div class="thumb-wrap" id="{imgname}">',
		        '<div class="thumb" ><img  src="'+this.modulePanle.imgSrc+'{imgname}" ></div>',	
		        '<span class="x-editable">{imgname}</span></div>',
		    '</tpl>',
		    '<div class="x-clear"></div>'
		);
		this.ImgDetail=new Ext.DataView({
	        store: store,
	        tpl: tpl,
	        autoHeight:true,
	        multiSelect: false,
            overClass:'x-view-over',
            itemSelector:'div.thumb-wrap',
	        autoScroll : true,
            singleSelect : true,
	        emptyText: '未发现图片文件'
	    })
		return this.ImgDetail;
	},
	saveImg : function (){
		if(this.ImgDetail.getSelectedRecords().length<1){
			alert('没有选择图片!');
			return;
		}
		this.modulePanle.changeImage(this.ImgDetail.getSelectedRecords()[0].json.imgname);
		this.close();
	}
});