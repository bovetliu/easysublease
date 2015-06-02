<!DOCTYPE html>
<html lang="en">
  <head><?php session_start();  if( !isset($_SESSION['status'])) $_SESSION['status'] = 0; ?>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>EasySublease.org</title>
    
    <!-- Bootstrap -->
    <link  type="text/css" href="css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom styles for this template -->
    <link href="css/custom_css1.css" rel="stylesheet"  type="text/css">
    
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link rel="stylesheet" href="css/jquery-ui.css">
    <link rel="stylesheet" href="css/jquery-ui.structure.css">
    <link rel="stylesheet" href="css/jquery-ui.theme.css">
    
		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDEgp09_feK-aKfo_2h3tOcWfzbrByZwDw&libraries=geometry"></script>
    <script type="text/javascript"> var map_cs; var test_number; </script>  <!--two important global variables-->
		<script src="js/MMoverlay.js" type="text/javascript" ></script>
    <script src="js/Infodiv_manager.js" type="text/javascript" ></script>
    <script src="js/mapinteraction.js"  type="text/javascript">   </script>
  </head>
  <body><div id = "main_div">
      <div id = "title-big-div">
      	<div id = "title-label-div" >EasySublease</div>    
        <div id = "title-housing" class = "title-options1">Housing</div>
        <div id = "juju" class = "title-options1">Meetup  <img src="images/work_in_progress.png" width="44" height="20" alt="some_text">  </div>
        <div id = "travel-control-div" class = "title-options1">Ride</div>
        <div id = "about-div" class = "title-options1" >About</div>  
      </div>   <!-- end of #title-big-div-->
      <div class = "search-div">
      	<div class = "search-div-padding"></div>
        <div id = "rental-search-slot">
          <ul>
            <li>price-range per bed
              <ul  id = "ul_price_pbed_srch">
                <li id = "301-350">301-350/bedroom</li>
                <li id = "351-400">351-400/bedroom</li>
                <li id = "401-450">401-450/bedroom</li>
                <li id = "451-500">451-500/bedroom</li>
                <li id = "501-550">501-550/bedroom</li>
                <li id = "551-600">551-600/bedroom</li>
                <li id = "551-600">
                  <input type="text" name="price-min-ipt" placeholder = "price-min">
                  <input type="text" name="price-max-ipt" placeholder = "price-max">
                </li>
                <li>reset 取消价格限制</li>
              </ul>
            </li>
            <li>
              Bedrooms/Baths
              <ul id = "ul_bb_srch">
                <li>1/1</li>
                <li>2/1</li>
                <li>2/1.5</li>
                <li>2/2</li>
                <li>3/1</li>
                <li>3/2</li>
                <li>3/3</li>
                <li>
                  <input type="text" name="beds-min-ipt" id="beds-min-ipt"  placeholder = "beds-min">
                  <input type="text" name="beds-max-ipt" id="beds-max-ipt" placeholder = "beds-max">
                  <input type="text" name="baths-min-ipt" id="baths-min-ipt" placeholder = "baths-min">
                  <input type="text" name="baths-max-ipt" id="baths-max-ipt" placeholder = "baths-max">
                </li>
                <li>reset取消户型限制</li>
              </ul>
            </li>
            <li>Category
            <ul id = "ul_types_srch">
                <li  id="seeking-to-lease">seeking to lease</li>
                <li  id = "seeking-to-rent">seeking to rent</li>
                <li id ="for-2-activity">for activity</li>
                <li>reset 取消类型限制</li>
              </ul>
            </li>
          </ul>
        </div><!--rental-search-slot ends-->
        <div id = "travel-search-slot" >
          <div id ="travel-search-div">
            <div class="travel-search-inputgrp-contrl">
              <select id="slct-cat-tr-srch"  name = "slct-cat-tr-srch" class="form-control"  >
                <option value = "1">Those requiring ride</option>
                <option value = "0" >Those providing ride</option>
                <option value = "2">Self-driving travel</option>
              </select>
            </div>
            <div class="travel-search-inputgrp-contrl  ">
              <input type="text" class="form-control" placeholder="Origin"   id = "ipt-origin-tr-srch" name = "ipt-origin-tr-srch">
            </div>
            <div class = "travel-search-inputgrp-contrl">
              <input type="text" class="form-control" placeholder="Destiny"  id = "ipt-destiny-tr-srch" name = "ipt-destiny-tr-srch">
            </div>
            <div class = "travel-search-inputgrp-contrl">
              <button id="btn-submit-tr-srch"  class="travel-search-btn" type="submit" >Search</button>
            </div>
            <div class="travel-search-advanced_routing">
              <label>
                <input id = "checkbox-adv-routing" name ="checkbox-adv-routing" type="checkbox" value="yes" unchecked> Use advanced routing 
              </label>
            </div>
            <div class = "travel-search-hidden-inputgrp-contrl" >
            	<input type="text" id = "ipt-ori-lat" name = "ipt-ori-lat" value = "">
            	<input type="text" id = "ipt-ori-lng" name = "ipt-ori-lng" value = "">
              <input type="text" id = "ipt-des-lat" name = "ipt-des-lat" value = "">
              <input type="text" id = "ipt-des-lng" name = "ipt-des-lng" value = "">
            </div>
          </div> <!--travel-search-div-->
        </div><!--travel-search-slot-->
        <div id = "sql-bash">SQL bash later displayed for debugging</div>
      </div> <!--<div class = "search-div">-->
      <div id = "travel-control-panel">
					plan route using Google service
      </div>
      
      <div id = "map-div" >  </div> <!--this is where map is put in-->
      
      <div id = "info-div" class="input-group-dimension-control">
      	<p id = "txtHint">basic infomation of the apartment, SQL STATUS: <?php echo $_SESSION['status']; ?> </p>
        <form action="form_process.php" method="post" >
        <div class="input-group" id = "haha">
          <span class="input-group-addon" id="basic-addon1">Latitude</span>
          <input type="text" class="form-control" placeholder="right clk on map, then choose"   id = "ipt-lat" name = "ipt-lat">
        </div>
        
        <div class="input-group">
          <span class="input-group-addon" id="basic-addon1">Longitude</span>
          <input type="text" class="form-control" placeholder="right clk on map, then choose"   id = "ipt-lng" name = "ipt-lng">
        </div>
        
        <div class="input-group ">
          <span class="input-group-addon" id="basic-addon1">Community</span>
          <input type="text" class="form-control" placeholder="Like: Cedar ridge, filling suggested "  id = "ipt-commu" name = "ipt-commu">
        </div>
        
        <div class="input-group">
          <span class="input-group-addon" id="basic-addon1">Address</span>
          <input type="text" class="form-control" placeholder="Street, City, Apt, not necessary"  id ="ipt-addr" name = "ipt-addr">
        </div>
        
        <div class="input-group ">
          <span class="input-group-addon" id="basic-addon1">Source URL</span>
          <input type="text" class="form-control" placeholder="http:// (necessary)"  id = "ipt-url" name = "ipt-url">
        </div>
             <div class="input-group ">
          <span class="input-group-addon" id="basic-addon1">total rent per month</span>
          <input type="text" class="form-control" placeholder="$ "  id = "ipt-price-t" name = "ipt-price-t">
        </div>
        <div class="btn-group  btn-cusom-contrl">
          <button id ="btn-captioin-bb" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            floor plan <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" role="menu" id = "ul-floorplan">
            <li onClick=updatebb(this.id); id = "li-b10b10"><a >1b/1b</a></li>
            <li onClick=updatebb(this.id); id = "li-b20b10"><a  >2b/1b</a></li>
            <li onClick=updatebb(this.id); id = "li-b20b15"><a  >2b/1.5b</a></li>
            <li onClick=updatebb(this.id); id = "li-b20b20"><a  >2b/2b</a></li>
            <li onClick=updatebb(this.id); id = "li-b30b20"><a >3b/2b</a></li>
            <li onClick=updatebb(this.id); id = "li-b30b30"><a  >3b/3b</a></li>
            <li class="divider"></li>
            <div id = "n-bdrm" >Bdrm number:<br>
              <input type="text" name="firstname">
            </div>
            <div id = "n-btrm">Bathrm number:<br>
              <input type="text" name="lastname">
            </div>
          </ul>
        </div>  <!--floor plan dropdown btn--> 

   
        
        <div class="btn-group btn-cusom-contrl ">
          <button id = "btn-caption-cat" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            catagory <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" role="menu" id = "ul-catagory">
            <li onClick=" rclk_menu_overlay.updatecat(this.id)" id = "li-cat-rent"><a href="#" >Want to rent</a></li>
            <li onClick=" rclk_menu_overlay.updatecat(this.id)" id = "li-cat-lease"><a href="#" >Want to lease</a></li>
            <li onClick=" rclk_menu_overlay.updatecat(this.id)" id = "li-cat-activity"><a href="#" >Launch activity</a></li>
          </ul>
        </div>  <!--floor plan dropdown btn-->         
        <input style=" display:none" id = "num-beds" name = "num-beds"> </input>
        <input style=" display:none" id = "num-baths" name = "num-baths"> </input>
        <input style=" display:none" id = "num-catagory" name = "num-catagory"> </input>
				<textarea class="form-control " rows="4" placeholder = "Enter additional memo here" name ="memo"></textarea>
        <div>   
       	
        <input type="submit" class="btn btn-success " value="Create"></input>
        </div>
        
        </form>

      </div> <!--#info div-->
      
    </div><?php $_SESSION['status'] = 0;  ?>
    <script src="js/jquery.min.js"></script>
		<script src="js/jquery-ui.js"></script>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) --> 
    <script src="js/bootstrap.js"></script> 
    <script src="js/page_interaction.js">   </script>   <!--mainly control form-->
  </body>
</html>
