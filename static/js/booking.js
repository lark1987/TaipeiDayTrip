
// 取得預定行程 (按鈕測試)
const test1Button = document.querySelector(".test1");
test1Button.addEventListener("click", () => {
    
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
        console.log(data);
        getdata(data);
      })
    .catch(error => {
    console.log(error);
    });
})

// 刪除預定行程 (按鈕測試)
const test2Button = document.querySelector(".test2");
test2Button.addEventListener("click", () => {
    
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

// 預定資訊載入
function getdata(data){
    const attraction_picture = document.querySelector(".attraction_picture");
    attraction_picture.setAttribute("src",data.data.attraction.image);
    const attraction_name = document.querySelector(".attraction_name");
    attraction_name.textContent="台北一日遊："+data.data.attraction.name;
    const booking_date = document.querySelector(".booking_date");
    booking_date.textContent="日期："+data.data.date;
    const booking_time = document.querySelector(".booking_time");
    booking_time.textContent="時間："+data.data.time;
    const booking_price = document.querySelector(".booking_price");
    booking_price.textContent="費用："+data.data.price;
    const booking_address = document.querySelector(".booking_address");
    booking_address.textContent="地點："+data.data.attraction.address;
}

//測試按鈕
const test3Button = document.querySelector(".test3");
test3Button.addEventListener("click", () => {
})
