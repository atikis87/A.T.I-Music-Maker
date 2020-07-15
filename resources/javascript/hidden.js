console.log("From hidden.js");
const $ = require( 'jquery' );

$(document).ready(function()
{
  hideMenu();

});

/*
* Where the instrumental can be selected.
*/ 

function hideMenu()
{
  // local variable for hideMenu
  var modal = document.getElementById("myInstrument");  // for Instruments
  // var percussion = document.getElementById("myPercussion"); // for percussion samples

  // btn for Instrument
  var btn = document.getElementById("instrument-click");
  var span = document.getElementById("CloseInstrument");
  // btn for Percussion
  //var btn2 = document.getElementById("percussion-click");
  //var span2 = document.getElementById("ClosePercussion");


  //---------------------Modal Instrument---------------------------------------------
  
  btn.onclick = function() 
  {
    console.log( "inst btn" );
    modal.style.display = "block";
  }

  span.onclick = function()
  {
    console.log( "inst span" );
    modal.style.display = "none";
  }

  //----------------------Percussion -------------------------------------------------------------
/*
  btn2.onclick = function() 
  {
    console.log( "pre btn" );
    percussion.style.display = "block";
  }

  span2.onclick = function()
  {
    console.log( "pre span" );
    percussion.style.display = "none";
  }



  window.onclick = function(event)
  {
    console.log( "inst window" );
    if ( event.target == modal || event.target == percussion) 
    {
      modal.style.display = "none";
      percussion.style.display = "none";
    }
  }

*/
} // hidemneuInstrument end
