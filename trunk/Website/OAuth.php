<?php

include "init.php";

//ROOT_URL./api.php?app=begin & account=douban

switch ( $_GET['app'] ){
	case "begin":
		$douban = new DoubanOAuth( $douban_consumer_key , $douban_consumer_secret );
		$tok = $douban->getRequestToken();
		$url = $douban->getAuthorizeURL($tok['oauth_token'])."&oauth_callback=";
		
		//$url .= $_SEVERAL[PHP_SELF]."?request_token=".$tok['oauth_token']."&request_token_secret=".$tok['oauth_token_secret'];
		
		$arr = array_merge( $tok , array ( "url" => $url ) );
		$out = json_encode( $arr );
		echo $out;
		break;
	
	case "access":
		$tok = $_GET [ "request_token" ];
		$tok_s=$_GET [ "request_token_secret" ];
		$douban = new DoubanOAuth($douban_consumer_key, $douban_consumer_secret , $tok , $tok_s );
		$access = $douban -> getAccessToken();
		$out = json_encode( $access );
		if( !check_user("douban",$access['douban_user_id']) ){
			add_user( "douban" ,$access['douban_user_id'] );
		}
		echo $out;
		break;
}


exit;