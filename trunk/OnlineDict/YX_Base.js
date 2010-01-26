var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}

function CheckReturn(apiname,res,funError)
{
	if(res[0]!=apiname)
	{
		funError(apiname + ":系统错误，请与开发人员联系,error=" + res[0]);
		return true;
	}
	if(0!=res[1])
	{
		funError(apiname + ":参数错误,error=" + res[1]);
		return true;
	}
	return false
}

var YXBase=Class.create();
YXBase.prototype=
{
	initialize: function(type) {
		this.g_ngver = 0;
		this.g_user_id = 0;
		this.user_mail = 0;
		this.g_type = type;
	},
	GetUserID:function(funSuccess,funError){
		$.ajax({
		  url: '/GetUserID',
		  type: 'GET',
		  success: function(data) {
			var res = JSON.parse(data);
			if(CheckReturn("GetUserID",res,funError)
			{
				return;
			}
			this.g_user_id = res[2][0];
			this.user_mail = res[2][1];
			
			funSuccess();
			//UpdateNGVER();
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){
			 funError(textStatus);
		  }
		});
	},
	UpdateNGVER:function(funSuccess,funError){
		$.ajax({
		  url: '/GetNGVER',
		  type: 'GET',
		  data: {user_id:g_user_id,type:g_type},
		  success: function(data) {
			var res = JSON.parse(data);
			if(CheckReturn("GetNGVER",res,funError)
			{
				return;
			}

			g_ngver = res[2];
			funSuccess();
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){
			 funError(textStatus);
		  }
		});
	},
	GetList:function(gver1,gver2,funSuccess,funError){
		$.ajax({
		  url: '/GetList',
		  data: {user_id:g_user_id,type:g_type,gver1:gver1,gver2:gver2},
		  success: function(data) {
			var res = JSON.parse(data);
			if(CheckReturn("GetList",res,funError)
			{
				return;
			}        
			funSuccess(res[2]);
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){
			 funError(textStatus);
		  }
		});
	},
	AddData:function(textAdd,funSuccess,funError){
		$.ajax({
		  url: '/AddData',
		  type: 'POST',
		  data: {user_id:g_user_id,type:g_type,ngver:g_ngver,data:textAdd},
		  success: function(data) {
			var res = JSON.parse(data);
			if(CheckReturn("AddData",res,funError)
			{
				return;
			}        
			if(res[2][0]==0) //gid
			{
				funError("参数错误2！");
				return;
			}
			g_ngver = res[2][1];
			funSuccess(res[2]);
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){
			 funError(textStatus);
		  }
		});
	},

	DelData:function DelData(gid,funSuccess,funError)
	{
		$.ajax({
		  url: '/DelData',
		  type: 'GET',
		  data: {user_id:g_user_id,type:g_type,ngver:g_ngver,gid:gid},
		  success: function(data) {
			var res = JSON.parse(data);
			if(CheckReturn("DelData",res,funError)
			{
				return;
			}        

			if(res[2][0]!=gid)
			{
				funError("参数错误2！");
				return;
			}
			g_ngver = res[2][1];
			funSuccess();
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){
			 alert(textStatus);
		  }
		});
	},

	UpdateData:function (gid,funSuccess,funError)
	{
		document.getElementById("DIV_AddData").innerText= "正在更新……";
		var textAdd = document.getElementById("input_data").value;
		$.ajax({
		  url: '/UpdateData',
		  type: 'POST',
		  data: {user_id:g_user_id,type:g_type,ngver:g_ngver,gid:gid,data:textAdd},
		  success: function(data) {
			var res = JSON.parse(data);
			if(CheckReturn("UpdateData",res,funError)
			{
				return;
			}        

			if(res[2][0]!=gid)
			{
				funError("参数错误2！");
				return;
			}
			g_ngver = res[2][1];
			funSuccess();
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){
			 funError(textStatus);
		  }
		});
	},

	GetData:function (gid,funSuccess,funError)
	{
		$.ajax({
		  url: '/GetData',
		  type: 'GET',
		  data: {user_id:g_user_id,type:g_type,gid:gid},
		  success: function(data) {
			var res = JSON.parse(data);
			if(CheckReturn("GetData",res,funError)
			{
				return;
			}        

			if(res[2][0]!=gid)
			{
				funError("参数错误2！");
				return;
			}
			g_ngver = res[2][1];
			funSuccess(res[2]);
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){
			 funError(textStatus);
		  }
		});
	}

};