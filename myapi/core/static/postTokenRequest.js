/*
initialSetJWTToken sets the access and refresh tokens as a cookies.
This function is called after the response from postTokenRequest is recieved.
*/
function initialSetJWTToken(responseObject) {
    console.log(responseObject.refresh)
    console.log(responseObject.access)
    setCookie("refresh", responseObject.refresh, 1)
    setCookie("access", responseObject.access, 1)
}


function protectedRequest() {
    console.log("protected request clicked")
    $.ajax({
        url: 'http://127.0.0.1:8000/hello/',
        type: 'GET',
        dataType: "json",
        data: "", //{identifier: "A12345", password: "112233"}
        beforeSend: function(xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access")); },
        success: function(response, httpObj) {
            if (httpObj.status = 200) {
                alert("Sucessfully accessed endpoint with token")
            }

        },
        error: function(httpObj, textStatus) {
            if (httpObj.status = 401) {
                console.log(httpObj.status)
                alert("Bad token")
                refreshTokenRequest();
                //protectedRequest(); to think about a way to recursively call after refresh, but limit the amount of attempts
            } //Note: refreshTokenRequest has error handling to go to login, which helps prevent some of the issues with too much recursion.
        }
    });
}
/* 
postTokenRequest on called on user click
This function sends a username and password
in a form object to the JWT token request endpoint.
On receipt of the response from the post the 
initialSetJWTToken function is called. 
*/
function postTokenRequest() {
    console.log("clicked")
    var formData = new FormData();
    usernameVar = $('#loginForm').find('input[name="username"]').val();
    passwordVar = $('#loginForm').find('input[name="password"]').val();
    formData.append("username", usernameVar) // value is hardcoded, should query from the form
    formData.append("password", passwordVar) // value is hardcoded, should query from the form
    $.ajax({
        url: 'http://127.0.0.1:8000/api/token/',
        type: 'POST',
        dataType: "json",
        data: formData, //{identifier: "A12345", password: "112233"}
        processData: false,
        contentType: false, //beforeSend: function(xhr){xhr.setRequestHeader('X-Header', 'header-value');},    
        success: function(response) {
            initialSetJWTToken(response)
        }
    });
};
/*
This function is called if there is an authentication error with the initial protected
endpoint. This function gets the refresh token from the refresh cookies and try to obtain
new credentials.

If this is unsucessful (i.e. refresh expired) the page should redirect back 
to the login page to obtain a new pair of tokens. 
*/
function refreshTokenRequest() {
    var formData = new FormData();
    formData.append("refresh", getCookie("refresh")) // value is hardcoded, should query from the form
    $.ajax({
        url: 'http://127.0.0.1:8000/api/token/refresh/',
        type: 'POST',
        dataType: "json",
        data: formData, //{identifier: "A12345", password: "112233"}
        processData: false,
        contentType: false, //beforeSend: function(xhr){xhr.setRequestHeader('X-Header', 'header-value');},    
        success: function(response) {
            initialSetJWTToken(response)
        },
        error: function() {
            window.location.replace("http://127.0.0.1:8000/login/")
        }
    });
};

/*
The cookie functions below are helper functions for 
getting, setting and erasing cookies.
*/
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