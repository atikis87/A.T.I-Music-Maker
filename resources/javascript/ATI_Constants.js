const ROW_NUM = 49;

const NoteToRow = 
{
    "C2"  : ROW_NUM - 1,  //48
    "C#2" : ROW_NUM - 2,  //47
    "D2"  : ROW_NUM - 3,  //46
    "D#2" : ROW_NUM - 4,  //45
    "E2"  : ROW_NUM - 5,  //44
    "F2"  : ROW_NUM - 6,  //43
    "F#2" : ROW_NUM - 7,  //42
    "G2"  : ROW_NUM - 8,  //41
    "G#2" : ROW_NUM - 9,  //40
    "A2"  : ROW_NUM - 10, //39
    "A#2" : ROW_NUM - 11, //38
    "B2"  : ROW_NUM - 12, //37

    "C3"  : ROW_NUM - 13,    //q
    "C#3" : ROW_NUM - 14,   //2
    "D3"  : ROW_NUM - 15,    //w
    "D#3" : ROW_NUM - 16,   //3
    "E3"  : ROW_NUM - 17,    //e
    "F3"  : ROW_NUM - 18,    //r
    "F#3" : ROW_NUM - 19,   //5
    "G3"  : ROW_NUM - 20,    //t
    "G#3" : ROW_NUM - 21,   //6
    "A3"  : ROW_NUM - 22,    //z
    "A#3" : ROW_NUM - 23,   //7
    "B3"  : ROW_NUM - 24,    //u

    "C4"  : ROW_NUM - 25,    //i
    "C#4" : ROW_NUM - 26,   //9
    "D4"  : ROW_NUM - 27,    //o
    "D#4" : ROW_NUM - 28,  //ö
    "E4"  : ROW_NUM - 29,    //p
    "F4"  : ROW_NUM - 30,    //ü

    "F#4"  : ROW_NUM - 31,
    "G4"  : ROW_NUM - 32,
    "G#4"  : ROW_NUM - 33,
    "A4"  : ROW_NUM - 34,
    "A#4"  : ROW_NUM - 35,
    "B4"  : ROW_NUM - 36,
    "C5"  : ROW_NUM - 37,
    "C#5"  : ROW_NUM - 38,
    "D5"  : ROW_NUM - 39,
    "D#5"  : ROW_NUM - 40,
    "E5"  : ROW_NUM - 41,
    "F5"  : ROW_NUM - 42,
    "F#5"  : ROW_NUM - 43,
    "G5"  : ROW_NUM - 44,
    "G#5"  : ROW_NUM - 45,
    "A5"  : ROW_NUM - 46,
    "A#5"  : ROW_NUM - 47,
    "B5"  : ROW_NUM - 48,
    "C6"  : ROW_NUM - 49,
}

function RowToNote( aValue )
{
    return Object.keys( NoteToRow ).find( key => NoteToRow[ key ] === aValue );
}

const KeyToNote = 
{
    89 : "C2",    //y
    83 : "C#2",   //s
    88 : "D2",    //x
    68 : "D#2",   //d
    67 : "E2",    //c
    86 : "F2",    //v
    71 : "F#2",   //g
    66 : "G2",    //b
    72 : "G#2",   //h
    78 : "A2",    //n
    74 : "A#2",   //j
    77 : "B2",    //m

    81 : "C3",    //q
    50 : "C#3",   //2
    87 : "D3",    //w
    51 : "D#3",   //3
    69 : "E3",    //e
    82 : "F3",    //r
    53 : "F#3",   //5
    84 : "G3",    //t
    54 : "G#3",   //6
    90 : "A3",    //z
    55 : "A#3",   //7
    85 : "B3",    //u

    73 : "C4",    //i
    57 : "C#4",   //9
    79 : "D4",    //o
    192: "D#4",  //ö
    80 : "E4",    //p
    191: "F4",    //ü
}

exports.NoteToRow = NoteToRow;
exports.RowToNote = RowToNote;
exports.KeyToNote = KeyToNote;