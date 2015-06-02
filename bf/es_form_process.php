<?php // sqltest.php
	session_start();
  require_once 'ZK14a7vX.php';
  $conn = new mysqli($hn, $un, $pw, $db);
	//$conn->character_set_name();
	$conn->set_charset('utf8');
  if ($conn->connect_error) die($conn->connect_error);
  if (isset($_POST['sourcechk'])) {
		//echo $_POST['source'];
		$source = get_post($conn,'source');	
		$query = "SELECT source FROM detail_tb WHERE source = '$source' ";
		$result = $conn->query($query);
		//echo $query;
		if (!$result) echo "SELECT failed: $query<br>" . $conn->error . "<br><br>";
		$rows = $result->num_rows;
		if ($rows >= 1) {echo ("system already have this record.");}
		else {
			if ($source){
				echo "please go ahead, system does not have this record";
			} else {
				echo "please enter your source";
			}
		}
		return;
	}
	if (isset($_GET['tbeid'])  && !isset( $_GET['wannaget'])) {  // pai chi zhe ge xuanxiang //process deletion
		$_SESSION["status"]=0;
		$tbeid = get_get($conn, 'tbeid');
		$query = "UPDATE status_tb SET isexpired = '1' WHERE id='$tbeid';";
		$result = $conn->query($query);
		$_SESSION['sql-bash'] = $query;
		if (!$result) {
			echo "-1#UPDATE status_tb failed: $query<br>" . $conn->error . "<br><br>";
			$_SESSION["status"] = 2;
			return;
		}
		else {
			echo $tbeid."#"."set expired";	
			$_SESSION["status"] = 1;
			return;
		}
	}
	
	if (isset( $_GET['wannaget'] ) )    //process query
  {
		$_SESSION["status"]=0;
    $price_min = get_get($conn, 'price_low');
		$price_max = get_get($conn, 'price_high');
		$beds_min = get_get($conn, 'num_bed_low');
		$beds_max = get_get($conn, 'num_bed_high');
		$baths_min = get_get($conn, 'num_bath_low');
		$baths_max = get_get($conn, 'num_bath_high');
		$cat = get_get($conn, 'category');
		//category=0&swlng=-96.365&nelng=-96.269&swlat=30.615&nelat=30.633&wannaget=5
		$lblng = get_get($conn, 'lblng') ;
		$hblng = get_get($conn, 'hblng') ;
		$lblat = get_get($conn, 'lblat') ;
		$hblat = get_get($conn, 'hblat') ;

		$wannaget = get_get($conn, 'wannaget');
		
		if ( !$lblng || !$hblng || !$lblat || !$hblat   ){
			$query  = "SELECT latlng_tb.id, lat,lng, cat, source, memo FROM latlng_tb, detail_tb INNER JOIN status_tb ON detail_tb.id = status_tb.id 
			WHERE latlng_tb.id = detail_tb.id AND isexpired = 0 AND ";
		}
		else {
			$query  = "SELECT latlng_tb.id, lat,lng, cat, source, memo FROM latlng_tb, detail_tb INNER JOIN status_tb ON detail_tb.id = status_tb.id 
			WHERE latlng_tb.id = detail_tb.id AND isexpired = 0 AND (lng BETWEEN '$lblng' AND '$hblng')  AND (lat BETWEEN '$lblat' AND '$hblat') AND ";
		}
		if ($price_min && $price_max) {$query = $query."(price_sr BETWEEN '$price_min' AND '$price_max') AND " ; }

		if ($beds_min && $beds_max) {$query = $query."(beds BETWEEN '$beds_min' AND '$beds_max') AND " ; }

		if ($baths_min && $baths_max) {$query = $query."(baths BETWEEN '$baths_min' AND '$baths_max') AND " ; }
		if ($cat !== false){
			$query = $query."cat = '$cat' AND " ; 
			//$query = substr($query,0,strlen($query) -4  );

			//$query = $query." AND ";
		}
		$query = substr($query,0,strlen($query) -4  );  // deleted the suffix " AND"
		//echo $query; //for debug purpose
		/*
		if ( $query == $_SESSION["sql-bash"] ) {
			echo 	$_SESSION["tbr_json_str"]."#did not really run";  // this yield BUG!
			return;
		}
		*/
		//echo "will execute new query";
    $result = $conn->query($query);
		$_SESSION['sql-bash'] = $query;
    if (!$result) {
			echo "SELECT failed: $query<br>" .
      $conn->error . "<br><br>";
		}
		$rows = $result->num_rows; 
		$tbr_json_str = "[";
		for ($j = 0 ; $j < $rows ; ++$j)
		{
			$result->data_seek($j);
			$row = $result->fetch_array(MYSQLI_NUM);   //data fow here
			//echo "cnm";
			//$tbr_json_str = $tbr_json_str ."\"".(string)$row[0] ."\":[". (string)$row[1].", ".(string)$row[2].", ".(string)$row[3]. ", \"".(string)$row[4]."\"],";
			$tbr_json_str = $tbr_json_str.turn_row_into_jsonpart ($row);
			
			//print_r($row);echo "<br>";
		}
		if ($tbr_json_str !== "[") {
		$tbr_json_str = substr($tbr_json_str,0, strlen($tbr_json_str)-1)."]";
		}
		else { $tbr_json_str = "[]";}
		$tbr_json_str = $tbr_json_str ."#{\"sql-bash\" : \"'$query'\" }";
		echo $tbr_json_str."#did run";   // !!!!!KEY PART HERE!!!!!
		$_SESSION["tbr_json_str"] =  $tbr_json_str;
		$_SESSION['status']=3;
		return;
  }    //  if (isset( $_GET['wannaget'] ) ) 
	
	

  if (isset($_POST['ipt-lat'])   &&                      //process insertion
      isset($_POST['ipt-lng'])    &&
      isset($_POST['num-catagory']))
  {
		$_SESSION['status'] = 0;
    $lat   = get_post($conn, 'ipt-lat') + 0;
    $lng    = get_post($conn, 'ipt-lng') + 0;
    $category = get_post($conn, 'num-catagory') +0;
		
		
		if (isset ($_POST['ipt-commu']) ) 
		{ 
		$commu = get_post($conn, 'ipt-commu');}
		else $commu = 0;
		if (isset ($_POST['ipt-addr']) ) {
			$addr = get_post($conn, 'ipt-addr');}
		else $addr = '';
		if (isset ($_POST['ipt-url']) ) {
			$url = get_post($conn, 'ipt-url');}
		else $url = '';
		if (isset ($_POST['num-beds']) ) { 
			  $numbeds = get_post($conn, 'num-beds') *10 ;}
		else $numbeds = 4398;
		if (isset ($_POST['num-baths']) ) {
			$numbaths = get_post($conn, 'num-baths') * 10 ;}
		else $numbaths = 4398;
		if (isset ($_POST['memo']) ) {
			$memo = get_post($conn,'memo');}
		else $memo = '';
		if (isset ($_POST['ipt-price-t']) ) {
			$price_t = get_post($conn,'ipt-price-t');}
		else $price_t = '';
		
		if ($numbeds != 4398  && $numbeds!= 0) { $price_sr = $price_t / ($numbeds/10);  }
		else {$price_sr = 567;}
		
		
		$is_expired = 0;
		$date = date("Y-m-d H:i:s");
		if (($lat != 0) && ($lng != 0) ) {
			$query    = "INSERT INTO latlng_tb VALUES" ."(NULL,'$lat', '$lng')";
			$result   = $conn->query($query);
			if (!$result) {
				echo "INSERT failed: $query<br>" .
				$conn->error . "<br><br>";
				$_SESSION["status"] = 2;
				header("Location: index2.php");
				return;
			}
			
			$insertID = $conn->insert_id;
		
		}
		if ($insertID) {
			$query = "INSERT INTO detail_tb VALUES('$commu','$url','$memo','$numbeds','$numbaths','$addr','$insertID','$price_t','$price_sr')";
			$result = $conn->query($query);	
			if (!$result) {
				echo "INSERT INTO detail_tb failed: $query<br>" .
				$conn->error . "<br><br>";
				$query = "DELETE from latlng_tb where id = '$insertID' ";
				$result   = $conn->query($query);
				if (!$result) {  echo "INSERT failed: $query<br>" .$conn->error . "<br><br>";  }
				$_SESSION["status"] = 2;
				header("Location: index2.php");
				return;
			}
			$query = "INSERT INTO status_tb VALUES('$insertID','$is_expired','$date','$category')";
			$result = $conn->query($query);	
			if (!$result){ echo "INSERT failed: $query<br>" .
				$conn->error . "<br><br>";
				$_SESSION["status"] =2;
				header("Location: index2.php");
				return;
			}
			
		}	
		$_SESSION["status"] =1;
		$_SESSION['lat'] = $lat;
		$_SESSION['lng'] = $lng;
		$_SESSION['source'] = $url;
		$_SESSION['category'] = $category;
		header("Location: index2.php");
		return;
  }
	
	if ( isset($result) && isset($conn)) {
		$result->close();
		$conn->close();
	}
  function get_post($conn, $var)
  {
    return $conn->real_escape_string($_POST[$var]);
  }
	function get_get($conn, $var)
  {
		if (isset($_GET[$var])){
    	return $conn->real_escape_string($_GET[$var]);
		} else return false;
  }
	
	function turn_row_into_jsonpart ( $row) {
		$tbr_str = "";
		//$tbr_str= $tbr_str ."\"".(string)$row[0] ."\":[";
		//for ($i = 1; $i < count($row); $i ++){
		//	$tbr_str = $tbr_str . "\"".(string)$row[$i]."\",";
		//}
		$tbr_str = json_encode($row).",";
		//$tbr_str = substr($tbr_str,0, strlen($tbr_str)-1);
		//$tbr_str = $tbr_str."],";
		//$tbr_str = "s";
		return $tbr_str;
	} 
	
?>