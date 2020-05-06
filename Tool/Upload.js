/**
 * 文件上传控件
 */
$styleSheet("app.ext3-2.script.SwfUploadPanel");
$styleSheet("app.ext3-2.css.fileuploadfield");
$import("app.ext3-2.script.SwfUpload");
$import("app.ext3-2.script.SwfUploadPanel");
Ext.ns("app.harmony.system.Tool");
app.harmony.system.Tool.Upload = Ext.extend(Ext.Window,{
	title: '上传文件', 
	url : null,
	modal : true,
	width : 480,
	height : 300,
	resizable: false, 
	pid : '',
	saveTable:'',
	mainTable:'',
	isCover:false,
	curTable : null,
	fileType : '*.*',
	fileSize : 100*1024,  //文件大小(K)
	moduleName : '', //模块名称	
	layout : 'border',
	onlyOne : false,
	token:'',
	initComponent : function(){
		app.harmony.system.Tool.Upload.superclass.initComponent.call(this);
		if(this.url==null)
			this.url = './PublicFileSave.do?savetable='
			+this.saveTable+'&pid='+this.pid+'&iscover='+this.isCover+'&onlyOne='+this.onlyOne+'&token='+this.token;
		else
			this.url = this.url+'&iscover='+this.isCover+'&onlyOne='+this.onlyOne;
		var dlg = new Ext.ux.SwfUploadPanel({
			region : 'center',
			border: false,
			//上传地址
			upload_url: this.url,
			post_params: {"PHPSESSID": ""},
			file_types: this.fileType, 
			file_types_description: '文件名', 
			flash_url: "./app/ext3-2/script/swfupload.swf",
			single_select: false, // 是否单文件
			single_file_select: false, 
			header_size : this.fileSize,
			confirm_delete: false, 
			remove_completed: true
		}); 
		this.add(dlg);	
	}
});