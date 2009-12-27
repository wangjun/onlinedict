
function ReadWord()
{
  var dbWords = [];
  var oldDB = localStorage["dbWords2"];
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
  localStorage["dbWords2"] = JSON.stringify(dbWords);
}

function AddWord(word,sentence,pageUrl,pos)
{
    var dbWords = ReadWord(); //写之前要先读出一次，否则可能会冲掉后面的修改
    //alert(word);
    dbWords.push([(new Date()).getTime(),word,sentence,pageUrl,pos]);
    SaveWord(dbWords);
    //alert(dbWords);
}

function DBSetGood(id)
{
  var dbWords = ReadWord(); //写之前要先读出一次，否则可能会冲掉后面的修改
  dbWords[id][3] = 1;
  SaveWord(dbWords);
}