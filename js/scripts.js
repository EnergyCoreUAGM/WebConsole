/*!
    * Start Bootstrap - SB Admin v6.0.0 (https://startbootstrap.com/templates/sb-admin)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    (function($) {
    "use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
            if (this.href === path) {
                $(this).addClass("active");
            }
        });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);

/**
 * Author: Shervin Firouzdehghan
 */

//This method is called when the login button in the login form is clicked.
function login(){
    //Getting the variables that the user entered when they are trying to login, Username and password.
    var userEmail = document.getElementById("inputEmailAddress").value;
    var userPassword = document.getElementById("inputPassword").value;
    //Validation to make sure that the user filled out all the corresponding fields for the username and password.
    if(userEmail != null && userEmail != "" && userPassword != null && userPassword != ""){
        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)//If the username and password fields are entered then they will be sent to their dashboard after being authenticated within Firestore.
        .then((user) => {
            // Signed in 
            window.location = 'dashboard.html';//Redirecting the user to the corresponding dashboard which is the index.html file.
            window.alert("Signed in" + userEmail);
        })
        .catch((error) => {
            //If there is an error the error will be displayed and they will not be sent to the dashboard.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert("Error: " + errorMessage);
        });
    }
    else{//Else statement incase that the user did not fill out all the fields.
        window.alert("Error please fill out all fields");
    }

}


//This method is called when the logout button is clicked which will remove the authentication from the corresponding user and log them out.
function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location = 'index.html';//Redirecting the user back to the login page when they are succesfully logged out.
        window.alert("Sign out succesful");
      }).catch(function(error) {
        // An error happened.
        var errorMessage = error.message;
        window.alert("Error: " + errorMessage);

      });
}




//This method is called when the user decides to reset their password in the password.html file.
function resetPassword(){
    //Getting the input from the user which is their email in this case in order to reset their password.
    var resetEmail = document.getElementById("resetEmailAddress").value;
    //Verifying that the fields where the are supposed to enter their email is no empty or null.
    if(resetEmail != null && resetEmail != ""){
        //If the email is validated then the sendPasswordResetEmail() firestore method will be called with the users email as the argument.
        firebase.auth().sendPasswordResetEmail(resetEmail).then(function() {
            // Email sent and the user will be redirected to the login page.
            window.alert("Password reset link was sent to your email");
            window.location = 'index.html';
        }).catch(function(error) {
            // An error happened.
            var errorMessageResetPassword = error.message;
            window.alert("Error: " + errorMessageResetPassword);
        });
    }
    else{
        window.alert("Error please fill out all fields");
    }
}



//This mehtod is the create user method which is called when the user is in the register.html file and they want to create a new accout.
function createUser(){
    //Gathering all the variables that the user has entered.
    var FirstNameRegister = document.getElementById("inputFirstNameRegister").value;
    var LastNameRegister = document.getElementById("inputLastNameRegister").value;
    var EmailAddressRegister = document.getElementById("inputEmailAddressRegister").value;
    var PasswordRegister = document.getElementById("inputPasswordRegister").value;
    var ConfirmPasswordRegister = document.getElementById("inputConfirmPasswordRegister").value;
    //Validating that the what the user has entered is not null or empty.
    if(FirstNameRegister != null && LastNameRegister != null && EmailAddressRegister != null && PasswordRegister != null && ConfirmPasswordRegister != null && FirstNameRegister != "" && LastNameRegister != "" && EmailAddressRegister != "" && PasswordRegister != "" && ConfirmPasswordRegister != ""){
        if (PasswordRegister == ConfirmPasswordRegister){//Making sure that both password match
            firebase.auth().createUserWithEmailAndPassword(EmailAddressRegister, ConfirmPasswordRegister)//Calling the createUserWithEmailAndPassword() method from firestore and passing the email and password as arguments where they will be created in the database.
            .then((user) => {
              // Signed in and redirecting user to the login page.
              window.location = 'index.html';
            })
            .catch((error) => {
                //Error happened.
              var errorCode = error.code;
              var errorMessage = error.message;
              window.alert("Error: " + errorMessage);
            });
        }
        else{//Else statement if password do not match.
          window.alert("Passwords do not match");
        }
    }else{//Error message when not all fields where filled out.
        window.alert("Error please fill out all fields");

    }
}

//This is for when the state of authentication is changed.
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      //Calling the follwing methods to initialize data from firestore when they are signed in.
      initializeWelcomeBackHeader();
      initializeBatteryStatus();
    } else {
      // No user is signed in.
//        window.location = 'index.html';//Redirecting the user back to the login page when they are succesfully logged out.
    }
  });



  //Method that is called when the user is signed in, in order to display welome with the corresponding name of the user.
  function initializeWelcomeBackHeader(){
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    db.collection("Users").doc(user.uid)
    .get().then(function(doc) {
        if (doc.exists) {
            document.getElementById("welcomeBackHeader").innerHTML = doc.get("name") + "!";
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }


  //This method is called when the user signs in and it will be displaying the last battery status that is in the database currently.
  function initializeBatteryStatus(){
      //Calling the auth method from firebase to get the current user.
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    //Bellow is the query for getting the latest battery by timestamp in descending order.
    db.collection("Users").doc(user.uid).collection("Battery").orderBy("timeStamp", "desc").limit(1)
    .get()
    .then(function(querySnapshot) { 
        querySnapshot.forEach(function(doc) {
            var battteryStat = doc.get("batteryStatus");
            var batteryPercentageNotFormatted = (battteryStat/12)*100;
            var batteryPercentage = batteryPercentageNotFormatted.toPrecision(2);
            console.log(doc.id, " => ", doc.data());
            document.getElementById("batteryValueDashboard").innerHTML = batteryPercentage + " %";
        });
        //Calling the method below to initialize temperature in header.
        initializeTempStatus();

    })
    .catch(function(error) {
        console.log("Error getting battery document: ", error);
    });
  }


  //This method is called when the user signs in and it will be displaying the last temp status that is in the database currently.
  function initializeTempStatus(){
    //Calling the auth method from firebase to get the current user.
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    //Bellow is the query for getting the latest temperature by timestamp in descending order.
    db.collection("Users").doc(user.uid).collection("Temperature").orderBy("timeStamp", "desc").limit(1)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var temperature = doc.get("temperature");
            //Setting the temperature to the corresponding html element.
            document.getElementById("temperatureValueDashboard").innerHTML = temperature + " C°";
        });
        //Calling the method below to initialize Generation in header.
        initializeGenerationStatus();
    })
    .catch(function(error) {
        console.log("Error getting temperature documents: ", error);
    });
  }




  //This method is used to initialize the last months generation status.
    function initializeGenerationStatus(){
        //Calling the auth method from firebase to get the current user.
        var user = firebase.auth().currentUser;
        const db = firebase.firestore();
        var today = new Date(); //This variable stores the current date of today.
        var generationWatts = 0;//Initialize variable that is used for the sum of all the generations in the month.
        var firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);//Getting the date of the last month from today.
        //Below is the query that will get all the Generation dates from the current month and add it up to the generationWatts variable.
        db.collection("Users").doc(user.uid).collection("Generation").where("timeStamp",">=", firstDayOfCurrentMonth)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                generationWatts += doc.get("watts");
                //Setting the generation watt to the correct html element.
                document.getElementById("generationValueDashboard").innerHTML = generationWatts.toPrecision(2) + " Wh";
                console.log(doc.id, " => ", doc.data());
            });
            //Calling the below method will initialize consumption in the header.
            initializeConsumptionStatus();

        })
        .catch(function(error) {
            console.log("Error getting temperature documents: ", error);
        });
  }

//This method is used to initialize the last months consumption status.
  function initializeConsumptionStatus(){
    //Calling the auth method from firebase to get the current user.
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    var today = new Date();//This variable stores the current date of today.
    var cunsumptionWatts = 0;//Initialize variable that is used for the sum of all the consumption in the month.
    var firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);//Getting the date of the last month from today.
    //Below is the query that will get all the consumption dates from the current month and add it up to the generationWatts variable.
    db.collection("Users").doc(user.uid).collection("Measurement").where("timeStamp",">=", firstDayOfCurrentMonth)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            cunsumptionWatts += doc.get("watts");
            //Setting the consumption watt to the correct html element.
            document.getElementById("consumptionValueDashboard").innerHTML = cunsumptionWatts.toPrecision(2) + " Wh";
            console.log(doc.id, " => ", doc.data());
        });
        //Calling the below method will initialize Generation chart.
        intializeGenerationChart();

    })
    .catch(function(error) {
        console.log("Error getting temperature documents: ", error);
    });
}






//This method will initilaized the generation which is know as the main chart.
function intializeGenerationChart(){
    //Initializing variables and array variables.
    var arrayDataGeneration =[];
    var arrayTimeGeneration = [];
    var arrrayComplete = [];
    var today = new Date();//This variable stores the current date of today.
    var firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);//Initialize variable that is used for the sum of all the generation in the month.
    //Calling the auth method from firebase to get the current user.
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    $('#dataTableAll tbody').empty();
    //Below is the query that will get all the generation dates from the all time and add it to an array for the main chart.
    db.collection("Users").doc(user.uid).collection("Generation").orderBy("timeStamp","asc")
    .get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            arrayDataGeneration.push(doc.get("watts").toPrecision(2));//Pushing the generation Wh into the arrayDataGeneration array to use in the chart.
            arrayTimeGeneration.push(doc.get("timeStamp").toDate().toDateString());//Pushing the timestamp into the arrayTimeGeneration array to use in the chart.
            arrrayComplete.push({timeStamp: doc.get("timeStamp").toDate().toDateString(), watts: doc.get("watts").toPrecision(2)});
            $("#dataTableAll").append("<tr><td>"+doc.get("sourceID")+"</td><td>"+doc.get("watts")+"</td><td>"+doc.get("current")+"</td><td>"+doc.get("timeStamp").toDate().toDateString()+"</td></tr>");
        });
        console.log("TestTime " + arrayTimeGeneration);
        console.log("TestData" + arrayDataGeneration);
        //Creating the chart and passing the two arrays that contain generation data and timestamp into the chart.
        var ctx = document.getElementById('mainChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: arrayTimeGeneration,
                datasets: [{
                    label: 'All-Time Generation Data',
                    data: arrayDataGeneration,
                    backgroundColor: 
                    'rgba(50,205,50, 0.2)',
                    borderColor: 
                    'rgba(50,205,50, 1)',
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values){
                                return value + "Wh";
                            }
                        }
                    }]
                }
            }
        });
    })
    .catch(function(error) {
        console.log("Error getting temperature documents: ", error);
    });  
}





//This method will initilaized the Consumption which is know as the main chart.
function intializeMeasurementChart(){
    //Initializing variables and array variables.
    var arrayDataMeasurement =[];
    var arrayTimeMeasurement = [];
    var arrrayComplete = [];
    var today = new Date();//This variable stores the current date of today.
    var firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);//Initialize variable that is used for the sum of all the generation in the month.
    //Calling the auth method from firebase to get the current user.
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    $('#dataTableAll tbody').empty();
    //Below is the query that will get all the consumption dates from the all time and add it to an array for the main chart.
    db.collection("Users").doc(user.uid).collection("Measurement").orderBy("timeStamp","asc")
    .get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            arrayDataMeasurement.push(doc.get("watts").toPrecision(2));
            arrayTimeMeasurement.push(doc.get("timeStamp").toDate().toDateString());
            arrrayComplete.push({timeStamp: doc.get("timeStamp").toDate().toDateString(), watts: doc.get("watts").toPrecision(2)});
            $("#dataTableAll").append("<tr><td>"+doc.get("deviceID")+"</td><td>"+doc.get("watts")+"</td><td>"+doc.get("current")+"</td><td>"+doc.get("timeStamp").toDate().toDateString()+"</td></tr>");
        });
        console.log("TestTime " + arrayTimeMeasurement);
        console.log("TestData" + arrayDataMeasurement);
        //Creating the chart and passing the two arrays that contain generation data and timestamp into the chart.
        var ctx = document.getElementById('mainChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: arrayTimeMeasurement,
                datasets: [{
                    label: 'All-Time Consumption Data',
                    data: arrayDataMeasurement,
                    borderWidth: 1,
                    backgroundColor: 
                        'rgba(255, 99, 132, 0.2)',
                    borderColor: 
                        'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values){
                                return value + "Wh";
                            }
                        }
                    }]
                }
            }
        });
    })
    .catch(function(error) {
        console.log("Error getting Measurement documents: ", error);
    });  
}

//This methos is used to see which select menu value is selected in the secondary chart in order to populate the secondary select menu.
function generate2Select(){
    //Setting the two select menus into variables for manipulation.
    var selectBox = document.getElementById("select1");
    var selectBox2 = document.getElementById("select2");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;//Getting the selected value in the first select menu on the left.
    //If statement to see if Generation or Measurement values are selected.
    if(selectedValue === "Generation"){
        //Getting the current user from Firebase auth().
        var user = firebase.auth().currentUser;
        const db = firebase.firestore();
        var arraySources = [];
        //Getting the name of the sources from the database in and pushing their names into an array.
        db.collection("Users").doc(user.uid).collection("Sources")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                arraySources.push(doc.get("name"));
                console.log(doc.id, " => ", doc.data());
            });
            //Calling the removeOptions method to clear the second select menu incase it is populated from before.
            removeOptions(selectBox2);
            //Adding the source names to the second select menu.
            for(i=0; i<arraySources.length; i++) {  
                selectBox2[selectBox2.length] = new Option(arraySources[i], arraySources[i]);
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }
    else{//Else will be used for when the Measurement value is selected in the first select menu.
        //Getting the current firebase user.
        var user = firebase.auth().currentUser;
        const db = firebase.firestore();
        var arrayDevices = [];
        //Query to get all the device documents from the Device collection in the database and pushing their names into the array..
        db.collection("Users").doc(user.uid).collection("Device")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                arrayDevices.push(doc.get("name"));//Pushing the name of the devices into the array.
                console.log(doc.id, " => ", doc.data());
            });
            //Calling the removeOptions method to clear the second select menu incase it is populated from before.
            removeOptions(selectBox2);
            //Adding the device names into th second select menu.
            for(i=0; i<arrayDevices.length; i++) {  
                selectBox2[selectBox2.length] = new Option(arrayDevices[i], arrayDevices[i]);
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }
}

//This method will remove all the values in a select menu in reverse order.
function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i > 0; i--) {
       selectElement.remove(i);
    }
 }


 //This method is called when their is a change in the second select menu.
 function generateChartFromSelect(){
    var selectBox = document.getElementById("select1");//Getting the value from the first select menu.
    var selectBox2 = document.getElementById("select2");//Getting the value from the second select menu.
    var selectedValue1 = selectBox.options[selectBox.selectedIndex].value;//Setting the value selected from the first select menu to a variable
    var selectedValue2 = selectBox2.options[selectBox2.selectedIndex].value;//Setting the value from the second select menu into a variable.
    var startDateValue = document.getElementById("startDateRange").value;
    var endDateValue = document.getElementById("endDateRange").value;
    console.log("intial value for start: " +  startDateValue + "End: " + endDateValue);
    var startDate = new Date(startDateValue);
    var endDate = new Date(endDateValue);
    console.log("Date value start: " +  startDateValue + "End: " + endDateValue);
    if(!Date.parse(startDateValue) || !Date.parse(endDateValue)){
        //Calling the intiliazeSecondaryMenu() and passing the selected argument from both select menus.
        intializeSecondaryChartAll(selectedValue1, selectedValue2);
    }
    else{
        intializeSecondaryChart(selectedValue1, selectedValue2, startDate, endDate);
        document.getElementById('startDateRange').valueAsDate = new Date();
        document.getElementById('endDateRange').valueAsDate = new Date();

    }
 }


//This method is used to populate the secondary chart with the corresponding data from the database.
function intializeSecondaryChartAll(collectionForQuery, sourceOrDeviceNameForQuery){
    //Getting the current firebase user.
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
        //If else statement to see what was selected from the first select menu.
        if(collectionForQuery === "Generation"){
            //Initializing the arrays to store the data from the queries.
            var arrayGenerationDataSecondaryChart =[];
            var arrayGenerationTimeSecondaryChart = [];
            $('#dataTable tbody').empty();
            //Query that will return the data that the user selected from the select menus.
            db.collection("Users").doc(user.uid).collection(collectionForQuery).where("sourceID","==",sourceOrDeviceNameForQuery).orderBy("timeStamp","asc")
            .get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    arrayGenerationDataSecondaryChart.push(doc.get("watts").toPrecision(2));//Pushing the Wh from the query into the corresponding array.
                    arrayGenerationTimeSecondaryChart.push(doc.get("timeStamp").toDate().toDateString());//Pushing the timeStamp from the query into the corresponding array.
                    $("#dataTable").append("<tr><td>"+doc.get("sourceID")+"</td><td>"+doc.get("watts")+"</td><td>"+doc.get("current")+"</td><td>"+doc.get("timeStamp").toDate().toDateString()+"</td></tr>");
                });
                    console.log("arrayGenerationTimeSecondaryChart " + arrayGenerationTimeSecondaryChart);
                    console.log("arrayGenerationDataSecondaryChart" + arrayGenerationDataSecondaryChart);
                    //Creating the secondary chart and adding the data from the arrays that were queried from the database.
                    var ctx = document.getElementById('secondaryChart').getContext('2d');
                    var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: arrayGenerationTimeSecondaryChart,
                        datasets: [{
                            label: 'All-Time Data',
                            data: arrayGenerationDataSecondaryChart,
                            backgroundColor: 
                            'rgba(50,205,50, 0.2)',
                            borderColor: 
                            'rgba(50,205,50, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values){
                                        return value + "Wh";
                                    }
                                }
                            }]
                        }
                    }
                });
            })
            .catch(function(error) {
                console.log("Error getting arrayGenerationTimeSecondaryChart documents: ", error);
            });
        }
        else{//Else statement for when the Measurement was selected from the first select menu.
            //Initializing the arrays where the data will be stored.
            var arrayMeasurementDataSecondaryChart =[];
            var arrayMeasurementTimeSecondaryChart = [];
            $('#dataTable tbody').empty();
            //Querying the database depending on what device the user selected in the database.
            db.collection("Users").doc(user.uid).collection(collectionForQuery).where("deviceID","==",sourceOrDeviceNameForQuery).orderBy("timeStamp","asc")
            .get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    arrayMeasurementDataSecondaryChart.push(doc.get("watts").toPrecision(2));//Pushing the Wh of the selected device to the array.
                    arrayMeasurementTimeSecondaryChart.push(doc.get("timeStamp").toDate().toDateString());//Pushing the timeStamp of the selected device to the array.
                    $("#dataTable").append("<tr><td>"+doc.get("deviceID")+"</td><td>"+doc.get("watts")+"</td><td>"+doc.get("current")+"</td><td>"+doc.get("timeStamp").toDate().toDateString()+"</td></tr>");
                });
                    console.log("arrayMeasurementTimeSecondaryChart " + arrayMeasurementTimeSecondaryChart);
                    console.log("arrayMeasurementDataSecondaryChart" + arrayMeasurementDataSecondaryChart);
                    //Creating the chart with the data from the arrays that where queried.
                    var ctx = document.getElementById('secondaryChart').getContext('2d');
                    var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: arrayMeasurementTimeSecondaryChart,
                        datasets: [{
                            label: 'All-Time Data',
                            data: arrayMeasurementDataSecondaryChart,
                            backgroundColor: 
                            'rgba(255, 99, 132, 0.2)',
                        borderColor: 
                            'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values){
                                        return value + "Wh";
                                    }
                                }
                            }]
                        }
                    }
                });
            })
            .catch(function(error) {
                console.log("Error getting arrayMeasurementTimeSecondaryChart documents: ", error);
            });
        }
}


//This method is used to populate the secondary chart with the corresponding data from the database.
function intializeSecondaryChart(collectionForQuery, sourceOrDeviceNameForQuery, start, end){
    console.log("Inside method start: " +  start + "End: " + end);
    //Getting the current firebase user.
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
        //If else statement to see what was selected from the first select menu.
        if(collectionForQuery === "Generation"){
            //Initializing the arrays to store the data from the queries.
            var arrayGenerationDataSecondaryChart =[];
            var arrayGenerationTimeSecondaryChart = [];
            $('#dataTable tbody').empty();
            //Query that will return the data that the user selected from the select menus.
            db.collection("Users").doc(user.uid).collection(collectionForQuery).where("sourceID","==",sourceOrDeviceNameForQuery).where("timeStamp",">=",start).where("timeStamp","<=",end).orderBy("timeStamp","asc")
            .get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    arrayGenerationDataSecondaryChart.push(doc.get("watts").toPrecision(2));//Pushing the Wh from the query into the corresponding array.
                    arrayGenerationTimeSecondaryChart.push(doc.get("timeStamp").toDate().toDateString());//Pushing the timeStamp from the query into the corresponding array.
                    $("#dataTable").append("<tr><td>"+doc.get("sourceID")+"</td><td>"+doc.get("watts")+"</td><td>"+doc.get("current")+"</td><td>"+doc.get("timeStamp").toDate().toDateString()+"</td></tr>");
                });
                    console.log("arrayGenerationTimeSecondaryChart " + arrayGenerationTimeSecondaryChart);
                    console.log("arrayGenerationDataSecondaryChart" + arrayGenerationDataSecondaryChart);
                    //Creating the secondary chart and adding the data from the arrays that were queried from the database.
                    var ctx = document.getElementById('secondaryChart').getContext('2d');
                    var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: arrayGenerationTimeSecondaryChart,
                        datasets: [{
                            label: 'All-Time Data',
                            data: arrayGenerationDataSecondaryChart,
                            backgroundColor: 
                            'rgba(50,205,50, 0.2)',
                            borderColor: 
                            'rgba(50,205,50, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values){
                                        return value + "Wh";
                                    }
                                }
                            }]
                        }
                    }
                });
            })
            .catch(function(error) {
                console.log("Error getting arrayGenerationTimeSecondaryChart documents: ", error);
            });
        }
        else{//Else statement for when the Measurement was selected from the first select menu.
            //Initializing the arrays where the data will be stored.
            var arrayMeasurementDataSecondaryChart =[];
            var arrayMeasurementTimeSecondaryChart = [];
            $('#dataTable tbody').empty();
            //Querying the database depending on what device the user selected in the database.
            db.collection("Users").doc(user.uid).collection(collectionForQuery).where("deviceID","==",sourceOrDeviceNameForQuery).where("timeStamp",">=",start).where("timeStamp","<=",end).orderBy("timeStamp","asc")
            .get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    arrayMeasurementDataSecondaryChart.push(doc.get("watts").toPrecision(2));//Pushing the Wh of the selected device to the array.
                    arrayMeasurementTimeSecondaryChart.push(doc.get("timeStamp").toDate().toDateString());//Pushing the timeStamp of the selected device to the array.
                    $("#dataTable").append("<tr><td>"+doc.get("deviceID")+"</td><td>"+doc.get("watts")+"</td><td>"+doc.get("current")+"</td><td>"+doc.get("timeStamp").toDate().toDateString()+"</td></tr>");
                });
                    console.log("arrayMeasurementTimeSecondaryChart " + arrayMeasurementTimeSecondaryChart);
                    console.log("arrayMeasurementDataSecondaryChart" + arrayMeasurementDataSecondaryChart);
                    //Creating the chart with the data from the arrays that where queried.
                    var ctx = document.getElementById('secondaryChart').getContext('2d');
                    var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: arrayMeasurementTimeSecondaryChart,
                        datasets: [{
                            label: 'All-Time Data',
                            data: arrayMeasurementDataSecondaryChart,
                            backgroundColor: 
                            'rgba(255, 99, 132, 0.2)',
                        borderColor: 
                            'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values){
                                        return value + "Wh";
                                    }
                                }
                            }]
                        }
                    }
                });
            })
            .catch(function(error) {
                console.log("Error getting arrayMeasurementTimeSecondaryChart documents: ", error);
            });
        }
}

function secondaryChartSubmitForQuery(){

}


//This method is called when the dowload button is clicked in order to download the main chart.
function downloadMainChart(){
    const myCanvas =document.querySelector("#mainChart");
    //If statement to see if the user is using internet explorer since IE has a different way to download images.
    if(window.navigator.msSaveBlob){
        window.navigator.msSaveBlob(myCanvas.msToBlob(), "main-chart.png");
    }
    else{
        const a = document.createElement("a");

        document.body.appendChild(a);
        a.href = myCanvas.toDataURL();
        a.download = "main-chart.png";
        a.click();
        document.body.removeChild(a);
    }


}



//This method is called when the dowload button is clicked in order to download the secondary chart.
function downloadSecondaryChart(){
    const myCanvas =document.querySelector("#secondaryChart");
    //If statement to see if the user is using internet explorer since IE has a different way to download images.
    if(window.navigator.msSaveBlob){
        window.navigator.msSaveBlob(myCanvas.msToBlob(), "secondary-chart.png");
    }
    else{
        const a = document.createElement("a");

        document.body.appendChild(a);
        a.href = myCanvas.toDataURL();
        a.download = "secondary-chart.png";
        a.click();
        document.body.removeChild(a);
    }
}



function downloadTable(){
    var data = "";
    var tableData = [];
    var rows = $("#dataTable tr");
    rows.each(function(index, row) {
      var rowData = [];
      $(row).find("th, td").each(function(index, column) {
        rowData.push(column.innerText);
      });
      tableData.push(rowData.join(","));
    });
    data += tableData.join("\n");
    $(document.body).append('<a id="download-link" download="data.csv" href=' + URL.createObjectURL(new Blob([data], {
      type: "text/csv"
    })) + '/>');


    $('#download-link')[0].click();
    $('#download-link').remove();
}

function downloadTableAll(){
    var data = "";
    var tableData = [];
    var rows = $("#dataTableAll tr");
    rows.each(function(index, row) {
      var rowData = [];
      $(row).find("th, td").each(function(index, column) {
        rowData.push(column.innerText);
      });
      tableData.push(rowData.join(","));
    });
    data += tableData.join("\n");
    $(document.body).append('<a id="download-link" download="data.csv" href=' + URL.createObjectURL(new Blob([data], {
      type: "text/csv"
    })) + '/>');


    $('#download-link')[0].click();
    $('#download-link').remove();
}



