//Rock Paper Scissors
//With online chat.


//2.need to delete player infomation on refresh(?)
//3.Need to alert player when other player disconnects/leaves
//4.need to empty database when player leaves
//5.Make and test RPS logic


$(document).ready(function () {
    //-----------------------------------------------------------------------

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
    //-----------------------------------------------------------------------

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
    var player1choice = database.ref("/player1choice"); //stores player choices
    var player2choice = database.ref("/player2choice");
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

    //Stuff to do.
    //Game doesn't start until 2 players show up

    $("#playerOneBox").hide();
    $("#playerTwoBox").hide();
    $('#pInfo').hide();
    $('#chatscoreBox').hide();
    $("#maxPlayers").hide();

    //-----------------------------------------------------------------------


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
            player1choice.onDisconnect().remove();
            player2choice.onDisconnect().remove();


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
                $('#pInstructions').text("Sorry but Player One is taken!");
            }
            else {
                $('#pInstructions').text("You are Player One")
                $("#playerOneBox").show();
                $('#chatscoreBox').show();
                $('#pInfo').show();
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
                $('#pInstructions').text("Sorry but Player Two is taken!");
            }
            else {
                $('#pInstructions').text("You are Player Two")
                $("#playerTwoBox").show();
                $('#pInfo').show();
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
    //-----------------------------------------------------------------------


    //--------The Hands----------

    //Stuff to do:
    //Needa a fix so that the choice is understood based on the IDs of the pictures. 


    // $('.hands').on("click", function () {
    //     if (this.id === "playerOneRock" || "playerOneScissors" || "playerOnePaper") {
    //         $('#playerOneRock').hide();
    //         $('#playerOneScissors').hide();
    //         $('#playerOnePaper').hide();
    //         $(this).show();
    //         $('#pOneChoice').text("You Chose " + this.alt + "!");
    //         $('#pOneWaiting').text("Waiting for Opponent...");
    //         console.log(this.id)
    //         player1Picked = this.alt
    //         console.log("Player One Picked " + this.alt)
    //     }
    //     else {
    //         $('#playerTwoRock').hide();
    //         $('#playerTwoScissors').hide();
    //         $('#playerTwoPaper').hide();
    //         $(this).show();           
    //         $('#pTwoChoice').text("You Chose " + this.alt + "!");
    //         $('#pTwoWaiting').text("Waiting for Opponent...");
    //         console.log(this.id)
    //         player2Picked = this.alt
    //         console.log("Player Two Picked " + this.alt)
    //     }
    // });

    //---------------Player One-------------------


    $("#playerOneRock").on("click", function () {
        console.log(this.id);
        $('#playerOnePaper').hide();
        $('#playerOneScissors').hide();
        $('#pChoice').text("You Chose Rock!");
        $('#pWaiting').text("Waiting for Opponent...");

        player1Picked = this.alt;
        player1choice.set({
            player1Picked
        });
        evaluateChoices();

    });


    $("#playerOnePaper").on("click", function () {
        console.log(this.id);
        $('#playerOneRock').hide();
        $('#playerOneScissors').hide();
        $('#pChoice').text("You Chose Paper!");
        $('#pWaiting').text("Waiting for Opponent...");


        player1Picked = this.alt;
        player1choice.set({
            player1Picked
        });
        evaluateChoices();

    });


    $("#playerOneScissors").on("click", function () {
        console.log(this.id);
        $('#playerOneRock').hide();
        $('#playerOnePaper').hide();
        $('#pChoice').text("You Chose Scissors!");
        $('#pWaiting').text("Waiting for Opponent...");


        player1Picked = this.alt;
        player1choice.set({
            player1Picked
        });
        evaluateChoices();

    });


    //---------------Player Two-------------------


    $("#playerTwoRock").on("click", function () {
        console.log(this.id);
        $('#playerTwoPaper').hide();
        $('#playerTwoScissors').hide();
        $('#pChoice').text("You Chose Rock!");
        $('#pWaiting').text("Waiting for Opponent...");


        player2Picked = this.alt;
        player2choice.set({
            player2Picked
        });
        evaluateChoices();

    });


    $("#playerTwoPaper").on("click", function () {
        console.log(this.id);
        $('#playerTwoRock').hide();
        $('#playerTwoScissors').hide();
        $('#pChoice').text("You Chose Paper!");
        $('#pWaiting').text("Waiting for Opponent...");


        player2Picked = this.alt;
        player2choice.set({
            player2Picked
        });
        evaluateChoices();

    });


    $("#playerTwoScissors").on("click", function () {
        console.log(this.id);
        $('#playerTwoRock').hide();
        $('#playerTwoPaper').hide();
        $('#pChoice').text("You Chose Scissors!");
        $('#pWaiting').text("Waiting for Opponent...");


        player2Picked = this.alt;
        player2choice.set({
            player2Picked
        });
        evaluateChoices();

    });




    //-----------------------------------------------------------------------

    //Game Logic
    function evaluateChoices() {
        database.ref().on("value", function (checkChoices){
        if(checkChoices.child("/player1choice") === true & checkChoices.child("/player2choice") === true){
            if (player1Picked === "Rock" && player2Picked === "Rock") {
                console.log("It's a tie");
            }

            else if (player1Picked === "Rock" && player2Picked === "Paper") {
                // playerOneLoss();
                // playerTwoWin();
                console.log("P two wins");
            }

            else if (player1Picked === "Rock" && player2Picked === "Scissors") {
                // playerOneWin();
                console.log("P one wins");
                // playerTwoLoss();
            }

            else if (player1Picked === "Paper" && player2Picked === "Rock") {
                console.log("P one wins");
                // playerOneWin();
                // playerTwoLoss();
            }

            else if (player1Picked === "Paper" && player2Picked === "Paper") {
                console.log("It's a tie");

            }

            else if (player1Picked === "Paper" && player2Picked === "Scissors") {
                // playerOneLoss();
                console.log("P two wins");
                // playerTwoWin();
            }

            else if (player1Picked === "Scissors" && player2Picked === "Rock") {
                // playerOneLoss();
                // playerTwoWin();
                console.log("P two wins");
            }

            else if (player1Picked === "Scissors" && player2Picked === "Paper") {
                console.log("P one wins");
                // playerOneWin();
                // playerTwoLoss();
            }

            else if (player1Picked === "Scissors" && player2Picked === "Scissors") {
                console.log("It's a tie");
            }
        }
    });
    }

    //-----------------------------------------------------------------------

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
    //-----------------------------------------------------------------------






});
