<?php // sqltest.php
	session_start();
  require_once 'ZK14a7vX.php';
  $conn = new mysqli($hn, $un, $pw, $db);
	//$conn->character_set_name();
	$conn->set_charset('utf8');
  if ($conn->connect_error) die($conn->connect_error);
	
	if (isset($_GET['tbeid_tr'])  && !isset( $_GET['wannaget_tr'])) {  // pai chi zhe ge xuanxiang 
		$_SESSION["status"]=0;
		$tbeid_tr = get_get($conn, 'tbeid_tr');
		$query = "UPDATE status_tr_tb SET isexpired = '1' WHERE id='$tbeid_tr';";
		$result = $conn->query($query);
		$_SESSION['sql-bash'] = $query;
		if (!$result) {
			echo "-1#UPDATE status_tr_tb failed: $query<br>" . $conn->error . "<br><br>";
			$_SESSION["status"] = 2;
			return;
		}
		else {
			echo $tbeid_tr."#"."set expired";	
			$_SESSION["status"] = 1;
			return;
		}
	}
	
	if (isset( $_GET['wannaget_tr'] ) )   
  {
		// {"focus_id":-1,"tbeid_tr":-1,"cat_tr": -1, "ori_lat":-1, "ori_lng":-1, "des_lat":-1, "des_lng":-1, "wannaget_tr":0 };
		// is -1 will not be passed in
		$_SESSION["status"]=0;
		$cat_tr = get_get($conn,'cat_tr');
		$focus_id = get_get($conn, 'focus_id');
		$ori_lat_lng = array( NULL, NULL);$des_lat_lng = array(NULL,NULL);
		if (isset ($_GET['ori_lat'])  && isset ($_GET['ori_lng'])  ) {
			$ori_lat_lng[0] = get_get($conn, 'ori_lat') + 0;
			$ori_lat_lng[1] = get_get($conn, 'ori_lng') + 0;
		} else $ori_lat_lng = NULL;
		if (isset ($_GET['des_lat'])  && isset ($_GET['des_lng'])  ) {
			$des_lat_lng[0] = get_get($conn, 'des_lat') + 0;
			$des_lat_lng[1] = get_get($conn, 'des_lng') + 0;
		} else $des_lat_lng = NULL;
		$des_ori_restr =  gen_retriction_part ($ori_lat_lng,$des_lat_lng);
		
		$wannaget_tr = get_get($conn, 'wannaget_tr');
	
		$query  = "SELECT detail_tr_tb.id, cat, origin, destiny, source, memo, encoded_polyline,depart_date, origin_lat, origin_lng,destiny_lat,destiny_lng  FROM detail_tr_tb, status_tr_tb WHERE detail_tr_tb.id = status_tr_tb.id AND isexpired = 0 ";
		if ($cat_tr !== false) {$query = $query."AND status_tr_tb.cat = '$cat_tr'" ; }
		if ($focus_id !== false) {  $query = $query."AND detail_tr_tb.id = '$focus_id'";}
		$query = $query.$des_ori_restr."ORDER BY depart_date ASC";

		//echo "will execute new query";
    $result = $conn->query($query);
		//echo $query;
    if (!$result) {
			echo "SELECT failed: $query<br>" .
      $conn->error . "<br><br>";
		}
		$rows = $result->num_rows; 
		$tbr_json_str = "{"; // initialization of "$tbr_json_str"
		$id_assoc_latlngs = array();
		$id_assoc_row = array();
		for ($j = 0 ; $j < $rows ; ++$j)  // prepare two data array, one is latlngs hashed by id, one is $row hashed by id, sort previous one get sequence of id, then
		                                  // according to this id sequence, get $row from $id_assoc_row, put into json strin 
		{
			$result->data_seek($j);
			$row = $result->fetch_assoc();   //data fow here
			$id_assoc_latlngs[($row['id']+0)] = array($row['origin_lat']+0,$row['origin_lng'] +0,$row['destiny_lat'] + 0,$row['destiny_lng'] + 0 ) ;
			$id_assoc_row[($row['id']+0)] = $row;
		}
		$id_assoc_latlngs = sort_id_assoc_latlngs ($id_assoc_latlngs, $ori_lat_lng,$des_lat_lng );
		foreach ($id_assoc_latlngs   as $id => $distance) {
			$tbr_json_str = $tbr_json_str.turn_row_into_jsonpart ( $id_assoc_row[$id] );  // might use string buffer
		}
		
		//echo var_dump($id_assoc_latlngs );
		if ($tbr_json_str !== "{") {
		$tbr_json_str = substr($tbr_json_str,0, strlen($tbr_json_str)-1)."}";   // delete the appending ","
		}
		else { $tbr_json_str = "{}";}
		
		$trimmed_query = date("h:i:sa");

		$tbr_json_str = $tbr_json_str ."#{\"sql-bash\" : \"'$trimmed_query'\" }";
		echo $tbr_json_str."#did run";   // !!!!!KEY PART HERE!!!!!

		$_SESSION['status']=3;
		return;
  }    //  if (isset( $_GET['wannaget_tr'] ) ) 
	
	

  if (isset($_POST['ipt-origin-tr'])   &&                      //process INSERTION
      isset($_POST['ipt-destiny-tr'])    &&
      isset($_POST['num-catagory-tr'])  &&
			isset($_POST['encoded-polyline']))
  {
		$_SESSION['status'] = 0;
    $origin = get_post($conn, 'ipt-origin-tr') ."";
    $destiny  = get_post($conn, 'ipt-destiny-tr') ."";
		$json_latlngs = "";
		$encoded_polyline = get_post($conn,'encoded-polyline')."";
		$depart_date = change_into_std_date_format(get_post($conn, 'ipt-date-tr')."");
		$category = get_post($conn, 'num-catagory-tr')+0;
		$originlat = get_post($conn, 'num-origin-lat-tr') + 0;
		$originlng = get_post($conn, 'num-origin-lng-tr') + 0;
		$destinylat = get_post($conn, 'num-destiny-lat-tr') + 0;
		$destinylng = get_post($conn, 'num-destiny-lng-tr') + 0;
		

		if (isset ($_POST['ipt-url-tr']) ) {
			$url = get_post($conn, 'ipt-url-tr');}
		else $url = '';
		
		if (isset ($_POST['memo-tr']) ) {
			$memo = get_post($conn,'memo-tr');}
		else $memo = '';
			
		$is_expired = 0;
		$date = date("Y-m-d H:i:s");
		if (( $origin != "") && ($destiny != "") && ($encoded_polyline !="") ) {
			$query    = "INSERT INTO detail_tr_tb VALUES" ."(NULL,'$origin', '$destiny','$url','$memo','$json_latlngs','$originlat', '$originlng', '$destinylat', '$destinylng','$encoded_polyline')";
			$result   = $conn->query($query);
			if (!$result) {
				echo "INSERT failed: $query<br>" .
				$conn->error . "<br><br>";
				$_SESSION["status"] = 2;
				header("Location: index.php");
				return;
			}
			$insertID = $conn->insert_id;
			//echo $insertID;
		}
		if ($insertID) {
			$query = "INSERT INTO status_tr_tb VALUES('$insertID','$category','$is_expired','$date','$depart_date')";
			$result = $conn->query($query);	
			if (!$result){ echo "INSERT failed: $query<br>" .
				$conn->error . "<br><br>";
				$_SESSION["status"] =2;
				//header("Location: index.php");
				return;
			}
			
		}	
		$_SESSION["status"] =1;
		$_SESSION['origin'] = $origin;
		$_SESSION['destiny'] = $destiny;
		$_SESSION['source_tr'] = $url;
		$_SESSION['category_tr'] = $category;
		//header("Location: index.php");
		echo "insertion succeeded";
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
	function change_into_std_date_format ($incoming_date) {
		$outgoingdate = explode("/", $incoming_date);
		return $outgoingdate[2]."-".$outgoingdate[0]."-".$outgoingdate[1];	
	}
	
	function turn_row_into_jsonpart ( $row) {
		$tbr_str = "\"".$row['id']."\":";
		//$tbr_str= $tbr_str ."\"".(string)$row[0] ."\":[";
		//for ($i = 1; $i < count($row); $i ++){
		//	$tbr_str = $tbr_str . "\"".(string)$row[$i]."\",";
		//}
		$tbr_str = $tbr_str. json_encode($row).",";
		//$tbr_str = substr($tbr_str,0, strlen($tbr_str)-1);
		//$tbr_str = $tbr_str."],";
		//$tbr_str = "s";
		return $tbr_str;
	} 
	function get_offset($ptA_lat, $ptA_lng, $ptB_lat, $ptB_lng , $denominator ) {
		if ( $ptA_lat == NULL ||  $ptA_lng == NULL || $ptB_lat == NULL || $ptB_lng == NULL )
		return 0;
		else $distance = sqrt(($ptA_lat - $ptB_lat) * ($ptA_lat - $ptB_lat) +($ptA_lng - $ptB_lng) * ($ptA_lng - $ptB_lng)) ;
		
		if (!$denominator) { $denominator = $distance * 0.5 + 5.272865 ;}
		return $distance /  $denominator ; 
	}
	function gen_retriction_part ( $ori_lat_lng,$des_lat_lng) {
		//$ori_lat_lng,$des_lat_lng  can respectively be [lat:double, lng:double]  or NULL
		$offset_lat = 0.05;
		$offset_lng = 0.05;
		if ($ori_lat_lng  && $des_lat_lng ) {
			$offset_lat = $offset_lng = get_offset($ori_lat_lng[0],$ori_lat_lng[1],$des_lat_lng[0],$des_lat_lng[1], NULL );	
		}
		$tbr_query_part = "";
		if ($ori_lat_lng) {
			$ori_lat_lb = $ori_lat_lng[0] - $offset_lat; 
			$ori_lat_hb = $ori_lat_lng[0] + $offset_lat;
		
			$ori_lng_lb = $ori_lat_lng[1] - $offset_lng; 
			$ori_lng_hb = $ori_lat_lng[1] + $offset_lng;
		}
		if ($des_lat_lng) {
			$des_lat_lb = $des_lat_lng[0] - $offset_lat; 
			$des_lat_hb = $des_lat_lng[0] + $offset_lat;
		
			$des_lng_lb = $des_lat_lng[1] - $offset_lng; 
			$des_lng_hb = $des_lat_lng[1] + $offset_lng;
		}
		
		if ($ori_lat_lng) {
			$tbr_query_part = $tbr_query_part."AND (origin_lat BETWEEN '$ori_lat_lb' AND '$ori_lat_hb') ";	
			$tbr_query_part = $tbr_query_part."AND (origin_lng BETWEEN '$ori_lng_lb' AND '$ori_lng_hb')";
		}
		if ($des_lat_lng) {
			$tbr_query_part = $tbr_query_part."AND (destiny_lat BETWEEN '$des_lat_lb' AND '$des_lat_hb')";	
			$tbr_query_part = $tbr_query_part."AND (destiny_lng BETWEEN '$des_lng_lb' AND '$des_lng_hb')";
		}
		return $tbr_query_part;
	}
	//$ori_lat_lng = array( NULL, NULL);$des_lat_lng = array(NULL,NULL);
	function sort_id_assoc_latlngs ($id_assoc_latlngs, $ori_lat_lng,$des_lat_lng ){
		//$id_assoc_latlngs 
		/*
		array (size=2)
  10026 => 
    array (size=4)
      0 => float 30.65082
      1 => float -96.31795
      2 => float 30.66431
      3 => float -96.32822
  10034 => 
    array (size=4)
      0 => float 30.61564
      1 => float -96.34862
      2 => float 30.28012
      3 => float -97.73685
		*/
		foreach($id_assoc_latlngs as $id => $four) {
			$id_assoc_latlngs[$id] = get_sum_distance($four, $ori_lat_lng,$des_lat_lng  );
		}
		asort($id_assoc_latlngs);
		return $id_assoc_latlngs;
	};
	function get_sum_distance( $ori_des_four, $ori_lat_lng,$des_lat_lng  ) {
		$sum = get_offset($ori_des_four[0],$ori_des_four[1],$ori_lat_lng[0],$ori_lat_lng[1] ,1) + get_offset($ori_des_four[2],$ori_des_four[3],$des_lat_lng[0],$des_lat_lng[1] ,1)  ;
		return $sum;	
	}
	
?>