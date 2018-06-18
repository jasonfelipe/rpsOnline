//Rock Paper Scissors
//With online chat.


//1.need to get player data (are u player 1 or 2?)
//2.need to delete player infomation on refresh(?)
//3.Need to alert player when other player disconnects/leaves
//4.need to empty database when player leaves
//5.Make and test RPS logic


$(document).ready(function () {
    //------------------------------------
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBNtVyMKY8oSJe_wQc0KtbJtajG0sz7-nQ",
        authDomain: "rpsonlinebase.firebaseapp.com",
        databaseURL: "https://rpsonlinebase.firebaseio.com",
        projectId: "rpsonlinebase",
        storageBucket: "",
        messagingSenderId: "314201387785"
    };
    firebase.initializeApp(config);

    //-------------Variables--------------

    var database = firebase.database();
    var playerConnection = database.ref("/playerConnection");
    var chatdata = database.ref("/chatdata");

    //This is a firebase thing, it manages if a user is connected.
    var isConnected = database.ref(".info/connected");

    //User Stuff
    var player1 = database.ref("/players/1"); //stores connection info
    var player2 = database.ref("/players/2");
    var player1Turn = false;
    var player2Turn = false;
    var player1View = false;
    var player2View = false;


    //Choices
    var rock = 0;
    var paper = 1;
    var scissors = 2;
    var player1choice = ("/player1choice"); //stores player choices
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

    $("#playerOneBox").hide();
    $("#playerTwoBox").hide();
    $('#pOneInfo').hide();
    $('#pTWoInfo').hide();
    $('#chatscoreBox').hide();
    $("#maxPlayers").hide();



    //------Connection Status--------

    //Info about this is in the variable section,
    //but let me go over it again:
    //checks if there is a connection value and pushes it to the database
    //when a player disconnects the value is removed
    isConnected.on("value", function (snap) {
        if (snap.val() === true) {
            var playerConnect = playerConnection.push(true);
            console.log("You are connected!")
            playerConnect.onDisconnect().remove();
            player1.onDisconnect().remove();
            player2.onDisconnect().remove();


        }


    });

    //Third player tries to join
    database.ref().once("value", function (snap) {

        if (snap.child("players/2").exists() === true && snap.child("players/1").exists() === true) {
            $("#maxPlayers").show();
            $('#playerOne').hide();
            $('#playerTwo').hide();
            return;
        }

    });


    //Stuff to do:


    //also updates the chatbox saying if a player is connected


    $('#playerOne').on("click", function () {

        database.ref().once("value", function (check) {
            if (check.child("players/1").exists() === true) {
                $('#playerOne').hide();
                $('#instructions').text("Sorry but Player One is taken!");
            }
            else {
                $('#pOneInstructions').text("You are Player One")
                $("#gamebox").show();
                $("#playerOneBox").show();
                $('#chatscoreBox').show();
                $('#playerChoice').text("Choose your hand!");
                $('#chatbox').append("<br>" + "Player One has joined")
                $('#playerOne').hide();
                $('#playerTwo').hide();

                database.ref("players/1").set(
                    "1",
                    console.log("Player 1 is here!")
                );
            }


        });
    });



    $('#playerTwo').on("click", function () {

        database.ref().once("value", function (check) {
            if (check.child("players/2").exists() === true) {
                $('#playerTwo').hide();
                $('#pTwoInstructions').text("Sorry but Player Two is taken!");
            }
            else {
                $('#instructions').text("You are Player Two")
                $("#gamebox").show();
                $("#playerTwoBox").show();
                $('#chatscoreBox').show();
                $('#playerChoice').text("Choose your hand!");
                $('#chatbox').append("<br>" + "Player Two has joined")
                $('#playerOne').hide();
                $('#playerTwo').hide();

                database.ref("players/2").set(
                    "2",
                    console.log("Player 2 is here!")
                );
            }

        });
    });


    database.ref("players").on("value", function (playerExists) {
        //I need code that lets the other player know that someone disconnected.


    });

    //-------The Hands----------

    //Stuff to do:
    //Create Logic which is...
    //Paper Beats Rock, Rock Beats Scissors, Scissors Beats Paper



    $('.hands').on("click", function () {

        $(this).css("filter:opacity(30%)");
        $('#pOneChoice').text("You Chose " + this.alt + "!");
        $('#pOneWaiting').text("Waiting for Opponent...");
        console.log(this.id)

    if(this.id === "playerOneRock" || "playerOneScissors" || "playerOnePaper"){
        player1Picked = this.alt
        console.log("Player One Picked " + this.alt)
    }       

    });



    $('.hands').on("click", function () {

        $(this).css("filter:opacity(30%)");
        $('#pTwoChoice').text("You Chose " + this.alt + "!");
        $('#pTwoWaiting').text("Waiting for Opponent...");
        console.log(this.id)

    if(this.id === "playerTwoRock" || "playerTwoScissors" || "playerTwoPaper"){
        player2Picked = this.alt
        console.log("Player Two Picked " + this.alt)
    }       

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

//Game Logic
    function evaluateChoices() {
   
        if (playerOneChoice === "Rock" && playerTwoChoice === "Rock") {
            tieGame();
            
        }
    
        else if (playerOneChoice === "Rock" && playerTwoChoice === "Paper") {
            playerOneLoss();
            playerTwoWin();
        }
    
        else if (playerOneChoice === "Rock" && playerTwoChoice === "Scissors") {
            playerOneWin();
            playerTwoLoss();
        }
    
        else if (playerOneChoice === "Paper" && playerTwoChoice === "Rock") {
            playerOneWin();
            playerTwoLoss();
        }
    
        else if (playerOneChoice === "Paper" && playerTwoChoice === "Paper") {
            tieGame();
            
        }
    
        else if (playerOneChoice === "Paper" && playerTwoChoice === "Scissors") {
            playerOneLoss();
            playerTwoWin();
        }
    
         else if (playerOneChoice === "Scissors" && playerTwoChoice === "Rock") {
            playerOneLoss();
            playerTwoWin();
        }
    
        else if (playerOneChoice === "Scissors" && playerTwoChoice === "Paper") {
            playerOneWin();
            playerTwoLoss();
        }
    
        else if (playerOneChoice === "Scissors" && playerTwoChoice === "Scissors") {
            tieGame();
        }
    }
    //----------Chat Box----------

    //takes the input and pushes it into the database
    $('#chatInput').click(function (e) {
        e.preventDefault();


        //Makes a variable which chatText is the input the user does.

        var chatText = $('#chatText').val();

        //chatdata is the object which is pushed into our database, remember chatdata is our database.ref();
        var chatlog = chatdata.push({ //chatlog is just the name of the variable we empty down below...
            chatText: chatText
        })

        //when a player disconnects, the chatlog gets emptied. 
        chatlog.onDisconnect().remove();

        //When you submit/enter stuff in chat this empties out the field.
        $('#chatText').val("");

    });


    //Snapshotting the Chatbox
    database.ref().on("value", function (snapshot) {
        $('#chatbox').text(snapshot.val().chatText)

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);

    });

    //Putting the database text into the chatbox.
    chatdata.on("child_added", function (childSnapshot) {
        $('#chatbox').append("<br>" + childSnapshot.val().chatText)

    });






});
