console.log("from loadSave.js");
const $ = require( 'jquery' );
$(document).ready(function(){
    saveWindow();
    loadWindow();
});


function saveWindow()
{
    const modalSave = document.querySelector('.saveModal');
    const modalBtn = document.querySelector('#saveProject');
    const closeBtn = document.querySelector('.closeSaveWindow');

    // Events
    modalBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', outsideClick);

    // Open
    function openModal() 
    {
        modalSave.style.display = 'block';
    }

    // Close
    function closeModal() 
    {
        modalSave.style.display = 'none';
    }

    // Close If Outside Click
    function outsideClick(e) 
    {
        if (e.target == modalSave) 
        {
            modalSave.style.display = 'none';
        }
    }
}


function loadWindow()
{

    const modalSave = document.querySelector('.loadModal');
    const modalBtn = document.querySelector('#loadProject');
    const closeBtn = document.querySelector('.closeLoadWindow');

    // Events
    modalBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', outsideClick);

    // Open
    function openModal() 
    {
        modalSave.style.display = 'block';
    }

    // Close
    function closeModal() 
    {
        modalSave.style.display = 'none';
    }

    // Close If Outside Click
    function outsideClick(e) 
    {
        if (e.target == modalSave) 
        {
            modalSave.style.display = 'none';
        }
    }
}