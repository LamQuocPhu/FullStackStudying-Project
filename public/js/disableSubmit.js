setInterval(addMember, 100);

document.querySelector("button").disabled = true;

function addMember() {
    var getName = document.getElementById('name').value;
    var getEmail = document.getElementById('email').value;
    var getPhone = document.getElementById('phone').value;

    if (getName == "" || getEmail == "" || getPhone == "") {
        document.querySelector("button").disabled = true;
    } else {
        document.querySelector("button").disabled = false;
    }
}