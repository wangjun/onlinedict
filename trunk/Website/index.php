<?php
session_start();

//print_r( $_SERVER );
//exit;

include "classes/curl.class.php";

$url_root = "http://kebot.me/dic/";

$oauth_url = $url_root."OAuth.php";

$api_url = $url_root."api.php";

if ( isset ($_SESSION[uid]) ){
	echo $_SESSION[uid];
}

//function begin(){

	$curl =  new Curl($oauth_url."?app=begin");
	$return  = $curl->exec();
	$para = json_decode( $return ,TRUE );
	//print_r( $para );
	
	$_SESSION["oauth_token_secret"] = $para ["oauth_token_secret"];
	$_SESSION["oauth_token"] = $para ["oauth_token"];
	echo $para[url]."http://".$_SERVER[HTTP_HOST].$_SERVER[PHP_SELF];
	
//}
//begin();



switch ( $_GET[app] ){
	case "login":
		break;




}