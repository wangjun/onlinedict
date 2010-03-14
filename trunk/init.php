<?php
require_once ( "config.php" );
require_once ( "./classes/mysql.class.php" );
require_once ( "./classes/user.class.php" );
require_once ( "./functions/functions.php" );

$db = new mysql ( $db_host, $db_user, $db_pwd, $db_database, $conn, $coding );

//$db->show_tables("words");

require_once ( "./OAuth/doubanOAuth.php" );
require_once ("./OAuth/OAuth.php");