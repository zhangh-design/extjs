<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<object id="factory" viewastext style="display: none" codeBase="../app/harmony/system/Plugin/smsx.cab#Version=7,0,0,8" classid="clsid:1663ed61-23eb-11d2-b92f-008048fdd814"></object>
		<script type="text/javascript">
			function load(){
				factory.printing.header = "";
				factory.printing.footer = "";
				factory.printing.leftMargin = 7;
				factory.printing.topMargin = 7;
				factory.printing.rightMargin = 7;
				factory.printing.bottomMargin = 7;
			}
			function showBigPic(img){
				js2java.modifyPicture(img.src);
			}
		</script>
		<title>打印</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<style type="text/css">
			body{
				text-align:center;
				margin:0 auto;
			}
		</style>
	</head>
	<body onLoad="load();" >
		<div> 
			${content} 
		</div>
	</body>
</html>
