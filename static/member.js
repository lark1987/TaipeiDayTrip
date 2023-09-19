window.addEventListener("load", () => {
    tokenCheck()
})

//會員註冊
const signUpButton = document.getElementById("signUp_Button");
signUpButton.addEventListener("click", () => {

    const signUpName = document.getElementById("signUp_Name").value;
    const signUpMail = document.getElementById("signUp_Mail").value;;
    const signUpPassword = document.getElementById("signUp_Password").value;;

    const signUpUrl = "/api/user";

    fetch(signUpUrl, {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "name": signUpName,  
            "email": signUpMail,
            "password": signUpPassword
            })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); 
        document.querySelector(".signUp_remind").classList.add("hide");
        document.querySelector(".signUp_success").classList.remove("hide");
      })
    .catch(error => {
    console.log(error);
    });

});

//會員登入，存入token
const signInButton = document.getElementById("signIn_Button");
signInButton.addEventListener("click", () => {

    const signInMail = document.getElementById("signIn_Mail").value;;
    const signInPassword = document.getElementById("signIn_Password").value;;

    const signInUrl = "/api/user/auth";

    fetch(signInUrl, {
        method: "PUT", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "email": signInMail,
            "password": signInPassword
            })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            let token = data.token;
            localStorage.setItem("token", token);
            console.log(data.token)
            location.reload();
        }
        else if(data.error){
            console.log(data.message)
        }
      })
    .catch(error => {
    console.log(error);
    });

});

//提供token，得到會員資訊，確認會員狀態
const loginButton = document.querySelector(".loginButton");
function tokenCheck(){
    let token = localStorage.getItem("token");
    if(token){
        const signInUrl = "/api/user/auth";
        fetch(signInUrl, {
            method: "GET", 
            headers: {
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
        // .then(response => response.json())
        .then(data => {
            console.log(data); 
            logoutButtonSet()
          })
        .catch(error => {
        console.log(error);
        });
    }
    else{
        console.log("token不存在");
        loginButtonSet()
    }
}

//登出功能
function logoutButtonSet(){
    loginButton.textContent="登出帳戶";
    loginButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        location.reload();
    })
}
//頂端列的登入按鈕
function loginButtonSet(){
    loginButton.textContent="登入/註冊";
    loginButton.addEventListener("click", () => {
        document.querySelector(".signIn_container").classList.remove("hide");
        document.querySelector(".signUp_container").classList.add("hide");
        document.querySelector(".overlay").classList.remove("hide");
    })
}
//登入頁面的註冊按鈕
const signIn_signUp_button = document.querySelector(".signIn_signUp");
signIn_signUp_button.addEventListener("click", () => {
    document.querySelector(".signIn_container").classList.add("hide");
    document.querySelector(".signUp_container").classList.remove("hide");
    document.querySelector(".overlay").classList.remove("hide");
})
//註冊頁面的登入按鈕
const signUp_signIn_button = document.querySelector(".signUp_signIn");
signUp_signIn_button.addEventListener("click", () => {
    document.querySelector(".signIn_container").classList.remove("hide");
    document.querySelector(".signUp_container").classList.add("hide");
    document.querySelector(".overlay").classList.remove("hide");
})

//關閉按鈕
const closePopupButtons = document.querySelectorAll(".close");
closePopupButtons.forEach(button => {
    button.addEventListener("click", () => {
    document.querySelector(".overlay").classList.add("hide");
    document.querySelector(".signIn_container").classList.add("hide");
    document.querySelector(".signUp_container").classList.add("hide");
  });
});
