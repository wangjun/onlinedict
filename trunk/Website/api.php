<?php
/*
 * API.php
 */
 include "init.php";

//ROOT_URL./api.php?app=begin & account=douban

//$access_token = "d2a19c5dcafe6d3d77e4d51960fb47b7";
//$access_token_secret = "ff8a8ca4b8a411fe";

$access_token = $_POST['access_token'];
$access_token_secret = $_POST['access_token_secret'];
 
 
$douban = new DoubanOAuth($douban_consumer_key, $douban_consumer_secret , $access_token , $access_token_secret );
$doubanInfo = $douban -> OAuthRequest('http://api.douban.com/people/%40me', array(), 'GET');
if($doubanInfo == "no auth"){
	echo 'Wrong Auth';
	exit;
}

$doubanInfo = simplexml_load_string($doubanInfo);

//print_r($doubanInfo);

$douban_id = str_replace("http://api.douban.com/people/","",$doubanInfo->id);

$uid = check_user( "douban",$douban_id );

//echo $douban_id;
//echo $uid ;

if(!$uid)
exit;

$user =  new User( $uid );

switch ( $_GET['app'] ){
	case "myinfo":
		$out = json_encode( $arr );
		echo $out;
	break;
	
	case "check":
		$word = $_POST['word'];
		echo $user->check($word);
	break;
	
	case "addword":
		$word = $_POST['word'];
		$is_new = $_POST['is_new'];
		$result = $user->add_word( $word , $is_new );
		//$user->add_wordtodic("kiss");
		echo $result;
	break;

	case "list":
		$max = $_POST['max'];
		$page = $_POST['page'];
		$user->list_newwords( $max,$page );
	break;
		
	

}


exit;
?>