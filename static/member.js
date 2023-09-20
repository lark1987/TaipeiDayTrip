window.addEventListener("load", () => {
    tokenCheck()
})

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
            logoutButtonSet()
          })
        .catch(error => {
        console.log(error);
        });
    }
    else{
        loginButtonSet()
    }
}
//頂端列的登出按鈕
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



//會員註冊功能
const signUpButton = document.getElementById("signUp_Button");
signUpButton.addEventListener("click", () => {

    const signUpName = document.getElementById("signUp_Name").value;
    const signUpMail = document.getElementById("signUp_Mail").value;
    const signUpPassword = document.getElementById("signUp_Password").value;

    const checks = [
        { regex:regexName, content:signUpName },
        { regex:regexMail, content:signUpMail },
        { regex:regexPassword, content:signUpPassword }
    ];

    const isValid = checks.every(check=>contentCheck(check.regex, check.content));
    
    if (!isValid) {
        return;
    }

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
        if (data.ok) {
            document.querySelector(".signUp_remind").classList.add("hide");
            document.querySelector(".signUp_success").classList.remove("hide");
        }
        else if(data.error){
            alert(data.message)
        }
      })
    .catch(error => {
    console.log(error);
    });

});

//會員登入功能，存入token
const signInButton = document.getElementById("signIn_Button");
signInButton.addEventListener("click", () => {

    const signInMail = document.getElementById("signIn_Mail").value;
    const signInPassword = document.getElementById("signIn_Password").value;

    const checks = [
        { regex:regexMail, content:signInMail },
        { regex:regexPassword, content:signInPassword }
    ];

    const isValid = checks.every(check=>contentCheck(check.regex, check.content));
    
    if (!isValid) {
        return;
    }

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
            location.reload();
        }
        else if(data.error){
            alert(data.message)
        }
      })
    .catch(error => {
    console.log(error);
    });

});



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
//彈出畫面的關閉按鈕
const closePopupButtons = document.querySelectorAll(".close");
closePopupButtons.forEach(button => {
    button.addEventListener("click", () => {
    document.querySelector(".overlay").classList.add("hide");
    document.querySelector(".signIn_container").classList.add("hide");
    document.querySelector(".signUp_container").classList.add("hide");
  });
});



const regexName = /^[\p{L}0-9]+$/u;  //可輸入文字數字
const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^[A-Za-z0-9]+$/  // 可輸入英文大小寫和數字
//彈出畫面的輸入框檢核
function contentCheck(regex,content){
    if (content === "") {
        alert("未填寫資料");
        return false;
    }
    if (!regex.test(content)) {
        alert("輸入格式錯誤");
        return false;
    }
    return true;   
}