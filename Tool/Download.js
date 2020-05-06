Ext.ns("app.harmony.system.Tool");
app.harmony.system.Tool.Download = function(config){
	Ext.apply(this,config);
	app.harmony.system.Tool.Download.superclass.constructor.call(this,config);
	this.startDown();
};
//文件下载，压缩下载时，如果有多个同名文件，只保留其中一个；
Ext.extend(app.harmony.system.Tool.Download,Object,{
	rid:'',
	isZip:false,						//默认非打包下载
	sUrl:'/PublicFileOpen.do?',			//默认单文件下载
	filename:'',
	filetype:'',
	column:'DATA',
	tablename:'',
	startDown : function(){
		if(this.tablename==''||(this.filename==''&&this.rid=='')){
			Ext.Msg.alert('提示','参数错误，无法下载文件！');
			return;
		}
		
		if(this.tablename.split(",").length>1)
			this.isZip=true;
			
		if(this.isZip){
			if(this.column=='DATA')this.column='';
			var tabNum=this.tablename.split(",").length;
			var ridNum=this.rid.split(",").length;
			var fileNum=this.filename.split(",").length;
			var colNum=this.column.split(",").length;
			var typeNum=this.filetype.split(",").length;
			
			if((this.rid!=''&& ridNum!=tabNum)||
						(this.filename!=''&&fileNum!=tabNum)||
						(this.column!=''&&colNum!=tabNum)||
						(this.filetype!=''&&typeNum!=tabNum)){
							
				Ext.Msg.alert('提示','参数错误，无法下载文件！');
				return;
				
			}
			
			this.sUrl='./PublicFileOpenZip.do?';
		}
		
		var w=window.open(this.sUrl+'aa=111&rid='+ this.rid +'&tablename='+this.tablename+'&filename='+this.filename+'&column='+
					this.column+'&filetype='+this.filetype,'',
					'height=270,width=360,top=300,left=600,toolbar=no,menubar=no,scrollbars=no,resizable=no,' +
					'location=no,status=no,title=no');
	}
	
});