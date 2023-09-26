
getbooking()

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
        console.log(data);
        getdata(data);
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



//測試按鈕
const test3Button = document.querySelector(".test3");
test3Button.addEventListener("click", () => {
})
