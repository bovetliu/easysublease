<?php session_start();  if( !isset($_SESSION['status'])) $_SESSION['status'] = 0; ?>
   <img id="travel-search-results-rtn-btn" src="images/rtn.png" alt="rtn" height="50px" width="50px"  onClick="infodiv_manager1.render_travel_form();">
    <p id = "txtHint">travel_search_results, SQL STATUS: <?php echo $_SESSION['status']; ?></p>
    <div  id="travel_search_results_container" >
      <div class="travel_data_entry_div" onclick="mapcc1.panToCenterOf_encodedPath( this.getElementsByTagName( &quot;div&quot;)[5].innerHTML)">
        <div class="TDE_origin"><span class = "TDE_bold">Origin:</span>5330-5468 Texas 47, Bryan, TX 77807, USA</div>
        <div class="TDE_destiny"><span class = "TDE_bold">Destiny:</span>8501-8527 Texas 47, College Station, TX 77845, USA</div>
        <div class="TDE_cat"><span class = "TDE_bold">Category:</span>need a ride</div>
        <div><span class = "TDE_bold">Departure Date:</span>2015-05-12</div>
        <div class="TDE_memo"><span class = "TDE_bold">Memo:</span>test0621</div>
        <div class="TDE_encoded_polyline">g|xyDvhmkQzEqGz@gAdBaB`EgD~BaCl@y@~@{AfAqB`CuDbJ}L|@uApAyBpCsFlBwEd@mA`DwJ|@_CjDyK`CcH`AsCnBqEfAqCpCgJlD_Of@wBdAyELq@</div>
      </div>
      <br>
      <div class="travel_data_entry_div" onclick="mapcc1.panToCenterOf_encodedPath( this.getElementsByTagName( &quot;div&quot;)[5].innerHTML)">
        <div class="TDE_origin">13620 Texas 30, College Station, TX 77845, USA</div>
        <div class="TDE_destiny">14866-15494 Texas 30, College Station, TX 77845, USA</div>
        <div class="TDE_cat">need a ride</div>
        <div>2015-05-16</div>
        <div class="TDE_memo">123123123123</div>
        <div class="TDE_encoded_polyline">{m}yDpqfjQRu@lA_DpA{BjMkPdCqCtF{ElKeJPGxF{EfImH`CaCbCgD`Uy_@</div>
      </div>
      <br>
    </div><!--end of travel_search_results_container--> 
