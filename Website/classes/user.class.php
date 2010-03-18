<?php
/*
 * Basic Class for online-dict web api.
 * Creater:/Keboe.me/
 */

class User
{
	private $uid;
	
	/*
	 * 构造函数......
	 */
	
	public function __construct( $uid ){
		if( !$uid )
		exit;
		
		$this -> uid = $uid;
		
	}
	
/*
 * Get Word ID by Word...
 */

	function get_wordid( $word ){
		global $db;
		$db -> select( "`dic`" , "`wid`" , "`key` = '$word'" );
		if($db->db_num_rows() != 1)
		return false;
		
		if ( $row = $db -> fetch_array() ){
				$id = $row['wid'] ;
				return $id;
			} else {
			return false;
		}
		
	}
	
	function idtoword( $wid ){
		global $db;
		$db -> select( "`dic`" , "`key`" , "`wid`='$wid'" );
		if($db->db_num_rows() != 1)
			return false;
		
		if ( $row = $db -> fetch_array() ){
				$key = $row['key'] ;
				return $key;
			} else {
			return false;
		}
		
	}
	
	/*
	 * @param: string $word [string $value]
	 * @return array 
	 */
	public function get_record( $word , $column="*" ){
		global $db;
		
		$wid = $this->get_wordid( $word );
		if(!$wid){
			return false;
		}
		
		$db->select('record', $column, "`wid`='$wid' AND `uid`='$this->uid'");
		
		$result = $db->fetch_assoc();
		if( $db->db_num_rows()==1 ){
			return $result;
		} else {
			return false;
		}
	}
	
	/*
	 * Add a word to Record.
	 * 
	 * 
	 */
	public function add_word( $word,$is_new ){
		global $db;
		
		if ( empty($word) )
		return false;
		
		
		
		$wid = $this -> get_wordid( $word );
		if ( ! $wid ){
			$this -> add_wordtodic( $word );
			$wid = $this -> get_wordid( $word );
		}
		
		if( !$wid )
		return false;
		
		if( ! $is_new ){
			$value = 0;
		} else {
			$value = 1;
		}
		
		if( $this->get_record( $word ) ){
			$result = $this->edit_word( $word , $is_new );
			return $result;
		} else {
			$db->insert("record" , "`uid`,`wid`,`add_date`,`last_date`,`is_new`" , "'$this->uid','$wid',now(),now(),'$value'");
			//echo $db->get_sql();
		}
	}
/*
 * Edit_Word
 */
	public function edit_word( $word ,$is_new ){
		global $db;
		
		$wid = $this -> get_wordid( $word );
		
		if( !$wid )
		return false;
		
		//echo "edit_word";
		
		$db->update("`record`","`last_date`=now(),`is_new`='$is_new'", "`wid`='$wid' AND `uid`='$this->uid' ");
		
		
	}
/*
 * $max the max number of the words.
 * $order Order Words By Add_times / Freq / Last_time...
 * //Or from the same Document
 * 
 */	
	
	public function list_newwords( $max = 10, $page=1 , $order = 'add_date' , $sort = 'ASC' ){
		global $db;
		
		if( !( $sort=='DESC' || $sort=='ASC') ){
			$sort = "ASC";
		}
		
		if ( !is_numeric( $max ) ){
			$max = 10;
		}
		
		if ( !is_numeric( $page ) ){
			$page = 1;
		}
		
		$num = $max*($page-1);
		
		$order = "ORDER BY `$order` $sort";
		$limit = "LIMIT $num, $max";
		
		$db->select ( "`record`", "`wid`" , "`uid`='$this->uid' AND `is_new`='1' $order $limit" );
		//$out = array();
		if( $result = $db->fetch_array() )
			$out[] = $this->idtoword ( $result['wid'] );
	$json_out = json_encode ( $out );
	echo $json_out;
	
	}
	/*
	 * 
	 * 
	 */
	
	public function check( $word ){
		if( !$word ){
		echo "No Word";
		exit;
		}
		$result = $this->get_record( $word,"`is_new`,`add_date`,`last_date`" );
		$result['word'] = $word;
		return json_encode( $result );
		
	}

/*
 * Add a word to `dic`
 */
		
	function add_wordtodic( $word ){	
		global $db;
		
		if(empty ($word))
		return false;
		
		$key = strtolower( $word );
		
		if( !$this->get_wordid($word) ){
			$db->insert( '`dic`' ,'`key`' , "'$key'" );
		} else {
			return false;
		}
	}
	
	




}
