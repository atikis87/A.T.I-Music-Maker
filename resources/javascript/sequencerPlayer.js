const Tone = require( 'Tone' );
const ATI_Const = require( '../javascript/ATI_Constants.js' );


class InstrumentObject
{
    constructor( aInstrument, aNote , aIsActive )
    {
        this.mInstrument = aInstrument;
        this.mNote = aNote;
        this.mIsActive = aIsActive;
    }

    IsActive()
    {
        return this.mIsActive;
    }

    StartInstrument()
    {
        this.mIsActive = true;
        this.mInstrument.triggerAttack( this.mNote );
    }

    StopInstrument()
    {
        this.mIsActive = false;
        this.mInstrument.triggerRelease();
    }
}

class SequencerPlayer
{
    constructor( aSoundMtx )
    {
        this.mSoundMtx = aSoundMtx;
        this.mSoundMap = new Map();

        this.generateSoundMap();
    }

    playColumn( aColumn )
    {
        if ( aColumn >= this.mSoundMtx.length )
        {
            return;
        }

        var column = this.mSoundMtx[ aColumn ];
        this.stopTheOthers( column );
        for ( var i = 0; i < column.length; i++ )
        {
            var note = ATI_Const.RowToNote( column[ i ] );
            
            if ( ! this.mSoundMap.has( note ) )
            {
                continue;
            }

            var instObject = this.mSoundMap.get( note );

            if ( ! instObject.IsActive() )
            {
                instObject.StartInstrument();
            }
        }
    }

    Stop()
    {
        for ( const [ mapNote, mapInstObj ] of this.mSoundMap )
        {
            if ( ! mapInstObj.IsActive() )
            {
                continue;
            }

            mapInstObj.StopInstrument();
        }
    }

    stopTheOthers( column )
    {
        for ( const [ mapNote, mapInstObj ] of this.mSoundMap )
        {
            if ( ! mapInstObj.IsActive() )
            {
                continue;
            }

            var row = ATI_Const.NoteToRow[ mapNote ];

            if ( undefined == column.find( e => e == row ) )
            {
                mapInstObj.StopInstrument();
            }
        }
    }

    generateSoundMap()
    {
        for ( var columnIdx = 0; columnIdx < this.mSoundMtx.length; columnIdx++ )
        {
            var columnArray = this.mSoundMtx[ columnIdx ];
            for ( var i = 0; i < columnArray.length; i++ )
            {
                var note = ATI_Const.RowToNote( columnArray[ i ] )

                if ( this.mSoundMap.has( note ) )
                {
                    continue;
                }

                var instrument = new Tone.FMSynth().toMaster();
                var instObject = new InstrumentObject( instrument, note, false );
                this.mSoundMap.set( note, instObject );
            }
        }
    }
}
module.exports = SequencerPlayer;