
// 頁面載入資格確認
let token = localStorage.getItem("token");
if(token){
    getbooking()
}
else{
    const protocol = window.location.protocol; 
    const host = window.location.host;
    const homepageURL = `${protocol}//${host}`;
    window.location.href = homepageURL; 
}

// 取得預定行程
function getbooking(){
    let token = localStorage.getItem("token");
    const bookingUrl = "/api/booking";
    fetch(bookingUrl, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json",
            "Authorization":token
        },
    })
    .then(response => response.json())
    .then(data => {
        if(data){
            getdata(data);
        }
      })
    .catch(error => {
    console.log(error);
    });
}

// 載入預定資訊
function getdata(data){
    const attraction_picture = document.querySelector(".attraction_picture");
    attraction_picture.setAttribute("src",data.data.attraction.image);
    const attraction_name = document.querySelector(".attraction_name");
    attraction_name.textContent="台北一日遊："+data.data.attraction.name;
    const booking_date = document.querySelector(".booking_date");
    booking_date.textContent=data.data.date;
    const booking_time = document.querySelector(".booking_time");
    booking_time.textContent=data.data.time;
    const booking_price = document.querySelector(".booking_price");
    booking_price.textContent=data.data.price;
    const booking_address = document.querySelector(".booking_address");
    booking_address.textContent=data.data.attraction.address;
    getMemberCache()
}

// 刪除預定行程
const bookingDeleteButton = document.querySelector(".booking_delete");
bookingDeleteButton.addEventListener("click", () => {
    
    let token = localStorage.getItem("token");
    const bookingUrl = "/api/booking";
    fetch(bookingUrl, {
        method: "DELETE", 
        headers: {
            "Content-Type": "application/json",
            "Authorization":token
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
      })
    .catch(error => {
    console.log(error);
    });
})

// 載入會員資料
function getMemberCache() {
    const cachedData=sessionStorage.getItem("memberData");
    if (cachedData) {
        const data=JSON.parse(cachedData)
        const helloMemberName = document.querySelector(".helloMemberName");
        helloMemberName.textContent=data.data.name;
        const inputMemberName = document.querySelector(".inputMemberName");
        inputMemberName.placeholder =data.data.name;
        const inputMemberMail = document.querySelector(".inputMemberMail");
        inputMemberMail.placeholder =data.data.email;
    }
}