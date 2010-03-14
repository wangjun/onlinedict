<?php

/*
 * This File Provide some Basic Classes about words and User.
 * 
 * 
 */


class word
{
	public $def;
	public $prons;
	public $key;
	public $audio;
	
	function add($key)
	{
		$url="http://dict.cn/ws.php?utf8=true&q=$key";
		$temp_path = '/tmp/temp_codes.xml';
    // Grab the XML and save it to a temporary file. This method replaces the
    // usual call to file() with a curl-based method.
    	$ch = curl_init($url);
    	$fp = fopen($temp_path, "w");
    	curl_setopt($ch, CURLOPT_FILE, $fp);
    	curl_setopt($ch, CURLOPT_HEADER, 0);
    	curl_exec($ch);
    	curl_close($ch);
    	fclose($fp);
    	
    // explain the XML Document.	
    	$doc=new DomDocument(1.0);
		$doc->load($temp_path);
		$defs=$doc->getElementsByTagName("def");
		$audios=$doc->getElementsByTagName("audio");
		$prons=$doc->getElementsByTagName("pron");
		$keys=$doc->getElementsByTagName("key");
		
		$key=$keys->item(0)->nodeValue;
		$def=$defs->item(0)->nodeValue;
		$audio=$audios->item(0)->nodeValue;
		$pron=$prons->item(0)->nodeValue;
		
		
		if($def=="Not Found"){return false;}	

		//”√≤È—ØµΩµƒkey¥˙ÃÊ‘≠¿¥µƒkey
		$this->key=$key;
		if(!$this->isindic($key))
	{
			
		$this->addtodic($key,$audio,$pron,$def);
		
		
		
		//¿˝æ‰
		$sents=$doc->getElementsByTagName("sent");
		
		foreach($sents as $sent){
			$origs=$sent->getElementsByTagName("orig");
			$orig=$origs->item(0)->nodeValue;	
		//echo $orig."<br />";
			$transes=$sent->getElementsByTagName("trans");
			$trans=$transes->item(0)->nodeValue;
		//echo $trans."<br />";
			$this->addsent($key,$orig,$trans);
		}
		
	}
		
		return true;
		
	}
	

	function addtodic($key,$audio,$pron,$def)
	{
		//◊™“Â
		$audio=mysql_real_escape_string($audio);
		$pron=mysql_real_escape_string($pron);
		$def=mysql_real_escape_string($def);
		
		
		$query="INSERT INTO `words`.`dic` (`key`, `audio`, `pron`, `def`) ";
		$query.="VALUES ('$key', '$audio', '$pron', '$def')";
		$result= mysql_query($query) or die("Unable:add $key $audio $pron $def to dic");
	}
	
	
	function addsent($key,$orig,$trans){
		$orig=mysql_real_escape_string($orig);
		$trans=mysql_real_escape_string($trans);
		$query="INSERT INTO `words` . `sent` (`key`,`orig`,`trans`) ";
		$query.="VALUES ('$key','$orig','$trans')";
		$result=mysql_query($query) or die("unable to add sent");
		
	}
	
	
	
	function isindic($key)
	{
		$key=mysql_real_escape_string($key);
		$query="SELECT * FROM  `dic` WHERE  `key` =  '$key'";
		$result=mysql_query($query) or die("unable_to_check$key");
		$num_rows = mysql_num_rows($result);
		if($num_rows==1)
		{return true;}
		else
		{return false;}
	}
	
	
	function lookindic($key)
	{
		$key=mysql_real_escape_string($key);
		$query="SELECT * FROM  `dic` WHERE  `key` =  '$key'";
		$result=mysql_query($query) or die("unable_to_check$key");
		$num_rows = mysql_num_rows($result);
		
		if($num_rows==1)
		{
			$row=mysql_fetch_row($result);
			$this->key=$row[1];
			$this->audio=$row[2];
			$this->pron=$row[3];
			$this->def=$row[4];
			return true;
		}
		else
		{
			return false;
		}
		
		
		
	}

}




?>