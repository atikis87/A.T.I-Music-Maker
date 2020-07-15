const $ = require("jquery");
const Tone = require('Tone');
const {ipcRenderer} = require( 'electron' );


const Grid = require( "../javascript/sequencer.js" );
const ATI_Const = require( "../javascript/ATI_Constants.js" );
const SequencerPlayer = require( "../javascript/sequencerPlayer.js" );

const ROW_NUM = 49;
const BAR_NUM = 32;
const STEP_NUM = 4;
const DEFAULT_X = 100;
const DEFAULT_Y = 100;
var BPM_VALUE = 90;
var USER = null;
var GRID = null; // created globally and used in the setup GRID
var SQ_PLAYER = null;
var PROGRESS_BAR = null;
var POGRESS_VALUE = 0; // Progress value wherever is it.
var IS_RECORD_ACTIVATED = false;

$(document).ready(function(){
    rightMenu();
    logOutUser();
    close_window();
    getUser();
    getSaveList();
    create();
    setupEvents();
    //mouseUpDown();
    setupGrid();
    addInstrument();
    volumeTempoSlider();

    var e = { target: document.getElementById( "tempoRange" ) };
    onBpmChange( e );
});

function setupGrid() // setting for table
{
    GRID = new Grid( ROW_NUM, BAR_NUM, STEP_NUM, DEFAULT_X, DEFAULT_Y ); // as many parameters as there are in the constructor
    var table = GRID.getTable();

    table.prependTo( $( "#gridContainer" ) ); //the first in the container

    $( "#zoomValueX" ).html( DEFAULT_X );
    $( "#zoomValueY" ).html( DEFAULT_Y );
}

function setupEvents() // for Events
{
  $( "#zoom-x" ).on( "input", onWidthChanged ); 
  $( "#zoom-y" ).on( "input", onHeightChanged );
  $( "#recButton" ).on( "click", onRecordClicked );
  $( "#stopButton" ).on( "click", onStopBtnClicked );
  $( "#playButton" ).on( "click", onPlayBtnClicked );
  $( "#tempoRange" ).on( "input", onBpmChange );
  $( "#saveBtn" ).on( "click", onSaveBtnClicked );
  $( "#loadBtn" ).on( "click", onLoadBtnClicked );
  $( "#undoButton, #clearWindow" ).on( "click", onUndoBtnClicked );
}

function onUndoBtnClicked()
{
  if ( confirm( "Are you sure you want to clear the whole sequencer?" ) )
  {
    GRID.clear();
  }
}

// A method of storing in the database -----------------------------------------
function soundDataMtxToString( aSoundData )
{
  var result = "";
  for ( var columnIdx = 0; columnIdx < aSoundData.length; columnIdx++ )
  {
    const column = aSoundData[ columnIdx ];
    if ( 0 == column.length )
    {
      continue;
    }
    const firstActiveRow = column[ 0 ];
    result += columnIdx + ":" + firstActiveRow;

    for ( var rowIdx = 1; rowIdx < column.length; rowIdx++ )
    {
      const activeRowIdx = column[ rowIdx ];
      result += "," + activeRowIdx;
    }
    result += ";";
  }
  return result; //btoa( result );
}


function onSaveBtnClicked()
{
  var saveName = $( "#savePro" ).val();
  var saveData = soundDataMtxToString( GRID.getSoundMtx() );

  ipcRenderer.send( 'Save', saveName, saveData );
  console.log( "GetUser Request was sent" );
  ipcRenderer.on( 'onSave', ( sender, aWasSaveSuccessful ) =>
  {
    if ( aWasSaveSuccessful )
    {  
      console.log( "Save was successful" );
      return;
    }
      console.log( "Save was failed" );
  });
}

// Backup loading -------------------------------------------------------------------------
function onLoadBtnClicked()
{
  GRID.clear();
  var loadNameSelect = document.getElementById( "loadNameSelect" );
  var saveName = loadNameSelect.options[ loadNameSelect.selectedIndex ].value;

  ipcRenderer.send( "loadSave", saveName );
  ipcRenderer.on( 'onLoadSave', ( sender, aWasLoadSuccessful, aSaveData ) =>
  {
    if ( !aWasLoadSuccessful )
    {
      console.log( "loading was failed" );
      return;
    }
    processSaveData( aSaveData );
  });
}


function processSaveData( aSaveData )
{
  var column = aSaveData.split( ';' ); //The last element is undefined because the last character ';' is.

  for ( var i = 0; i < column.length - 1; i++ ) // dont iterate through the last element
  {
    var columnData = column[ i ].split( ':' );
    const columnIdx = parseInt( columnData[ 0 ] );

    const rowIndexes = columnData[ 1 ].split( ',' );
    for ( var j = 0; j < rowIndexes.length; j++ )
    {
      const rowIdx = parseInt( rowIndexes[ j ] );
      GRID.paintTd( rowIdx, columnIdx );
    }
  }
}

function onStopBtnClicked() // for to the pedometer.
{
  POGRESS_VALUE = 0;
  $( "#current-time" ).html( POGRESS_VALUE );
  var newValue = GRID.getXCoordOfTd( POGRESS_VALUE );
  setProgressBar( newValue );
  clearInterval( PROGRESS_BAR );
  PROGRESS_BAR = null;
  if ( null != SQ_PLAYER )
  {
    SQ_PLAYER.Stop();
    SQ_PLAYER = null;
  }
}
//If you click on the REC button, the recording will start. -----------------------------------
function onRecordClicked()
{
  IS_RECORD_ACTIVATED = true;
  startStopProgressBar();
  console.log( "record was initiated" );
}

function onPlayBtnClicked()
{
  startStopProgressBar();
  console.log( "play was initiated" );
}

// If you click on the PLAY button, the playing will start. -----------------------------------
function startStopProgressBar()
{
  if ( null != PROGRESS_BAR )
  {
      clearInterval( PROGRESS_BAR );
      IS_RECORD_ACTIVATED = false;
      PROGRESS_BAR = null;
      SQ_PLAYER.Stop();
      SQ_PLAYER = null;
      console.log( "progress bar was stopped" );
      return;
  }

  if ( POGRESS_VALUE > GRID.getStepCount() )
  {
      return;
  }

  SQ_PLAYER = new SequencerPlayer( GRID.getSoundMtx() );
  PROGRESS_BAR = setInterval( progressBarRunning, 40000 / BPM_VALUE );
}



function onBpmChange( event )
{
  BPM_VALUE = event.target.value; // When I put the slider, the value changes
  document.getElementById( "displayTempoValue" ).innerHTML = BPM_VALUE;

  if ( null != PROGRESS_BAR )
  {
    clearInterval( PROGRESS_BAR );
    PROGRESS_BAR = setInterval( progressBarRunning, 40000 / BPM_VALUE );
  }
}

function onHeightChanged( event )
{
    GRID.setHeight( event.target.value );
    var progressBar = $( "#progressBar" );
    progressBar.css( "height", event.target.value  + "%"  );
    $( "#zoomValueY" ).html( event.target.value );
}


function onWidthChanged( event )
{
    GRID.setWidth( event.target.value );
    $( "#zoomValueX" ).html( event.target.value );

    var newValue = GRID.getXCoordOfTd( POGRESS_VALUE );
    setProgressBar( newValue /*STEP_SIZE * POGRESS_VALUE*/ );

    /*if ( timer )
    {
      clearTimeout( timer );
      timer = null;
    }

    timer = setTimeout( tempSetProgressbar, 3000 );*/
}


function progressBarRunning()
{
    if ( POGRESS_VALUE >= GRID.getStepCount() ) // When we have reached the end of the table, STOP !!
    {
        clearInterval( PROGRESS_BAR );
        PROGRESS_BAR = null;
        SQ_PLAYER.Stop(); // When we have reached the end of the table, TONE STOP !!
        SQ_PLAYER = null;
        IS_RECORD_ACTIVATED = false;
        return;
    }

    SQ_PLAYER.playColumn( POGRESS_VALUE );

    $( "#current-time" ).html( ++POGRESS_VALUE );

    var newValue = GRID.getXCoordOfTd( POGRESS_VALUE );
    setProgressBar( newValue );
}

function setProgressBar( aValue )
{
    var progressBar = $( "#progressBar" );
    progressBar.css( "transform", "translateX(" + ( aValue + "px" ) + ")" );
}

/*
* TRANSFORM for hamburgermenu-----------------------------------------------------
*/

function rightMenu()
{
    const menuIcon = document.querySelector( ".menu" );
    const navbar = document.querySelector( ".navbar" );

    menuIcon.addEventListener("click", ()=>
    {
        navbar.classList.toggle("change");
    });
};


// hamburger menü exit function

function close_window() 
{
$( "#exitWindow" ).on('click', function()
    {
        if (confirm("Are you sure you want to close the A.T.I Music Maker??")) 
        {
        close();
        }
    })
};


// Logged profile function

function logOutUser()
{
    $( "#logout_makerUser" ).on('click', function()
    {
        if (confirm("Are you sure you want to log out?")) 
        {
            document.location.href = 'index.html';
        }
    })
};


function getUser()
{
    ipcRenderer.send( 'GetUser' );
    console.log( "GetUser Request was sent" );
    ipcRenderer.on( 'OnGetUser', ( sender, userData ) =>
    {
        USER = new Object( userData );
        $( "#header-user" ).html( USER.UserName );
    });
}

function getSaveList()
{
  ipcRenderer.send( 'GetSaveList' );
  console.log( "getSaveList request was sent" );
  ipcRenderer.on( 'OnGetSaveList', ( sender, aWasSuccessful, aSaveNameList ) =>
  {
    if ( ! aWasSuccessful )
    {
      console.log( "getSaveList request was failed" );
      return;
    }

    if ( null == aSaveNameList )
    {
      console.log( "aSaveNameList is null" );
      return;
    }
    console.log( "getSaveList request was success" );
    var loadNameSelect = document.getElementById( "loadNameSelect" );
    for ( var i = 0; i < aSaveNameList.length; i++ )
    {
      var saveNameObject = aSaveNameList[ i ];
      var el = document.createElement("option");
      el.textContent = saveNameObject.saveName;
      el.value = saveNameObject.saveName;
      loadNameSelect.appendChild(el);
    }
  });
}

function create()
{
  wavesurfer = document.getElementById("wavesurfer_element");
  keyboard = document.getElementById("keyboard_element");
  keyboard_wrapper = document.getElementById( "keyboard_wrapper_element" );
}




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
};


//----------------------------------------------------------------------------------------------------


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






function addInstrument()
{

  $('#piano-instrument').on('click', function()
  {
    piano();
    $(".tips").html("Piano!");
  });

  $('#synth-instrument').on('click', function()
  {
    FMSynth();
    $(".tips").html("FMSynthesizer!");
    $("#myInstrument").hide();
    
  });

  $('#violin-instrument').on('click', function()
  {
    midiController();
  });
};


function FMSynth()
{

  const synth = new Tone.FMSynth().toMaster();
  var pressKey = (note) => 
  {
    if ( 0 < POGRESS_VALUE && IS_RECORD_ACTIVATED )
    {
      GRID.paintTd( ATI_Const.NoteToRow[ note ], POGRESS_VALUE - 1 );
    }

    triggerKeySound(note);
  }

  var triggerKeySound = (note) => 
  {
    //synth.triggerAttack( note + "C4" );
    synth.triggerAttackRelease(note + "C4", "8n");
  }

  // Bind the piano keys to a click event
  let key_list = document.querySelectorAll(".key");

  for(let x = 0; x < key_list.length; x++) 
  {
    key_list[x].onmousedown = (e) => 
    {
      let note = e.target.getAttribute('data-sound');
    
      if ( note ) {
        pressKey(note);
      }
    };  
  }

  // Listen for Keypresses
  document.addEventListener("keydown", e => 
  {
    let key = ATI_Const.KeyToNote[ e.keyCode ];
    if ( key === undefined ) return;

    console.log( "Key recognised" );


    if ( document.querySelector(`.key[data-sound="${key}"]`) ) {
      document.querySelector(`.key[data-sound="${key}"]`).dispatchEvent(new Event('mousedown'));
    }
  });

};