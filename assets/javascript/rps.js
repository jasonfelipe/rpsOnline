    //Rock Paper Scissors
//With online chat.

//Chat is user input.
//chat box is a box... but...
//text is appended but the window should be scrollable

//need to delete player infomation on refresh(?)
//need to get player data
//


//------------------------------
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBVpCBZRYe0U7o_W1KQZv12Qq6QXztJ97U",
    authDomain: "rpschat-e5a37.firebaseapp.com",
    databaseURL: "https://rpschat-e5a37.firebaseio.com",
    projectId: "rpschat-e5a37",
    storageBucket: "rpschat-e5a37.appspot.com",
    messagingSenderId: "13079308605"
  };
  firebase.initializeApp(config);

//-------------Variables--------------

var database = firebase.database(); 
var playerConnection = database.ref("/playerConnection");

//This is a firebase thing, it manages if a user is connected.
var isConnected = database.ref(".info/connected");

//User Stuff
var player1 = ("/players/1")
var player2 = ("/players/2")
var player1Turn = false;
var player2Turn = false;
var player1View = false;
var player2View = false;

//Choices
var choices = ["rock", "paper", "scissors"];
var player1choice = ("/player1choice");
var player2choice = ("/player2choice");
var player1Picked = null;
var player2Picked = null;

//Stats
var player1wins = database.ref("/player1wins");
var player1losses = database.ref("/player1losses");
var player2wins = database.ref("/player2wins");
var player2losses = database.ref("/player2losses");

var player1winsCount = 0;
var player1lossesCount = 0;
var player2winsCount = 0;
var player2lossesCount = 0;
var draw = 0;

//Game doesn't start until 2 players show up
$(".hands").hide();


//------Connection Status--------

//Info about this is in the variable section,
//but let me go over it again:
//checks if there is a connection value and pushes it to the database
//when it disconnects the value is changed and the value is removed
isConnected.on("value", function(snap) {
	if(snap.val()) {
		var playerConnect = playerConnection.push(true);
		playerConnect.onDisconnect().remove();
        
	}

    
});

//Third player tries to join
database.ref().once("value", function(snap) {

    if (snap.child("players/2").exists() === true && snap.child("players/1").exists() === true){
        $("#instructions").text("There are too many players! SORRY!")
        return;
    }

});


//Stuff to do:
//User presses a button, they turn into player one or two
//if player 1 is chosen: show PLAYER 1 ALREADY THERE
//if player 2 is chosen: show PLAYER 2 ALREADY THERE

//also updates the chatbox saying if a player is connected


$('#playerOne').on("click",function(){
    console.log("hey this is player one")
    $('#instructions').text("You are Player One")
    $(".hands").show();

    //fix this so it appends to the box when
    $('#chatbox').append("<br>" + "Player One has joined")


});

$('#playerTwo').on("click", function(){
    console.log("hey this is player two")
    $('#instructions').text("You are Player Two")
    $(".hands").show();

    //fix this so it appends to the box
    $('#chatbox').append("<br>" + "Player Two has joined")


});


//-------The Hands----------

//Stuff to do:
//Create Logic which is...
//Paper Beats Rock, Rock Beats Scissors, Scissors Beats Paper
//Once Player choses the other images disappear


//Maybe an if statement checking the alt of the image will do for the logic?

$('.hands').on("click", function(){

    $('.hands').hide();
    $(this).show();
    $('#playerChoice').text("You Chose " + this.alt + "!");
    $('#waiting').text("Waiting for Opponent...");

});

//Just in case we still need this stuff below....

// $("#rock").on("click", function (){
//     console.log("You Chose Rock")
//     $('#paper').hide();
//     $('#scissors').hide();
//     $('#playerChoice').text("You Chose Rock!");
//     $('#waiting').text("Waiting for Opponent...");


// });


// $("#paper").on("click", function (){
//     console.log("You Chose Paper")
//     $('#rock').hide();
//     $('#scissors').hide();
//     $('#playerChoice').text("You Chose Paper!")
//     $('#waiting').text("Waiting for Opponent...")


// });


// $("#scissors").on("click", function (){
//     console.log("You Chose Scissors")
//     $('#rock').hide();
//     $('#paper').hide();
//     $('#playerChoice').text("You Chose Scissors!")
//     $('#waiting').text("Waiting for Opponent...")


// });



//----------Chat Box----------
$('#chatInput').click(function(e){
    e.preventDefault();

    var chatText = $('#chatText').val();

    database.ref().push({
        chatText: chatText
    })


});

//Snapshotting the Chatbox
database.ref().on("value", function (snapshot){
    $('#chatbox').text(snapshot.val().chatText)

}, function (errorObject){
    console.log("Errors handled: " + errorObject.code);

});

database.ref().on("child_added",function(childSnapshot){
    console.log(childSnapshot.val().chatText)
    $('#chatbox').append("<br>"+ childSnapshot.val().chatText)

})

//questions: How to make player1 and player2?