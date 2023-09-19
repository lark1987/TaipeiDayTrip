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
        let token = data.token;
        localStorage.setItem("token", token);
        // console.log(data); 
        // console.log(token); 

      })
    .catch(error => {
    console.log(error);
    });

});

//提供token，得到會員資訊
function tokenCheck(){
    let token = localStorage.getItem("token");
    console.log(token);

    if(token){
        const signInUrl = "/api/user/auth";
        fetch(signInUrl, {
            method: "GET", 
            headers: {
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            const loginCheck=document.querySelector(".loginCheck");
            loginCheck.textContent="登出帳號";


          })
        .catch(error => {
        console.log(error);
        });
    }
    else{
        console.log("token不存在");
        const loginCheck=document.querySelector(".loginCheck");
        loginCheck.textContent="登入/註冊";
    }

}

//登入登出按鈕🚩🚩🚩
const testB = document.getElementById("testB");
testB.addEventListener("click", () => {
    localStorage.removeItem("token");
});

//測試按鈕
const testA = document.getElementById("testA");
testA.addEventListener("click", () => {
console.log("測試")
});
