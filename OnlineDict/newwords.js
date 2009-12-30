
function ReadWord()
{
  var dbWords = [];
  var oldDB = localStorage["dbWords3"];
  if(oldDB)
  {
      //alert(old);
      //alert(oldDB);
      dbWords = JSON.parse(oldDB);
  }
  
  return dbWords;
}

function SaveWord(dbWords)
{
  localStorage["dbWords3"] = JSON.stringify(dbWords);
}

function AddWord(word,sentence,pageUrl,pos)
{
    DBAddItem([(new Date()).getTime(),word,sentence,0,pageUrl,pos]);
    
    var dbWords = ReadWord(); //写之前要先读出一次，否则可能会冲掉后面的修改
    //alert(word);
    dbWords.push([(new Date()).getTime(),word,sentence,0,pageUrl,pos]);
    SaveWord(dbWords);
    //alert(dbWords);
}

function DBSetGood(id)
{
  var dbWords = ReadWord(); //写之前要先读出一次，否则可能会冲掉后面的修改
  dbWords[id][3] = 1;
  SaveWord(dbWords);
}

////////////////////////////////////////////////////////////////////////
var BLOCK_ITEM_COUNT = 100; //一个块里，最多多少条目
var MAX_BLOCK_COUNT = 100;  //最多多少个块
var DB_INFO =
{
    "idBegin":0,
    "itemCount":0,
    "lastBlockId":0,
};

function _DBReadInfo()
{
  var oldDB = localStorage["_DBInfo"];
  if(oldDB)
  {
      DB_INFO = JSON.parse(oldDB);
  }
  return DB_INFO;
}

function _DBSaveInfo()
{
  localStorage["_DBInfo"] = JSON.stringify(DB_INFO);
}

function _DBReadBlock(idBlock)
{
  _DBReadInfo();
  //alert(DB_INFO["lastBlockId"] + "," + idBlock);
  if(DB_INFO["lastBlockId"]>idBlock)
  {
    return null;
  }
  var dbWords = [];
  var oldDB = localStorage["dbData_" + idBlock];
  //alert("oldDB:" + oldDB);
  if(oldDB)
  {
      dbWords = JSON.parse(oldDB);
  }
  return dbWords;
}

function _DBSaveBlock(idBlock,items)
{
  localStorage["dbData_" + idBlock] = JSON.stringify(items);
}

function DBGetRange()
{
  return _DBReadInfo();
}

function DBGetItem(id)
{
  var blockId = Math.floor(id/BLOCK_ITEM_COUNT);
  //alert("id%BLOCK_ITEM_COUNT:" + id%BLOCK_ITEM_COUNT + "," + blockId);
  var items = _DBReadBlock(blockId);
  if(!items)
  {
    return null;
  }
  if(items.length<=id%BLOCK_ITEM_COUNT)
  {
      return null;
  }
  //alert(items.length + " - " + id%BLOCK_ITEM_COUNT);
  return items[id%BLOCK_ITEM_COUNT];
}
function DBUpdateItem(id,item)
{
  var blockId = Math.floor(id/BLOCK_ITEM_COUNT);
  var items = _DBReadBlock(blockId);
  if(!items)
  {
    return false;
  }
  if(items.length>id%BLOCK_ITEM_COUNT)
  {
      return false;
  }
  items[id%BLOCK_ITEM_COUNT] = item;
  _DBSaveBlock(id,items);
  return true;
}
function DBAddItem(item)
{
  _DBReadInfo();
  var id = 1+DB_INFO["itemCount"];
  var blockId = Math.floor(id/BLOCK_ITEM_COUNT);
  
  var items = _DBReadBlock(blockId);
  if(!items)
  {
    items = [];
  }
  items.push(item);
  
  //先保存数据
  _DBSaveBlock(blockId,items);
  
  //再保存索引
  DB_INFO["itemCount"] = id;
  DB_INFO["lastBlockId"] = blockId;
  _DBSaveInfo();
  //alert("item:" + item);
}