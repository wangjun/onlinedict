<?php


function add_user($way,$login){
	global $db;
	if( check_user( $way,$login ) ){
		return false;
	}
	$result = $db->insert( "user", "`way`,`login`", "'$way','$login'" );
	return $result;

}
	/*
	 * If user exists Return UID
	 * Else Reruen Flase
	 */
	
function check_user( $way , $login ){
		global $db;
		$db -> select( "`user`", "`uid`" , "`way`='$way' AND `login` = '$login'" ) ;
		
		//echo $db->get_sql();
		
		//print_r( $db->fetch_array() );
		
		if ($db -> db_num_rows() == 1 ){
			$row = $db -> fetch_array() ;
			return $row[uid];
		} else {
			return false;
		}
}