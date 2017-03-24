var subdomain = "SUBDOMAIN";
var v_users_amount = 5000 // how many users on their instance.... settings --> manage --> people


function getUsers(page) {
var gloRunTot=0, gloTotIdent = 0,gloUserList = 0 //store totals
    $.ajax({
        url: "https://" + subdomain + ".zendesk.com/api/v2/users.json?include=identities&page=" + page,
        type: "GET",
        dataType: "JSON"
    }).done(function(results) {
        var runTot = 0 // running total
        var totIdent = 0 
        var userList = results.users;
        var identities = results.identities; // has identities in it as seen in console log
        gloUserList=userList.length
        function getPhoneIdentities(userID) {
            // This function is to get the details of a phone identity associated with a user ID
            //filter_.filter(list, predicate, [context]) Alias: select 
            // Looks through each value in the list, returning an array of all the values that pass a truth test (predicate).
            var array = identities;
            for (var i = 0; i < array.length; i++) {
                if (array[i].user_id === userID) {
                    return array[i];
                }
            }

        } // end of get phone identities
        function makePut(phone_number, userID) {
            // to make put request
            setTimeout(function() {
                $.ajax({
                    url: "/api/v2/users/" + userID + "/identities.JSON",
                    type: "POST",
                    dataType: "JSON",
                    //{"identity":{ "type" : "phone_number","value" : "+35316797104", "verified" : true }}
                    data: {
                        "identity": {
                            "type": "phone_number",
                            "value": ""+ phone_number+"",
                            "verified": true
                        }
                    }
                }).done(function(data) {
                    console.log("User Identitiy created");
                }).fail(function(data) {
                    console.log("Can't create the identity ");
                })
            }, 3000);
        }


        // global object array update many? so 1 put request instead of lots of individual ones
        // console.log(identities) looking to see that identities has something in it!
        // loop thru users.... show results and then make a put request.
        
        for (var i = 1; i < results.users.length; i++) {
            if (userList[i].suspended != true && userList[i].phone != null) {
                var ident = getPhoneIdentities(userList[i].id);
                console.log('End Users Name: ' + userList[i].name + '\n Has user ID (api/v2/users) of: ' + userList[i].id + '\n This users Identity endpoint id is: ' + ident.id + '\n Type of identity is: ' + ident.type + '\n and value of this is: ' + ident.value);
                // will have put request here to put to the identity id that is above.
                if (ident.type==="phone_number") {
                    console.log('\nITS A PHONE NUMBER IDENTITY!')
                    //POST REQUEST TO MAKE IT A DIRECT LINE does it
                    //is a phone number thats not verified an identity? doesent seem to be 
                    //takes user id and create identity POST /api/v2/users/{user_id}/identities/ 
                    //{"identity":{ "type" : "phone_number","value" : "+35316797104", "verified" : true }}
                    makePut(userList[i].phone,userList[i].id) // pass in user id and identity value for 
                    totIdent+=1 // add to total processed

                    runTot+=1 // add to only phone number identities
                }
                else  console.log('\nITS NOT A PHONE NUMBER IDENTITY!, IGNORING')
                    //do nothing as this is not a phone number! 
                    makePut(userList[i].phone,userList[i].id)
                totIdent+=1
            }
            else console.log("users is suspended or has no phone number: "+userList[i].id)
            
            
        }
gloRunTot = runTot
gloTotIdent = totIdent
    }); //end of function results

} // end of function getUsers

for (var j = 0; j < Math.ceil(v_users_amount / 100); j++) {
    getUsers(j + 1);
    }
    console.log('Total numbers made into direct line: '+gloRunTot+'\n'+'Total identities processed: '+gloTotIdent+'\n'+'Total users in this instance:'+gloUserList)
