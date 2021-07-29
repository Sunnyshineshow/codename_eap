//Check Submit here
function checkAndSubmit()
{
    //Get userId from LineLiff
    let userId;

    liff.getProfile()
    .then(profile => {
    userId = profile.userId
    })
    .catch((err) => {
    console.log('error', err);
    });

    //Validation
    let isValid = true;

    //First Name
    if(!($("#first_name").match(new RegExp("^[ก-๏\s]+$"))) || !($("#first_name").match(new RegExp("^[a-zA-Z\s]+$"))))
    {
        //Warning

        isValid = false;
        console.log("Incorrect first name format");
    }

    //Last Name
    if(!($("#last_name").match(new RegExp("^[ก-๏\s]+$"))) || !($("#last_name").match(new RegExp("^[a-zA-Z\s]+$"))))
    {
        //Warning

        isValid = false;
        console.log("Incorrect last name format");
    }

    //ID Type


    //Age
    if (parseInt($("#age").val()) <= 0)
    {
        //Warning

        isValid = false;
        console.log("Incorrect age format");
    }

    //Tel --> บางคนน่าจะมี + ประเทศ ไม่น่ามีแค่ 10 หลัก

    //email
    if (!($("#email").match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)))
    {
        //Warning

        isValid = false;
        console.log("Incorrect email format")
    }

    //Address Number
    if(!($("#address_number").val()))
    {
        //Warning

        isValid = false;
        console.log("Incorrect Address format")
    }

    //Street
    if(!($("#street").val()))
    {
        //Warning

        isValid = false;
        console.log("Incorrect Address format")
    }

    //City
    if(!($("#city").val()))
    {
        //Warning

        isValid = false;
        console.log("Incorrect Address format")
    }

    //District
    if(!($("#district").val()))
    {
        //Warning

        isValid = false;
        console.log("Incorrect Address format")
    }

    //Province
    if(!($("#province").val()))
    {
        //Warning

        isValid = false;
        console.log("Incorrect Address format")
    }

    if(!($("#zipcode").val()))
    {
        //Warning

        isValid = false;
        console.log("Incorrect Address format")
    }

    if (isValid)
    {
        //Submission
        let payload = 
        {
            usr_id      :   userId,
            name_prefix :   $("#name_prefix").val(),
            first_name  :   $("#first_name").val(),
            last_name   :   $("#last_name").val(),
            id_type     :   $("#id_type").val(),
            id_number   :   $("#id_number").val(),
            passport_id :   $("#passport_id").val(),
            age         :   $("#age").val(),
            date_of_birth:  $("#date_of_birth").val(),
            gender      :   $("#gender").val(),
            tel         :   $("#tel").val(),
            email       :   $("#email").val(),
            drug_allergy:   $("#drug_allergy"),
            address:
            {
            AddressNumber   :   $("#address_number").val(),
            Moo             :   $("#moo").val(),
            Village         :   $("#village").val(),
            Alley           :   $("#alley").val(),
            Street          :   $("#street").val(),
            Building        :   $("#building").val(),
            Floor           :   $("#floor").val(),
            RoomNumber      :   $("#room_number").val(),
            Province        :   $("#province").val(),
            District        :   $("#district").val(),
            City            :   $("#city").val(),
            Zipcode         :   $("#zipcode").val()
            },
            emergency:
            {
                e_first_name    :   $("#e_first_name").val(),
                e_last_name     :   $("#e_last_name").val(),
                e_tel           :   $("#e_tel").val()
            }
        }
        // $.postJSON(MAINURL + "/api-web/line/regis_submit",payload,(msg) =>
        // {
        //     console.log(msg);
        // })

        console.log(payload);
    
    }
}