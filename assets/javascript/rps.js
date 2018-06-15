    //Rock Paper Scissors
//With online chat.

//Chat is user input.
//chat box is a box... but...
//text is appended but the window should be scrollable



//------------------------------
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAQwZRVd6njWTRe6y7c_jIoG3_O_OW8P3Q",
    authDomain: "bootcampactivities.firebaseapp.com",
    databaseURL: "https://bootcampactivities.firebaseio.com",
    projectId: "bootcampactivities",
    storageBucket: "bootcampactivities.appspot.com",
    messagingSenderId: "159132451740"
  };
  firebase.initializeApp(config);

//-------------Variables--------------

var database = firebase.database(); 

//User Input
var player1Choice;
var player2Choice;

//Choices
var scissors
var rock
var paper

//Stats
var wins = 0;
var losses = 0;
var draw = 0;



//Clickables
$("#rock").on("click", function (){
    console.log("You Chose Rock")

});


$("#paper").on("click", function (){
    console.log("You Chose Paper")

});


$("#scissors").on("click", function (){
    console.log("You Chose Scissors")

});


$('#chatInput').click(function(e){
    e.preventDefault();

    var chatText = $('#chatText').val();

    $('#chatbox').append("<br>" + "Player 1 Says: " + chatText);

});

//Snapshotting the Chatbox
database.ref().on("value", function (snapshot){
    $('#chatbox').text(snapshot.val().chatText)

}, function (errorObject){
    console.log("Errors handled: " + errorObject.code);

});