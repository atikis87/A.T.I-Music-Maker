var $ = require( 'jquery' );
var fs = require( 'fs' );
const {ipcRenderer} = require( 'electron' );
var User = null;

console.log("from reglog.js");


$(document).ready(function()
{
    addButtonEvents();
    User = null;
});

// Save Profil
function addButtonEvents()
{
    $( '#LoginBtn' ).on( 'click', Login );
    $("#LoginPassword").keypress(function(event) 
    { 
        if (event.keyCode === 13) 
        { 
           Login();
        } 
    }); 

    $( '#RegisterBtn' ).on( 'click', Register);
}


function Login()
{
    ipcRenderer.send('Login', $("#LoginUser").val(), $("#LoginPassword").val());
    ipcRenderer.on('answerlogin', ( sender, antwort ) =>
    {
        if ( antwort == false ) 
        {
            alert( "Username not available or wrong password" );
            return;
        }

        console.log("user is aktiv in index.html");
        document.location.href = 'mmaker.html';
    });

}


function Register()
{

    var email = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/i);
    if ($("#RegUser").val() == '' || $("#RegEmail").val() == '' || $("#RegPassword").val() == '') 
    {
        alert("Please fill out all fields!");
    
    } else if (!($("#RegEmail").val()).match(email)) 
    {
        console.log("Please enter a valid email!");
    }

    ipcRenderer.send('Register', $("#RegUser").val(), $("#RegPassword").val(), $("#RegEmail").val());
    ipcRenderer.on('Registeranswer', ( sender, aIsSuccessfull ) =>
    {
        if ( aIsSuccessfull )
        {
            console.log("register was succesfull");
            console.log('successful in the DB');
            alert("You have successfully registered, now you can LogIn!");
        }
        else
        {
            console.log("registeration was failed");
        }
    });
}