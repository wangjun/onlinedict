<?php
include "./init.php";

$user =  new User( 1 );

//$out = $user -> idtoword( 1 );
$user->list_newwords();

//echo json_encode ( $out );