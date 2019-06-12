//Rock Paper Scissors
//With online chat.


//2.need to delete player infomation on refresh(?)
//3.Need to alert player when other player disconnects/leaves
//4.need to empty database when player leaves
//5.Make and test RPS logic


$(document).ready(function () {
  //-----------------------------------------------------------------------

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyBNtVyMKY8oSJe_wQc0KtbJtajG0sz7-nQ",
    authDomain: "rpsonlinebase.firebaseapp.com",
    databaseURL: "https://rpsonlinebase.firebaseio.com",
    projectId: "rpsonlinebase",
    storageBucket: "",
    messagingSenderId: "314201387785"
  };
  firebase.initializeApp(config);
  //-----------------------------------------------------------------------


  const database = firebase.database();
  const connectedRef = database.ref(".info/connected");
  const connectionsRef = database.ref("/connections");

  let choices = ['r', 'p', 's'];
  let ties = 0;
  let wins = 0;
  let losses = 0;

  connectedRef.on("value", function (snap) {

    console.log("Checking connection ref: ", snap);


    if (snap.val()) {
      var con = connectionsRef.push(true);
      con.onDisconnect().remove();
    }
  });


  connectionsRef.on("value", function (snapshot) {
    console.log(snapshot);
    checkUser(snapshot);
    playerChecker(snapshot);
  });


  database.ref("/player1").on("value", function (snapshot) {
    console.log("Player One exists? " + snapshot.val().exists);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  database.ref("/player2").on("value", function (snapshot) {
    console.log("Player Two exists? " + snapshot.val().exists);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });



  $(":button").on('click', function (event) {
    let playerNumber = sessionStorage.getItem('user');
    console.log("The Player's Number: " + playerNumber);
    let playerChoice = $(this).text().charAt(0).toLowerCase();

    database.ref("/player" + playerNumber).set({
      exists: true,
      choice: playerChoice
    });

    $(':button').attr('disabled', true);

    if (playerNumber == 1) {
      database.ref('/player2').on("value", function (snapshot) {
        if (snapshot.val().choice == undefined){
          $('#info').text("Waiting for Player 2...");
        } else {
          gameLogic(playerChoice, snapshot.val());
        }
      
      });
    } else {
      database.ref('/player1').on("value", function (snapshot) {
        if (snapshot.val().choice == undefined){
          $('#info').text("Waiting for Player 1...");
        } else {
          gameLogic(playerChoice, snapshot.val());
        }
      });
    }

    displayInfo(playerChoice);
    // event.preventDefault();
    gameOver();
  });


  function gameLogic(x, y) {
    let check = x + "|" + y

    console.log("You chose: ", x, " and Opponent's Choice: ", y.choice)
    switch (check) {
        case "r|s":
            wins++;
            break;
        case "r|p":
            losses++;
            break;
        case "r|r":
            ties++;
            break;
        case 's|p':
            wins++;
            break;
        case 's|r':
            losses++;
            break;
        case 's|s':
            ties++;
            break;
        case 'p|r':
            wins++;
            break;
        case 'p|s':
            losses++;
            break;
        case 'p|p':
            ties++;
            break;
    };
  };


  //Once everything exists.
  function gameOver() {
    console.log(
      "**********************\n" +
      "wins: " + wins + "\n" +
      "ties: " + ties + "\n" +
      "losses: " + losses + "\n" +
      "**********************\n");
    $('#wins').html("Wins: " + wins);
    $('#losses').html("Losses: " + losses);
    $('#ties').html("Ties: " + ties);
  };

  function displayInfo(choice) {
    let playerNumber = sessionStorage.getItem('user');
    if (playerNumber > 1) {

      $('#opponent-choice').html(`<img src='assets/images/${choice}.png' alt=${choice}>`);
    } else {
      $('#player-choice').html(`<img src='assets/images/${choice}.png' alt=${choice}>`);

    };
  };



  //Checking if players exist on Firebase...
  function playerChecker(snapshot) {
    if (snapshot.numChildren() == 0) {
      database.ref('/player1').set({
        exists: 'false',
      });
      database.ref('/player2').set({
        exists: 'false',
      });

      $("#player-count").text("Waiting for players...");
      $(':button').attr('disabled', true);
    }

    if (snapshot.numChildren() == 1) {
      database.ref('/player1').set({
        exists: 'true',
      });
      database.ref('/player2').set({
        exists: 'false',
      });
      $("#player-count").text("Waiting for a second player...");
      $(':button').attr('disabled', true);
    };

    if (snapshot.numChildren() == 2) {
      database.ref('/player2').set({
        exists: 'true',
      });

      $("#player-count").text("ALL PLAYERS HERE!");
      $(':button').attr('disabled', false);
    };

    if (snapshot.numChildren() > 2) {
      $("#player-count").text("SORRY PLAYERS OVER THE LIMIT, PLEASE WAIT");
      $(':button').attr('disabled', true);
    };
  };

  //Checking Session if any data exists, and firebase if anybody is on.
  function checkUser(snapshot) {
    console.log(
      "Checking firebase.... # of users are " + snapshot.numChildren() +
      "\nChecking Session Storage... you are " + sessionStorage.getItem('user')
    );

    if (sessionStorage.getItem('user') == null && snapshot.numChildren() == 1) {
      sessionStorage.setItem('user', 1);
    };

    if (sessionStorage.getItem('user') == null && snapshot.numChildren() == 2) {
      sessionStorage.setItem('user', 2);
    };
    $('#player-position').text("You are Player #" + sessionStorage.getItem('user'));
  };
});