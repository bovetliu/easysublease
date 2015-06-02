<!--This has been deprecated, will no longer be used-->
  <?php session_start();  if( !isset($_SESSION['status'])) $_SESSION['status'] = 0; ?>
  <p id = "txtHint">basic infomation of the apartment, SQL STATUS: <?php echo $_SESSION['status']; ?></p>
  <form  >
    <div class="input-group "> <span class="input-group-addon" id="basic-addon1">Origin</span>
      <input type="text" class="form-control" placeholder="Origin"  id = "ipt-origin-tr" name = "ipt-origin-tr">
    </div>
    <div class="input-group"> <span class="input-group-addon" id="basic-addon1">Destiny</span>
      <input type="text" class="form-control" placeholder="Destiny"  id ="ipt-destiny-tr" name = "ipt-destiny-tr">
    </div>
    <div class="input-group"> <span class="input-group-addon" id="basic-addon1">Source URL</span>
      <input type="text" class="form-control" placeholder="http:// ( not necessary)"  id = "ipt-url-tr" name = "ipt-url-tr">
    </div>
    <div class="input-group"> <span class="input-group-addon" id="basic-addon1">Departure Date</span>
      <input type="text" class="form-control" placeholder="MM/DD/YYYY"  id = "ipt-date-tr" name = "ipt-date-tr">
    </div>
    <div class="btn-group btn-cusom-contrl ">
      <button id = "btn-caption-cat-tr" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> 
      catagory <span class="caret"></span> </button>
      <ul class="dropdown-menu" role="menu" id = "ul-catagory-tr">
        <li onClick="updatecat_tr(this.id)" id = "li-cat-p-ride">Provide a ride</li>
        <li onClick="updatecat_tr(this.id)" id = "li-cat-n-ride">Need a ride</li>
        <li onClick="updatecat_tr(this.id)" id = "li-cat-sdt">Self-driving travel</li>
      </ul>
    </div>
    <!--floor plan dropdown btn--> 
    
    <!--hidden inputs-->
    <input style=" display:none" id = "num-catagory-tr"    name = "num-catagory-tr">
    </input>
    <input style=" display:none" id = "num-origin-lat-tr"  name = "num-origin-lat-tr">
    </input>
    <input style=" display:none" id = "num-origin-lng-tr"  name = "num-origin-lng-tr">
    </input>
    <input style=" display:none" id = "num-destiny-lat-tr" name = "num-destiny-lat-tr">
    </input>
    <input style=" display:none" id = "num-destiny-lng-tr" name = "num-destiny-lng-tr">
    </input>
    <input style=" display:none" id = "string-jsonfied-tr" name = "string-jsonfied-tr">
    </input>
    <input style=" display:none" id = "encoded-polyline" name = "encoded-polyline">
    </input>
    <!--encoded polyline is going to be decoded into Array:LatLng--> 
    <!--/hidden inputs-->
    <textarea class="form-control " rows="4" placeholder = 
    "Enter additional information here, such as contact, what time you want to go, or some preference" id="memo-tr" name ="memo-tr"></textarea>
    <div>
      <input class="btn btn-success " value="Create" onClick="travel_post()">
      </input>
    </div>
  </form>
