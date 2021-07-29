//ก้อนทำเผื่อไว้ให้แล้ว ฝากที่เหลือด้วย ต่อบรรทัด 5 เลยไม่ต้องใส่เป็นฟังก์ชั่น
//เห็นอะไรอยากแก้ๆ ได้เลย

//PingPing: Line Liff - get user id
//TODO


//#region CHECK_DATA
function tellthesubmit_time()
    {
        document.getElementById("Said").innerHTML = "Data was submit on " + Date();
    }

    function CheckingData()
    {
        let isFollowingCondition = [true,true,true,true,true];

        if(!($("#FirstName").val()) || !($("#LastName").val()) || !($("#Age").val()) || !($("#CID").val()) || !($("#Phone").val()) || !($("#Address").val()))
        {
           alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
           document.getElementById("Said").innerHTML = "<h4> กรุณากรอกข้อมูลให้ครบถ้วนดังต่อไปนี้! </h4>";
           document.getElementById("ErrorList").innerHTML += "<li> กรอกข้อมูลไม่ครบ </li> <br> "
           if(!($("#FirstName").val()))
            document.getElementById("FirstName").style.backgroundColor = "#F8A488";
            document.getElementById("ErrorList").innerHTML += "<li> ชื่อไม่ถูกต้อง </li> <br>"
           if(!($("#LastName").val()))
            document.getElementById("ErrorList").innerHTML += "<li> นามสกุลไม่ถูกต้อง</li> <br>"
            document.getElementById("LastName").style.backgroundColor = "#F8A488";
           if(!($("#Age").val()))
            document.getElementById("ErrorList").innerHTML += "<li> อายุไม่ถูกต้อง </li> <br>"
            document.getElementById("Age").style.backgroundColor = "#F8A488";
           if(!($("#CID").val()))
            document.getElementById("ErrorList").innerHTML += "<li> รหัสบัตรประชาชนไม่ถูกต้อง </li> <br>"
            document.getElementById("CID").style.backgroundColor = "#F8A488";
           if(!($("#Phone").val()))
            document.getElementById("ErrorList").innerHTML += "<li> เบอร์โทรไม่ถูกต้อง </li> <br>"
            document.getElementById("Phone").style.backgroundColor = "#F8A488";
           if(!($("#Address").val()))
           document.getElementById("ErrorList").innerHTML += "<li> ที่อยู่ไม่ถูกต้อง </li> <br>"
            document.getElementById("Address").style.backgroundColor = "#F8A488";

            isFollowingCondition[0] = false;
        }
        if($("#Age").length <= 2 && ($("#Age").val()) <= 0)
        {
            document.getElementById("ErrorList").innerHTML += "<li> อายุไม่ถูกต้อง </li> <br>"
            document.getElementById("CID").style.backgroundColor = "#F8A488";

            isFollowingCondition[1] = false;
        }
        if(($("#CID").length != 13))
        {
            document.getElementById("ErrorList").innerHTML += "<li> รหัสบัตรประชาชนไม่ถูกต้อง </li> <br>"
            document.getElementById("CID").style.backgroundColor = "#F8A488";

            isFollowingCondition[2] = false;
        }
        if(($("#Phone").length != 10))
        {
            document.getElementById("ErrorList").innerHTML += "<li> เบอร์โทรไม่ถูกต้อง </li> <br>"
            document.getElementById("Phone").style.backgroundColor = "#F8A488";

            isFollowingCondition[3] = false;
        }
        if(document.getElementById("Male").checked === false && document.getElementById("Female").checked === false && document.getElementById("Other").checked === false )
        {
           alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
           document.getElementById("Said").innerHTML = "<li> กรุณาเลือกเพศ </li> <br>";
           console.log("Error at Gender");
           isFollowingCondition[4] = false;
        }

        let isInvalid = false;

        for (let i in isFollowingCondition)
        {
            if (!i)
            {
                isInvalid = true;
            }
        }

        if (!isInvalid)
        {
            submit();
        }
    }
//#endregion

//#region submission
function submit()
{
    var Gender;
            if(document.getElementById("Male").checked === true)
            Gender = "Male";
            else if(document.getElementById("Female").checked === true)
            Gender = "Female";
            else if(document.getElementById("Other").checked === true)
            Gender = "Other";

    var ProfileData =
            {
            usr_id: "", //TODO
            first_name:$("#FirstName").val(),
            last_name:$("#LastName").val(),
            age: $("#Age").val(),
            citizen_id: ($("#CID").val()), //TODO
            gender:Gender,
            phonenum: $("#Phone").val(), //TODO
            address: $("#Address").val() //TODO
            };

            console.log(($("#Phone").width()))

            $.post("https://sundragon.advws.com/eap/register/in/",ProfileData,(Debug) =>
            {
                console.log(Debug);
            }
            );
}
//#endregion
