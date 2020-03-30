/*document.getElementById('loginBtn').addEventListener('click', function(e) {
    postTokenRequest()
});
*/
function doSomethingWith(strResponse) {
    console.log(strResponse.refresh)
    console.log(strResponse.access)
    setCookie("refresh", strResponse.refresh, 1)
    setCookie("access", strResponse.access, 1)
}

function postTokenRequest() {
    console.log("clicked")
    var formData = new FormData();
    formData.append("username", "dylan")
    formData.append("password", "badpassword")
    $.ajax({
        url: 'http://127.0.0.1:8000/api/token/',
        type: 'POST',
        dataType: "json",
        data: formData, //{identifier: "A12345", password: "112233"}
        processData: false,
        contentType: false, //beforeSend: function(xhr){xhr.setRequestHeader('X-Header', 'header-value');},    
        success: function(response) {
            doSomethingWith(response)
        }
    });
};

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}