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
    connectedRef.on("value", function(snap) {

        // If they are connected..
        if (snap.val()) {
      
          // Add user to the connections list.
          var con = connectionsRef.push(true);
      
          // Remove user from the connection list when they disconnect.
          con.onDisconnect().remove();
        }
      });


      connectionsRef.on("value", function(snapshot) {

        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#player-count").text("PLAYERS: " + snapshot.numChildren());
      });


      database.ref("/player1").on("value", function(snapshot) {
          console.log(snapshot);
        // let player1Choice = snapshot.val().choice;
        // console.log(player1Choice);
        
      // If any errors are experienced, log them to console.
      }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });


      database.ref("/player2").on("value", function(snapshot) {
        console.log(snapshot);
        // let player2Choice = snapshot.val().choice;
        // console.log(player2Choice)
        
      // If any errors are experienced, log them to console.
      }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });


    

    
    let choices = ['r', 'p', 's'];

    let ties = 0;
    let wins = 0;
    let losses = 0;

    $(":button").on('click', function (event) {

        let playerNumber = $('#player-count').text().charAt($('#player-count').text().length -1);
        console.log("The Player's Number: " + playerNumber);

        let playerChoice = $(this).text().charAt(0).toLowerCase();
        
        database.ref("/player" + playerNumber).set({
            choice: playerChoice
        });

        database.ref("/player" + playerNumber).on("value",function(snapshot){
            console.log("Your choice is: ", playerChoice);
        });



        // event.preventDefault();
        // let x = $(this).text().charAt(0).toLowerCase();
        // let y = choices[Math.floor(Math.random() * 3)]
        // console.log("Computer Choice: ", y)
        // console.log("User's Choice: ", x);

        // let check = x + "|" + y

        // switch (check) {
        //     case "r|s":
        //         wins++;
        //         break;
        //     case "r|p":
        //         losses++;
        //         break;
        //     case "r|r":
        //         ties++;
        //         break;
        //     case 's|p':
        //         wins++;
        //         break;
        //     case 's|r':
        //         losses++;
        //         break;
        //     case 's|s':
        //         ties++;
        //         break;
        //     case 'p|r':
        //         wins++;
        //         break;
        //     case 'p|s':
        //         losses++;
        //         break;
        //     case 'p|p':
        //         ties++;
        //         break;
        // }
        displayInfo();
    });




    function displayInfo() {

        console.log(
            "**********************\n" +
            "wins: " + wins + "\n" +
            "ties: " + ties + "\n" +
            "losses: " + losses + "\n" +
            "**********************\n");


        $('#wins').html("Wins: " + wins);
        $('#losses').html("Losses: " + losses);
        $('#ties').html("Ties: " + ties);
    }    
});