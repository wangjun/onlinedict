var body = document.getElementsByTagName("body")[0];
var last_word = null;
var last_frame = null;
var last_div = null;
var g_bDisable = false;
var div_num = 0;

var colorsOptions = null;
var localColors = false;
var colors=[["#DCF6DB","#3A3"],
    ["#48BDF0","#3589AD"],
    ["#F2F2F2","#808080"],
    ["#E9ACF2","#F57A3D"]
];

chrome.extension.sendRequest(
    {
        init: "init"
    },
    function(response)
    {
      //alert(response);
        if (response.ColorOptions)
        {
            colorsOptions = JSON.parse(response.ColorOptions);
        }
        //读设置值的方法
        //alert(optVal("text_color"));
    }
);

function SaveNewWord(w,s,purl,pos)
{
  chrome.extension.sendRequest(
    {
        init: "new",
        word: w,
        sentence:s,
        wordurl: purl,
        wordpos: pos
        
    },
    function(response)
    {
      //alert("dream?");
      //alert(response);
	  if(response.result)
	  {
		/*last_div.innerHTML = '<font color=green><font color=red>' + response.result.word + "</font> 重复查询<font color=red>"+ response.result.translateCount + '</font> 次</font> <span id="tool_indexpage"><a href=#><font color=red>复习\>\></font></a></span></font>';
		last_div.style.display = 'block';
        div_toolbar.style.fontSize = "6px;"
        document.getElementById('tool_indexpage').addEventListener("mouseup",tool_indexpage, false);*/
	  }
	  
    }
);

}

function optVal(strKey)
{
    if (colorsOptions !== null)
    {
        return colorsOptions[strKey][1];
    } else
    {
//        window.location.reload();
    }

}

var lstWords = [];
//保留当前翻译窗口
function getWordIndex(word) {
  for(var i=lstWords.length-1;i>=0;i--)
  {
    if(lstWords[i]==word)
    {
        return i;
    }
  }
  return -100;
}

/*
 * yaofur update:用正则表达式判定
 */

function isEnglish(s)
{	
	var patrn=/^[A-Za-z]+$/;
	if (!patrn.exec(s)) {
			return false;
		}else{
			return true;
		}
	
    /*
	for(var i=0;i<s.length;i++)
    {
        if(s.charCodeAt(i)>126)
        {
            return false;
        }
    }
    return true; 
    */
}

//按下键盘时，关闭窗口
document.onkeydown=function(e) {
  if(optVal("ctrl_only")) //避免窗口一出现就消失
  {
    return;
  }
  e=e || window.event;
  var key=e.keyCode || e.which;
  //alert(key);
  OnCheckCloseWindow();
};

//监听鼠标消息
body.addEventListener("mouseup",OnDictEvent, false);

//保留当前翻译窗口
function tool_pin() {
  lstWords.push(last_word); 
  last_frame = null;
  last_div = null;
}

//禁用翻译功能
function tool_disable() {
  //alert(window.location.href);
  g_bDisable = true;
}

//跳转到主页
function tool_indexpage() {
    window.location.href = chrome.extension.getURL("remember.htm");
}

//检查翻译窗口是否存在，如果存在则关闭它
function OnCheckCloseWindow() {
  if (last_frame != null) {
    body.removeChild(last_frame);
    if(last_div)
    {
      body.removeChild(last_div);
    }
    last_frame = null;
    last_div = null;
    return true;
  }
  return false;
}

//唤起取词
function OnDictEvent(e) {
  if (OnCheckCloseWindow()) {
    return;
  }
  
  //alert(optVal("dict_disable"));
  if(optVal("dict_disable"))
  {
    return;
  }
   
  //两个同为true或者同为false方可  
  if(!optVal("ctrl_only") && e.ctrlKey)
  {
    return;
  }
  if(optVal("ctrl_only") && !e.ctrlKey)
  {
    return;
  }
  if(g_bDisable)
  {
    return;
  }
  var url_disable = "http://dict.cn/mini.php";
  if(window.location.href.substring(0,url_disable.length)==url_disable)
  {
    return;
  }
  var word = String(window.getSelection());
  word = word.replace(/^\s*/, "").replace(/\s*$/, "");
  
  //太长的字符串不取词
  if(word.length>36)
  {
    return;
  }
  
  //只对英文显示取词
  if(optVal("english_only"))
  {
    if(!isEnglish(word))
    {
        return;
    }
  }
  
  //刚取过的词，再次点击不弹出（主要是为了避免点击“钉住”功能时仍然弹出）。
  //if(getWordIndex(word)==(div_num-1))
  if(getWordIndex(word)>=0)
  {
    return;
  }
  
  if (word != '') {
    SaveNewWord(word,window.getSelection().getRangeAt(0).startContainer.nodeValue,window.location.href,0);
    createPopUp(word, window.getSelection().getRangeAt(0).startContainer.nodeValue, e.pageX, e.pageY, e.screenX, e.screenY);
    return;
  }
}

//显示翻译窗口
function createPopUp(word,senctence, x, y, screenX, screenY) {
  if (OnCheckCloseWindow()) {
    return;
  }
  
  last_word = word;
  
  var frame_height = 300;
  var frame_width  = 250;
  var padding = 10;
  
  var frame_left = 0;
  var frame_top = 0;
  
  frame = document.createElement('iframe');
  //frame.src = 'http://dict.cn/mini.php?q=' + escape(word);
  //frame.src = 'http://dict.cn/mini.php?q=' + word;
	var src ;
	var serviceId=optVal("dictionary_service");
	if(!serviceId){
		serviceId = 0;
	}
	switch ( serviceId ){
		case 0:
			if( optVal("custom_service").match("%s") ){
				src = optVal("custom_service").replace("%s",word);
				break;
			}
			else serviceId = 1;
		case 1: //google
			src = chrome.extension.getURL("googledictionary.html")+"?"+word;
			break;
		case 2: //dict
			src = 'http://dict.cn/mini.php?q=' + word;
			frame.style.backgroundColor ="#D9D9D9";
			break;
	}
	
	
	frame.src = src;
	frame.id = 'OnlineDict';
	frame.class ="OnineDict";
  var screen_width = screen.availWidth;
  var screen_height = screen.availHeight;
  
  if (screenX + frame_width < screen_width) {
    frame_left = x;
  } else {
    frame_left = (x - frame_width - 2 * padding);
  }
  frame.style.left = frame_left + 'px';
  
  if (screenY + frame_height + 20 < screen_height) {
    frame_top = y;
  } else {
	frame_top = (y - frame_height - 2 * padding);
  }
  frame.style.top = frame_top + 'px';
  
  //frame.style.left = x + 'px';
  //frame.style.top = y + div_height*3/4 + 'px';
  frame.style.position = 'absolute';
  frame.style.width = "100%";//frame_width + 'px';
 	frame.style.height = frame_height + 'px';
  //frame.style.border = '1px solid ' + colors[optVal("color_type")][1];//optVal("links_color");
  frame.style.border = '0px'; //solid #767676';
  frame.style.zIndex = '65535';
  //frame.style.backgroundColor = colors[optVal("color_type")][0];//'#DCF6DB';
  //frame.style.backgroundColor = '#EFF0F6';
  //frame.style.font="Georgia, serif";
  //frame.style.borderRadius ="4px";// round border,not support IE
	frame.scrolling="auto";
	//frame.innerHTML = "正在载入...";
	
	body.appendChild(frame);
	
	
	
  //SaveNewWord(word,senctence,window.location.href,0);
  last_frame = frame;
	
  //return;
  
  var div_toolbar = document.createElement('div');
  //div_toolbar.src = 'http://dict.cn/mini.php?q=' + escape(word);
  //div_toolbar.innerHTML = 
   //"<img id='tool_pin" + div_num + "' src='" + chrome.extension.getURL("pin.png") + "'>"
   //+ "<img id='tool_disable" + div_num + "' src='" + chrome.extension.getURL("disable.png") +"'>"
   //+ "<img id='tool_close' src='" + chrome.extension.getURL("close.png") +"'>";
  div_toolbar.style.left = frame_left + 'px';
  div_toolbar.style.top = frame_top + frame_height + 0 + 'px';
  div_toolbar.style.align = 'right';
  div_toolbar.style.position = 'absolute';
  div_toolbar.style.width = frame.style.width;  
  div_toolbar.style.fontSize = "8px;";
  //div_toolbar.style.height = '20px';
  div_toolbar.style.border = '1px solid #767676';//'1px solid ' + colors[optVal("color_type")][1];
  div_toolbar.style.backgroundColor = '#EFF0F6';//colors[optVal("color_type")][1];//'#3A3';
  div_toolbar.style.zIndex = '65535';
  div_toolbar.style.display = 'none';
	div_toolbar.name          = word;
	div_toolbar.id            = 'onlinedictquery';
  body.appendChild(div_toolbar);
  last_div = div_toolbar;
  
	//给iframe发送消息@todo 有问题.无法接收
	//console.log("sending");
	//chrome.extension.sendRequest({query:word});
	

  //document.getElementById('tool_pin' + div_num).addEventListener("mouseup",tool_pin, false);
  //document.getElementById('tool_disable' + div_num).addEventListener("mouseup",tool_disable, false);
  
  div_num++;
  
}