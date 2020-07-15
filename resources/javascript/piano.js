const $ = require( 'jquery' );
const Tone = require('Tone');

$(document).ready(function()
{
  mouseUpDown();
  addInstrument();
  midiController();
  volumeTempoSlider();

});

/*
* show keys letter ---------------------------------------
*/

$(".showKeyboardKeys").change(function(e) {
  if (this.checked) {
    $("body").removeClass("hideKeyboardKeys");

  } else {
    $("body").addClass("hideKeyboardKeys");
  }
});



function volumeTempoSlider()
{

  var volumeTone = document.getElementById("volumeTone");
  var outputVolume = document.getElementById("volumeRange");
  outputVolume.innerHTML = volumeTone.value;
  
  volumeTone.oninput = function() 
  {
    outputVolume.innerHTML = this.value;

  }

  var tempoTone = document.getElementById("tempoTone");
  var outputTempo = document.getElementById("tempoRange");
  outputTempo.innerHTML = tempoTone.value;
  
  tempoTone.oninput = function() 
  {
    outputTempo.innerHTML = this.value;

  }
};



/*
* Piano Mouse up and down---------------------------------------------------------
*/

function mouseUpDown()
{

  $(".white, .black").bind("mousedown touchstart", function()
  {

    $(this).addClass("active");
  
    $(this).bind("mouseup touchend mouseleave", function() {
   
      $(this).removeClass("active").unbind("mouseup touchend mouseleave");
    });
  
  });

};

//--------------------------------------------------------