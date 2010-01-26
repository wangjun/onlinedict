/*	WebClip数据库封装
*	modify: tantianzuo@gmail.com
* date:2010/01/16
*
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
var YXBase=Class.create();
YXBase.prototype=
{
	initialize: function() {
		this.gver_local = 0;
		this.gver_server = 0;
	},
	init:function(){
	},
	NewWord:function(title,sen,url){
		console.log("add title");
		this.Exec('INSERT INTO T_article(title, body,pageUrl,addTime) VALUES (?,?,?,?)'
				,[title, sen,url,(new Date()).getTime()]);
	}
};