var dbWords = [];
function ReadWord()
{
  var old = localStorage["dbWords3"];
  if(old)
  {
      return JSON.parse(old);;
  }
  return [];
}
dbWords = ReadWord();
function SaveWord()
{
  localStorage["dbWords3"] = JSON.stringify(dbWords);
}
function AddWord(word,sentence,pageUrl,pos)
{
    dbWords.push([(new Date()).getTime(),word,sentence,pageUrl,pos]);
    SaveWord();
    //dbWords[dbWords.length] = [word,sentence,pageUrl,pos];
}