
//測試按鈕：行程資料

const testButton = document.querySelector(".test");
testButton.addEventListener("click", () => {
    
    let token = localStorage.getItem("token");
    const bookingUrl = "/api/booking";
    fetch(bookingUrl, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json",
            "Authorization":token
        },
        // body: JSON.stringify({
        //     "attractionId": attractionId,
        //     "date": bookingDate,
        //     "time": bookingTime,
        //     "price": bookingPrice
        // })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // if (data.ok) {
        //     console.log(data.ok);
        // }
        // else if(data.error){
        //     console.log(data.error)
        // }
      })
    .catch(error => {
    console.log(error);
    });
})