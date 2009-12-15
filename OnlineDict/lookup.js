var body = document.getElementsByTagName("body")[0];
var last_frame = null;
var last_div = null;
var g_bDisable = false;
var div_num = 0;

//按下键盘时，关闭窗口
document.onkeydown=function(e) {
  e=e || window.event;
  var key=e.keyCode || e.which;
  //alert(key);
  OnCheckCloseWindow();
}

//监听鼠标消息
body.addEventListener("mouseup",OnDictEvent, false);

//保留当前翻译窗口
function tool_pin() {
  //alert(window.location.href);
  last_frame = null;
  last_div = null;
}

//禁用翻译功能
function tool_disable() {
  //alert(window.location.href);
  g_bDisable = true;
}

//检查翻译窗口是否存在，如果存在则关闭它
function OnCheckCloseWindow() {
  if (last_frame != null) {
    body.removeChild(last_frame);
    body.removeChild(last_div);
    last_frame = null;
    return true;
  }
  return false
}

//唤起取词
function OnDictEvent(e) {
  if (OnCheckCloseWindow()) {
    return;
  }
    
  if (e.ctrlKey) {
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
  if (word != '') {
    createPopUp(word, e.pageX, e.pageY, e.screenX, e.screenY);
    return;
  }
}

//显示翻译窗口
function createPopUp(word, x, y, screenX, screenY) {
  if (OnCheckCloseWindow()) {
    return;
  }
  var frame_height = 180;
  var frame_width = 200;
  var div_height = 20;
  
  frame = document.createElement('iframe');
  //frame.src = 'http://dict.cn/mini.php?q=' + escape(word);
  frame.src = 'http://dict.cn/mini.php?q=' + word;
  frame.id = 'OnlineDict';
  
  frame.style.left = x + 'px';
  frame.style.top = y + div_height*3/4 + 'px';
  frame.style.position = 'absolute';
  frame.style.width = frame_width + 'px';
  frame.style.height = frame_height + 'px';
  frame.style.border = '1px solid #3A3';
  frame.style.zIndex = '65535';
  frame.style.backgroundColor = '#DCF6DB';
  //frame.style.backgroundColor = '#7CBE80';
  //frame.style.backgroundColor = '#90EE90';
  //frame.style.backgroundColor = '#008000';
  body.appendChild(frame);
  
  last_frame = frame;
  
  
  var div_toolbar = document.createElement('div');
  //div_toolbar.src = 'http://dict.cn/mini.php?q=' + escape(word);
  div_toolbar.innerHTML = "<img id='tool_pin" + div_num + "' src='" + chrome.extension.getURL("pin.png") + "'>"
   + "<img id='tool_disable" + div_num + "' src='" + chrome.extension.getURL("disable.png") +"'>"
   + "<img id='tool_close' src='" + chrome.extension.getURL("close.png") +"'>";
  div_toolbar.style.left = x + 'px';
  div_toolbar.style.top = y + div_height*3/4 + frame_height + 'px';
  div_toolbar.style.align = 'right';
  div_toolbar.style.position = 'absolute';
  div_toolbar.style.width = frame.style.width;  
  div_toolbar.style.height = '20px';
  div_toolbar.style.border = '1px solid #3A3';
  div_toolbar.style.backgroundColor = '#3A3';
  div_toolbar.style.zIndex = '65535';
  body.appendChild(div_toolbar);
  last_div = div_toolbar;
  
  document.getElementById('tool_pin' + div_num).addEventListener("mouseup",tool_pin, false);
  document.getElementById('tool_disable' + div_num).addEventListener("mouseup",tool_disable, false);
  
  div_num++;
  
}