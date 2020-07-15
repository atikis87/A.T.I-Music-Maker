const {app, BrowserWindow, ipcMain,} = require( 'electron' );
const sqlite = require('sqlite3');

var LoggedUser = null;
var win; //Variable created for the window

var starteApplikation = () => // Function for the screen
{
    win = new BrowserWindow( //Care must be taken to specify a new window
    {
        minWidth:800,
        minHeight:600,
        width:1920, // the width of the screen
        height:1080, // the height of the screen
        x:0,
        y:0,
        webPreferences:
        {
            nodeIntegration: true // Now I can use index.html
        },
        resizable: true,
        frame: true, // for the electron menu muss be true
        //icon:__dirname+'img/amm.ico'
    });
    win.loadFile( 'index.html' );
    // what should be loaded on the page
     datenbankMachen();
}
app.on('ready', starteApplikation);
// Exit when all windows are closed.
app.on('window-all-closed', () => 
{
    if (process.platform !== 'darwin') 
    {
        app.quit()
    }
});

app.on('activate', () => 
{
    win.show();
});

// for login
ipcMain.on('Login', (sender, name, pass) =>{
    dbabfrage(name, pass, function( aIsSuccesfull )
            {
                console.log('Saving data', aIsSuccesfull )
                win.send('answerlogin', aIsSuccesfull)
            });
});
// for sequencer save
ipcMain.on( 'Save', ( sender, saveName, saveData ) =>{
    saveToDB( saveName, saveData, function( aWasSuccessfull )
    {
        console.log('before sending', aWasSuccessfull )
        win.send('onSave', aWasSuccessfull )
    });
});

// user register
ipcMain.on( 'Register', (sender, name, pass, email) =>
{
    userAnlegen(name, pass, email, function( aWasSuccesfull )
    {
        win.send('Registeranswer', aWasSuccesfull )
    });
});

ipcMain.on( 'GetUser', ( sender ) => {
    console.log( "GetUser Request arrived" );
    win.send( 'OnGetUser', LoggedUser );
    console.log( "User was sent back" );
    console.log( LoggedUser.UserName );
    console.log( LoggedUser.Password );
} );

ipcMain.on( 'GetSaveList', ( sender ) =>
{
    loadSaveNames( function( aWasSuccessful, aSaveNameList )
    {
        win.send( 'OnGetSaveList', aWasSuccessful, aSaveNameList );
    } );
} );

ipcMain.on( 'loadSave', function( aSender, aSaveName )
{
    const getSaveNameSql = 'SELECT saveData FROM save WHERE userid = ? AND saveName = ?';
    const db = new sqlite.Database( 'data/musicmakers.db' );

    db.get( getSaveNameSql, LoggedUser.UserId, aSaveName, ( aErr, aSaveDataObject ) =>
    {
        if ( aErr )
        {
            console.log( err.message );
            win.send( 'onLoadSave', false, "" );
            return;
        }

        win.send( 'onLoadSave', true, aSaveDataObject.saveData );
    } );
} );

ipcMain.on( 'ClearUser', ( sender ) => {
    LoggedUser = null;
} );

//--------------------------------------------------------------------

function saveToDB( saveName, saveData, callback )
{
    if ( null == LoggedUser || undefined == LoggedUser.UserId )
    {
        console.error( "No user is logged to save anything." )
        return;
    }
    const getSaveNameSql = 'SELECT * FROM save WHERE userid = ? AND saveName like ?'; 
    const insertSql = 'INSERT INTO save ( userid, saveName, saveData ) VALUES ( ?, ?, ? )';
    const updateSql = 'UPDATE save SET saveData = ? WHERE userid = ? AND saveName = ?';
    const db = new sqlite.Database('data/musicmakers.db');

    var isSaveExist = false;
    db.get( getSaveNameSql, LoggedUser.UserId, saveName, ( err, result ) =>
    {
        if ( err )
        {
            console.log( err.message );
            callback( false );
            return;
        }
        if ( undefined == result || undefined == result.saveName )
        {
            console.log( "isSaveExist = false" );
            db.run( insertSql, LoggedUser.UserId, saveName, saveData,  (err) => 
            {
                if (err)
                {
                    console.error( err.message );
                    callback( false );
                    return;
                }
        
                callback( true );
            });
            return;
        }
        console.log( "isSaveExist = true" );
        db.run( updateSql, saveData, LoggedUser.UserId, saveName, ( err ) => 
        {
            if ( err )
            {
                console.log( err.message );
                callback( false );
                return;
            }
            callback( true );
        });
    });
    {
        return;
    }
}

function loadSaveNames( aCallback )
{
    const getSaveNameListSql = 'SELECT saveName FROM save WHERE userid = ?';
    
    const db = new sqlite.Database('data/musicmakers.db');
    callb = aCallback;
    var arr = new Array( 0 );
    db.all( getSaveNameListSql, LoggedUser.UserId, function( aErr, aSaveNamesList )
    {
        if ( aErr )
        {
            console.log( aErr.message );
            aCallback( false, null );
            return;
        }
        aCallback( true, aSaveNamesList );
    } );
}

// for login
function dbabfrage(name, pass, callback) 
{
    const sql =  'SELECT * FROM users WHERE username= "'+name+'"';
    const db = new sqlite.Database('data/musicmakers.db');
    db.get( sql, ( err, result ) => 
    {
        if ( err )
        {
            console.log( err.message );
            return;
        }

        if ( undefined == result )
        {
            console.log( "Result is undefined" );
            callback( false );
            return;
        }

        if ( result.password != pass )
        {
            callback( false );
            return;
        }
        LoggedUser =
        {
            UserId: result.userid,
            UserName: result.username,
            Password: result.password
        };
        console.log( LoggedUser.UserName );
        console.log( LoggedUser.Password );

        callback( true );
    })
}

function datenbankMachen() 
{
    const sql =  'SELECT name FROM sqlite_master WHERE type="table" AND name="users"';
    //const sqlite = require('sqlite3');
    const db = new sqlite.Database('data/musicmakers.db', (err) =>
    {
        if (err) 
        {
            console.error(err.message);
        }
        else 
        {
            console.log('Connected to the DB');
            db.get(sql, (err, result) =>
            {
                if (err)
                {
                    console.error(err.message);
                }else 
                {
                    if( !result) 
                    {
                    console.log('still have to create');
                    tabellenAnlegen(db);
                    console.log('is now created')
                    } 
                    else 
                    {
                    console.log('already exists');
                    console.log('all done');  
                    }   
                }      
            });
        }    
    });
}    

function tabellenAnlegen(db)
{
    const createUsers_sql = 'CREATE TABLE IF NOT EXISTS users (userid INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, useremail TEXT)';
    //const sqlite = require('sqlite3');
    console.log('I try');
    db.run( createUsers_sql ), (err) => 
    {
        if (err)
        {
            console.error(err.message);
        } else 
        { 
            console.log('Tables were created!')
        }
    }     
    const createSaves_sql = 'CREATE TABLE IF NOT EXISTS save ( saveId INTEGER PRIMARY KEY AUTOINCREMENT,'
                                                            + 'userid INTEGER,'
                                                            + 'saveName TEXT,'
                                                            + 'saveData TEXT,'
                                                            + 'FOREIGN KEY( userid ) REFERENCES users( userid ) )';
    db.run( createSaves_sql ), (err) => 
    {
        if (err)
        {
            console.log(err.message);
        } else 
        { 
            console.log( 'Tables were created!' );
        }
    }    
};      
// register --------
function userAnlegen(name, pass, email, callback) 
{
    const sql = 'INSERT INTO users (username, password, useremail) VALUES (?, ?, ?)'
    const db = new sqlite.Database('data/musicmakers.db');
    db.run(sql, name, pass, email,  (err) => 
    {
        if (err)
        {
            console.error(err.message);
            callback( false );
            return;
        }
        callback( true );
    })
};
