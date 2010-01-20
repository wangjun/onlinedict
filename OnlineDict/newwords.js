﻿/*	OnlineDict词典数据库操作
*	author: haozes@gmail.com
*	date:2010/01/13
*/
var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}
var DictDB=Class.create();
DictDB.prototype=
{
	initialize: function() {
		this.dbName='dict';
		this.db=null;
	},
	init:function(){
		if (window.openDatabase){
			this.db = window.openDatabase(this.dbName, "1.0",this.dbName, 1024*1024);
			if(!db)
				console.log(result);(this,'Cannot openDatabase,maybe the browser do not support HTML5');
			this.db.transaction(function(query) {
					query.executeSql('CREATE TABLE IF NOT EXISTS [dict] ('
									  +'[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' 
									  +'[word] NVARCHAR(30) NOT NULL,' 
									  +'[sentence] NVARCHAR(600),' 
									  +'[pageUrl] NVARCHAR(200),' 
									  +'[addTime] DATETIME,' 
									  +'[translateCount] INT DEFAULT 1)',
									[]);
					});
		}	
	},
	Exec:function(sql,para,transHandler,errHandler){
			this.db.transaction(function(query) {
				query.executeSql(sql,
								para,
								function(transaction, result) {
									console.log(result);
									if(transHandler)
										transHandler(result);
								},
								function(transaction, error) {
									console.log(sql);
									console.log(error);
									if(errHandler)
										errHandler(error);
								});
			});
	},
	NewWord:function(word,sen,url){
		console.log("add word");
		this.Exec('INSERT INTO dict(word, sentence,pageUrl,addTime,translateCount) VALUES (?,?,?,?,?)'
				,[word, sen,url,(new Date()).getTime(),1]);
	},
	Update: function(word, sen, url) {
		this.Exec('UPDATE  dict SET sentence=?,pageUrl=?,addTime=?,translateCount=translateCount+1 WHERE word=?'
				,[sen,url,(new Date()).getTime(),word]);
	},
	IncreaseTranslateCount:function(id){
		this.Exec('UPDATE  dict SET translateCount=translateCount+1 WHERE id=?'
				,[id]);
	},
	/*DecreaseTranslateCount:function(word){
			this.Exec('UPDATE  dict SET translateCount=translateCount-1 WHERE word=?'
				,[word]);
	},*/
	GetWord:function(word,fun){
			var w=null;
			this.Exec('SELECT * FROM dict WHERE word=?'
				,[word]
				,function(result){
									if(result.rows.length>0){
										var row=result.rows.item(0);
										console.log(row);
										w = {
												id: row['id'],
												word: row['title'],
												sentence: row['body'],
												pageUrl:row['pageUrl'],
												addTime:row['addTime'],
												translateCount:row['translateCount']
											};
									}
									return fun(w);
								}
			);
	},
	DeleteWord:function(id){
				this.Exec('DELETE FROM dict WHERE id=?',[id]);
				//this.Exec('UPDATE  dict SET translateCount=-1 WHERE word=?',[word]);
	},
	SetRemember:function(id){
				//this.Exec('DELETE FROM dict WHERE word=?',[word]);
				this.Exec('UPDATE  dict SET translateCount=0 WHERE id=?',[id]);
	},
	GetRows:function(pageIndex,pageSize,orderKey,fun){
		if(!orderKey)
			orderKey='translateCount';
		var offset = pageSize * pageIndex;
		var w=null;
		this.Exec('SELECT * FROM dict order by '+orderKey+' limit '+offset+','+pageSize
				,[]
				,function(result) {
						for(var i=0;i<result.rows.length;i++){
							var row = result.rows.item(i)
							w = {
								id: row['id'],
								word: row['word'],
								sentence: row['sentence'],
								pageUrl:row['pageUrl'],
								addTime:row['addTime'],
								translateCount:row['translateCount']
							}
							console.log(w);
							fun(w);
						}
				}
		);
	},
	GetTotalCount:function(fun){
		this.Exec('SELECT COUNT(1) as num FROM dict'
			,[]
			,function(result){
				console.log(result.rows.length);
				var count=result.rows.item(0)['num'];
				fun(count);
			}
		);
	},
	GetRememberCount:function(fun){
		this.Exec('SELECT COUNT(1) as num FROM dict WHERE translateCount=0'
			,[]
			,function(result){
				console.log(result.rows.length);
				var count=result.rows.item(0)['num'];
				fun(count);
			}
		);
	},
	GetNewWordsCount:function(fun){
		this.Exec('SELECT COUNT(1) as num FROM dict WHERE translateCount>0'
			,[]
			,function(result){
				console.log(result.rows.length);
				var count=result.rows.item(0)['num'];
				fun(count);
			}
		);
	},
	FindWordByID:function(id,fun){
			var w=null;
			this.Exec('SELECT * FROM dict WHERE id=?'
				,[id]
				,function(result){
									if(result.rows.length>0){
										var row=result.rows.item(0);
										console.log(row);
										w = {
												id: row['id'],
												word: row['title'],
												sentence: row['body'],
												pageUrl:row['pageUrl'],
												addTime:row['addTime'],
												translateCount:row['translateCount']
											};
									}
									return fun(w);
								}
			);
	},
};