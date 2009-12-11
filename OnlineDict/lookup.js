var body = document.getElementsByTagName("body")[0];
var last_frame = null;

body.addEventListener("mouseup",OnDictEvent, false);
body.addEventListener("keypress ",OnCheckCloseWindow, false);
//body.addEventListener("click",OnDictEvent, false);
//body.addEventListener("mousedown",OnCheckCloseWindow, false);

function OnCheckCloseWindow(e) {
  if (last_frame != null) {
    body.removeChild(last_frame);
    last_frame = null;
    return;
  }
}

function OnDictEvent(e) {
  if (last_frame != null) {
    body.removeChild(last_frame);
    last_frame = null;
    return;
  }
  
  //var date = new Date();
  //var current_time = date.getTime();
  
  if (e.ctrlKey) {
    return;
  }  
  var word = String(window.getSelection());
  word = word.replace(/^\s*/, "").replace(/\s*$/, "");
  if (word != '') {
    createPopUp(word, e.pageX, e.pageY, e.screenX, e.screenY);
    return;
  }
    
  if (last_frame != null) {
    body.removeChild(last_frame);
    last_frame = null;
    return;
  }
}

function createPopUp(word, x, y, screenX, screenY) {
  if (last_frame != null) {
    body.removeChild(last_frame);
    last_frame = null;
    return;
  }
  frame = document.createElement('iframe');
  //frame.src = 'http://dict.cn/mini.php?q=' + escape(word);
  frame.src = 'http://dict.cn/mini.php?q=' + word;
  frame.id = 'OnlineDict';
 
  body.appendChild(frame);
  
  frame.style.left = x + 'px';
  frame.style.top = y + 'px';
  frame.style.position = 'absolute';
  frame.style.width = '200px';
  frame.style.border = '1px solid #3A3';
  //frame.style.height = '80px';
  //frame.style.backgroundColor = '#7CBE80';
  frame.style.backgroundColor = '#90EE90';
  //frame.style.backgroundColor = '#008000';
  
  last_frame = frame;
}