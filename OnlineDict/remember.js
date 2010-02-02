/* util script start*/
function getid(element) {
  //if (typeof element == 'string')
   return document.getElementById(element);
}
function GetGroupValue(groupName){
	var group=document.getElementsByName(groupName);
	if(!group)
		return null;
	for(var i=0;i<group.length;i++){
		if(group[i].checked)
			return group[i].value;
	}
	return null;
}
/*
hide=function(element) {
  getid(element).style.display = 'none';
  return element;
}

show=function(element) {
  getid(element).style.display = '';
  return element;
}
*/
Date.prototype.format = function(format)  
{  
   var o = {  
     "M+" : this.getMonth()+1, //month  
     "d+" : this.getDate(),    //day  
     "h+" : this.getHours(),   //hour  
     "m+" : this.getMinutes(), //minute  
     "s+" : this.getSeconds(), //second  
     "q+" : Math.floor((this.getMonth()+3)/3), //quarter  
     "S" : this.getMilliseconds() //millisecond  
   }  
   if(/(y+)/.test(format)) format=format.replace(RegExp.$1,  
     (this.getFullYear()+"").substr(4 - RegExp.$1.length));  
   for(var k in o)if(new RegExp("("+ k +")").test(format))  
     format = format.replace(RegExp.$1,  
       RegExp.$1.length==1 ? o[k] :   
         ("00"+ o[k]).substr((""+ o[k]).length));  
   return format;  
} 
/* util script end*/
var last_web_translate_frame = null;
function WebTranslate()
{
    if (last_web_translate_frame != null) {
        var div=document.getElementById("div_webTranslate");
        div.removeChild(last_web_translate_frame);
        last_web_translate_frame = null;
        return;
    }
    var strWord = getid("input_word").value;
    if(strWord.length<=2)
    {
        alert("");
        return;
    }
    var frame_height = 280;
    var frame_width = 200;
    var div_height = 20;

    var frame = document.createElement('iframe');
    frame.src = 'http://dict.cn/mini.php?q=' + strWord;
    frame.fold=false;

    frame.style.left = '10px';
    frame.style.top = '10px';
    frame.style.width = '500px';
    frame.style.height = '309px';
    //frame.style.border = 'solid 1px #ccc';
    frame.style.border = '1px solid #767676';
    //frame.style.backgroundColor = colors[optVal("color_type")][0];//'#DCF6DB';
    frame.style.backgroundColor = '#EFF0F6';
    frame.style.font="Georgia, serif";
    frame.style.borderRadius ="4px";// round border,not support IE
    var div=document.getElementById("div_webTranslate");
    div.appendChild(frame);
    
    last_web_translate_frame = frame;
}

var currentpage = 0;
var PAGE_SIZE=7;
var db=new DictDB();
function CreateTranslateFrame(id) {
  var frame_height = 280;
  var frame_width = 200;
  var div_height = 20;
  
  db.FindWordByID(id,function(rs){
	  var frame = document.createElement('iframe');
	  frame.src = 'http://dict.cn/mini.php?q=' + rs.word;
	  frame.id = 'frame_'+rs.id;
	  frame.fold=false;
	  
	  frame.style.left = '10px';
	  frame.style.top = '10px';
	  frame.style.width = '95%';
	  frame.style.height = '209px';
	  frame.style.border = '0px solid ';
	  //return frame;
	  var p=document.getElementById("div_words");
	  var div=document.getElementById("div_newword_" + id);
	  div.appendChild(frame);
  });
  
}

function SetOrder(){
	ShowPage(currentpage);
}

function GetPageCount(fun){
	db.GetTotalCount(function(result){
						var itemcount = result;
						if(itemcount<=0)
						{
							fun(0);
						}
						var flr = Math.floor(itemcount/PAGE_SIZE);
						if(0==itemcount%PAGE_SIZE)
						{
							flr -= 1;
						}
						fun(flr);
					}
	)
}

function SetRemember(id){
	db.SetRemember(id);
	/*var span=getid('count_'+id);
	if(span){
		span.innerHTML=TranslateCountToText(0);
	}*/
	UpdateTranslateCounts(id);
	UpdateWordCounts();
}
function TranslateCountToText(translateCount)
{
	if(translateCount>1){
		return '<font color=red>' + translateCount +'</font> 次取词';
	}
	else if(translateCount>0){
		return translateCount +' 次取词';
	}
	else {
		return '<font color=green>记住了</font>';
	}
}


function RemoveWord(id){
	//Debug("Remove:id:"+id);
	//var p=document.getElementById("div_words");
	//var div=document.getElementById("div_newword_" + id);
	//p.removeChild(div);
	db.DeleteWord(id);
	ShowPage(currentpage);
	UpdateWordCounts();
}

function ShowTranslateFrame(id){
	//Debug(count);
	var frame=getid("frame_"+id);
	if(frame){
		if(frame.fold){
			frame.style.width = '95%';
			frame.style.height = '209px';
			db.IncreaseTranslateCount(id);
			UpdateTranslateCounts(id);
		}else{
			frame.style.width = '0px';
			frame.style.height = '0px';
		}
		frame.fold=!frame.fold;
	}
	else
	{
		db.IncreaseTranslateCount(id);
		UpdateTranslateCounts(id);
		CreateTranslateFrame(id);
	}
	
	UpdateWordCounts();
}

function ListWordPageList(pageIndex){
	var orderKey=GetGroupValue("rdOrderKey");
	orderKey=orderKey?orderKey:"translateCount";
	var order=GetGroupValue("rdOrder");
	order=order?order:"desc";
	
	var orderStr = "";
	if(orderKey=="translateCount")
	{
		orderStr = "translateCount " + order + ",addTime desc"; //先按取词次数排序，再按时间倒序排序
	}
	else
	{
		orderStr = orderKey + " " + order;
	}

	document.getElementById("div_words").innerHTML = "";
	db.GetRows(pageIndex,PAGE_SIZE,orderStr,function(rs){
						//Debug('add');
						if(!rs)
							return;
						var reg = new RegExp(rs.word,"gim");	
						var div = document.createElement("div");
						var sourceDiv='';
						var sen='';
						if(rs.pageUrl && rs.pageUrl.indexOf('http')==0)//取词的来源可能不是普通Web页面.
							sourceDiv='<div class="opBtn"><a href="'+rs.pageUrl+'" title="'+rs.pageUrl+'" target="_blank"><image src="go.png"></a></div>';
						if(rs.sentence)	
							sen=rs.sentence.replace(reg,"<b><font color='red'>"+rs.word+"</font></b>");
						div.id = "div_newword_" + rs.id;
						div.className="lineBlock";
						div.innerHTML='<div class="wordTitle">'
											+'<div class="keyWord">'+rs.word+'</div>'
											+sourceDiv
											+'<div class="opBtn"><a title="记住了" onclick=\'SetRemember("'+rs.id+'")\' href="#"><image src="tick.png"></a></div>'
											+'<div class="opBtn"><a title="删除" onclick=\'RemoveWord("'+rs.id+ '")\' href="#"><image src="del.png"></a></div>'
											+'<div class="opBtn"><a title="查询" onclick=\'ShowTranslateFrame("'+rs.id+'")\' href="#"><image src="search.png"></a></div>'
											+'<div class="opBtn"><span id="count_'+rs.id+'">'+TranslateCountToText(rs.translateCount)+'</span></div>'
											+'<div class="opBtn">'+new Date(rs.addTime).format("MM/dd hh:mm")+'</div>'
										+'</div>'
										+'<div style="font-size:13px;">'+sen+'</div>';
										//+'<div onclick=\'AddFrame(this,"'+rs.word+'")\'></div>';
						getid("div_words").appendChild(div);	
						/*var arr=div.getElementsByTagName("div");
						if(arr.length>0){
							arr[arr.length-1].onclick();
						}*/
					}
				);
}

function ShowPage(i){
	GetPageCount(function(result){
					//Debug(result);
					if(result<i)
						return;
					document.getElementById("itemcount").innerHTML = (result+1) + "页之" + (i+1);
					ListWordPageList(i);
				}
	)
}

function ShowPrevPage(){
	if(currentpage>0){
		currentpage--;
		ShowPage(currentpage);
	}
}

function ShowNextPage(){
	GetPageCount(function(result){
		var nextpage=currentpage+1;
		if(nextpage<=result){
			currentpage++;
			ShowPage(currentpage);
		}
		}
	);	
}

function Debug(str){
	var s=getid("debug").innerHTML;
	getid("debug").innerHTML=s+"<br>"+str;
}

function UpdateWordCounts()
{
	db.GetNewWordsCount(function(result){
		var span=getid('span_newwords');
		if(span){
			span.innerHTML="<font color='red'>" + result + "个</font>新单词";
		}
	}
	)
	db.GetRememberCount(function(result){
		var span=getid('span_rememberwords');
		if(span){
			span.innerHTML="已记住<font color='red'>" + result + "个</font>单词";
		}
	}
	)
}

function UpdateTranslateCounts(id)
{
	db.FindWordByID(id,function(rs){
		var span=getid('count_'+rs.id);
		if(span){
			span.innerHTML=TranslateCountToText(rs.translateCount);
		}
	}
	);
}