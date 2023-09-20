// header
const header = document.querySelector(".header_load");
header.innerHTML = `
    <header>
    <div class="header_content">
        <div class="header_LOGO">台北一日遊</div>
        <div class="header_option">
            <span>預定行程　</span>
            <span class="loginButton">登入/註冊</span>
        </div>
    </div>
    </header>
`;
// footer
const footer = document.querySelector(".footer_load");
footer.innerHTML = `
    <footer id="footer"> COPYRIGHT @ 2023台北一日遊  </footer>
`;
// popup
const popup = document.querySelector(".popup_load");
popup.innerHTML = `
    <div class="signUp_container hide popup" >
    <div>
        <span class="bigtext">註冊會員帳號</span>
        <span class="close">&times;</span><br>
    </div>
    <input type="text" id="signUp_Name" placeholder="輸入姓名"><br>
    <input type="text" id="signUp_Mail" placeholder="輸入電子信箱"><br>
    <input type="text" id="signUp_Password" placeholder="輸入密碼"><br>
    <button id="signUp_Button">註冊新帳戶</button></br>
    <div>
        <span class="signUp_remind">已經有帳戶了？</span>
        <span class="signUp_success hide">註冊成功！</span>
        <span class="signUp_signIn">點此登入</span>
    </div>
    </div>
    <div class="overlay hide"></div>

    <div class="signIn_container hide popup">
    <div>
        <span class="bigtext">登入會員帳號</span>
        <span class="close">&times;</span><br>
    </div>
    <input type="text" id="signIn_Mail" placeholder="輸入電子信箱"><br>
    <input type="text" id="signIn_Password" placeholder="輸入密碼"><br>
    <button id="signIn_Button">登入帳戶</button></br>
    <div>
        <span class="signIn_remind">還沒有帳戶？</span>
        <span class="signIn_message hide"></span>
        <span class="signIn_signUp">點此註冊</span>
    </div>
    </div>
    <div class="overlay hide"></div>
`;

// 首頁按鈕
const header_LOGO = document.querySelector(".header_LOGO");
header_LOGO.addEventListener("click", ()=>{

const protocol = window.location.protocol; 
const host = window.location.host;
const homepageURL = `${protocol}//${host}`;

window.location.href = homepageURL; 
})  