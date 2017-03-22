var subdomain = "subdomain";
var v_users_amount = 5000 // how many users on their instance.... settings --> manage --> people


function getUsers(page) {

    $.ajax({
        url: "https://" + subdomain + ".zendesk.com/api/v2/users.json?include=identities&page=" + page,
        type: "GET",
        dataType: "JSON"
    }).done(function(results) {
        var runTot = 0 // running total
        var totIdent = 0 
        var userList = results.users;
        var identities = results.identities; // has identities in it as seen in console log

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

        }

        // global object array update many? so 1 put request instead of lots of individual ones
        // console.log(identities) looking to see that identities has something in it!
        // loop thru users.... show results and then make a put request.
        for (var i = 1; i < results.users.length; i++) {
            if (userList[i].suspended != true) {
                var ident = getPhoneIdentities(userList[i].id);
                console.log('End Users Name: ' + userList[i].name + '\n Has user ID (api/v2/users) of: ' + userList[i].id + '\n This users Identity endpoint id is: ' + ident.user_id + '\n Type of identity is: ' + ident.type + '\n and value of this is: ' + ident.value);
                // will have put request here to put to the identity id that is above.
                if (ident.type==="phone_number") {
                    console.log('\nITS A PHONE NUMBER IDENTITY!')
                    //PUT REQUEST TO MAKE IT A DIRECT LINE
                    totIdent+=1 // add to total processed

                    runTot+=1 // add to only phone number identities
                }
                else  console.log('\nITS NOT A PHONE NUMBER IDENTITY!, IGNORING')
                    //do nothing as this is not a phone number! 
                totIdent+=1
            }
            console.log('Total numbers made into direct line: '+runTot+'\n'+'Total identities processed: '+totIdent+'\n'+'Total users in this instance:'+userList.length)
            
        }
    });
}

for (var j = 0; j < Math.ceil(v_users_amount / 100); j++) {
    getUsers(j + 1);
}
