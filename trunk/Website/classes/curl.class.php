<?php
class Curl{
private $ch;

	function __construct( $url ){
		$this->init( $url );
	}
	
	public function post( $url , $post_data ){
		if (is_array( $post_data ) ){
			foreach ( $post_data as $key => $value ){
				$out .= "$key=$value&";
			}
			echo $out;
		}
		
     	$this->setopt(CURLOPT_POST, 1);
       	$this->setopt(CURLOPT_POSTFIELDS, $post_data);
	}
	
	public function exec(){
		return curl_exec($this->ch);
	}

	public function init( $url ){
		$this->ch = curl_init();
		$this->setopt( CURLOPT_URL, $url );
		$this->setopt( CURLOPT_CONNECTTIMEOUT, 30 );
  	 	$this->setopt( CURLOPT_TIMEOUT, 30 );
   	 	$this->setopt( CURLOPT_RETURNTRANSFER, 1 );
	}

	function setopt( $choice,$value ){
		curl_setopt($this->ch,$choice,$value);
	}




}