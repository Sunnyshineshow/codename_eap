//Minnie: Line Liff Initialize
//TODO

//Submit data to webhook
function submit()
{
    let payload = 
    {
        //Dragon - กรอก
        weight : 0, //TODO
        height : 0, //TODO
        symptomps : {}, //TODO,
        disease : {}, //TODO,
        hard_breathe : false,
        heavy_breathe : false
        }

        $.post("",payload,(msg) => 
        {
            console.log(msg);
        })
}