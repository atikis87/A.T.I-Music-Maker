const $ = require( "jquery" );

//const $ = require( 'jquery' );

var IS_MOUSE_DOWN = false;
var MOUSE_ROW = 0;
const LIGHT_SEA_GREEN = "rgb(0, 142, 155)";

class Grid
{
  constructor( aRowNum, aBar, aStepsInBars, aDefaultX, aDefaultY ) 
  {
    this.initialize( aRowNum, aBar, aStepsInBars );
    this.buildTable();
    this.setWidth( aDefaultX );
    this.setHeight( aDefaultY );
    this.initializeSoundMtx();
  }

  initialize( aRowNum, aBar, aStepsInBars )
  {
    this.bars = aBar;
    this.steps = aStepsInBars;
    this.columnCount = this.bars * this.steps;
    this.rows = aRowNum;
    this.cellWidth = 100 / 100;
    this.cellHeight = 100 / this.rows;
    this.table = $( '<table>' );
    this.table.attr( "id", "seqTable" );
    MOUSE_ROW = 0;
  }

  initializeSoundMtx()
  {
    this.soundMtx = new Array( this.columnCount );
    
    for ( var i = 0; i < this.soundMtx.length; i++ )
    {
      this.soundMtx[ i ] = new Array( 0 );
    }
  }

  getXCoordOfTd( aTdIndex )
  {
    if ( 0 == aTdIndex )
    {
      return 0;
    }

    var td = $( "#td_0_" + ( aTdIndex - 1 ) );
    return td.position().left + td.width(); 
  }

  getStepCount()
  {
    return this.columnCount;
  }

  setWidth( aX )
  {
    this.table.css( "width", aX + "%" );
  }

  setHeight( aY )
  {
    this.table.css( "height", aY + "%" );
  }

  buildTable() // this is what builds the table
  {
    const columnNumber = this.bars * this.steps;
    for ( var rowIdx = 0; rowIdx < this.rows; rowIdx++ )
    {
      var tr = $( '<tr>' );
      tr.appendTo( this.table );
      for ( var columnIdx = 0; columnIdx < columnNumber; columnIdx++ )
      {
        var td = this.generateTd( rowIdx, columnIdx );
        td.appendTo( tr );
      }

      tr.appendTo( this.table );
    }
  }

  generateTd( aRow, aColumn )
  {
    var td = $( '<td>' );
    td.attr( "id", "td_" + aRow + "_" + aColumn ); //id = td_2_23
    td.on( "mousedown", { row: aRow, column: aColumn, barSize: this.steps, grid: this }, onMouseDown );
    td.on( "mouseover", { row: aRow, column: aColumn, barSize: this.steps, grid: this }, onMouseOver );
    td.on( "mouseup", { row: aRow, column: aColumn }, onMouseUp );
    var color = getColor( aColumn, this.steps );
    td.css( "border", " 1px solid black" );
    td.css( "background-color", color );
    return td;
  }

  getTable()
  {
    return this.table;
  }

  getTd( aRow, aCol )
  {
    return $( "#td_" + aRow + "_" + aCol );
  }

  updateSoundMtx( aRow, aColumn )
  {
    var column = this.soundMtx[ aColumn ];
    for ( var i = 0; i < column.length; i++ )
    {
      if ( column[ i ] == aRow )
      {
        column.splice( i, 1 );
        return;
      }
    }

    column.push( aRow );
  }

  getSoundMtx()
  {
    return this.soundMtx;
  }

  paintTd( aRow, aColumn )
  {
    this.updateSoundMtx( aRow, aColumn );
    paintCell( aRow, aColumn, this.steps );
  }

  clear() // to delete the sequencer in the mmaker. Grid.clear();
  {
    for ( var columnIdx = 0; columnIdx < this.soundMtx.length; columnIdx++ )
    {
      var column = this.soundMtx[ columnIdx ];
      while ( 0 < column.length )
      {
        var row = column[ 0 ];
        paintCell( row, columnIdx, this.steps );
        column.splice( 0, 1 );
      }
    }
  }
}

function onMouseDown( event )
{
  var row = event.data.row;
  var col = event.data.column;
  var barSize = event.data.barSize;
  var grid = event.data.grid;

  IS_MOUSE_DOWN = true;
  MOUSE_ROW = row;
  grid.updateSoundMtx( row, col );
  paintCell( row, col, barSize );
}

function onMouseOver( event )
{
  var row = event.data.row;
  var col = event.data.column;
  var barSize = event.data.barSize;
  var grid = event.data.grid;


  if ( ! IS_MOUSE_DOWN )
  {
  //  console.log( "mouse is not down" );
    return;
  }

  if ( MOUSE_ROW != event.data.row )
  {
    console.log( "onDownRow/currentRow[ " + MOUSE_ROW + "/" + event.data.row + " ]" );
    return;
  }
  grid.updateSoundMtx( row, col );
  paintCell( row, col, barSize );
}

function onMouseUp()
{
  IS_MOUSE_DOWN = false;
}

function paintCell( aRow, aColumn, aBarSize )
{
  var td = $( "#td_" + aRow + "_" + aColumn );
  if ( LIGHT_SEA_GREEN != td.css( "background-color" ) )
  {
    td.css( "background-color", LIGHT_SEA_GREEN );
    return;
  }

  td.css( "background-color", getColor( aColumn, aBarSize ) );
}

function getColor( aColumn, aBarSize )
{
  if ( ( ( aColumn / aBarSize ) | 0 ) % 2 == 0 )
  {
    return "#2020205e";
  }

  return "#63636359";
}

module.exports = Grid;