
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
