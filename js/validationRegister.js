function validateEmail() {
  var mailFormat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const emailText = document.getElementById("email").value;
  if (emailText.match(mailFormat)) {
    return true;
  } else {
    alert("You have entered an invalid email address!");
    return false;
  }
}

function validatePhone() {
  var phoneFormat = /^[0-9]+$/;
  const phoneText = document.getElementById("phone").value;
  if (phoneText.match(phoneFormat)) {
    return true;
  } else {
    alert("You have entered an invalid phone number!");
    return false;
  }
}
