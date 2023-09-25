
// 建立行程按鈕
let token = localStorage.getItem("token");
const bookingButton = document.querySelector(".booking_button");
bookingButton.addEventListener("click", () => {

    const attractionId=window.location.pathname.split("/").pop();
    const bookingDate = document.querySelector(".booking_date").value;
    const radioInputs = document.querySelectorAll('input[type="radio"][name="time"]');
    let bookingTime = "";
    let bookingPrice = "";
    if (radioInputs[0].checked) {
        bookingTime = "morning"
        bookingPrice = "2000"
        };
    if (radioInputs[1].checked) {
        bookingTime = "afternoon"
        bookingPrice = "2500"
        };

    const bookingUrl = "/api/booking";
    fetch(bookingUrl, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Authorization":token
        },
        body: JSON.stringify({
            "attractionId": attractionId,
            "date": bookingDate,
            "time": bookingTime,
            "price": bookingPrice
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.ok) {
            console.log(data.ok);
        }
        else if(data.error){
            console.log(data.error)
        }
      })
    .catch(error => {
    console.log(error);
    });

})