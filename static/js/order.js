
// TapPay 設置
TPDirect.setupSDK('137044', 'app_aYW5sz94fqr6ZtVWP0y9W95wXht3gqkjb8uPua3eHvpX5yGMTLwgCQ8dUIWa', 'sandbox')
TPDirect.card.setup({
    fields: {
        number: {
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: '#card-expiration-date',
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv'
        }
    }
    });

let inputName ="";
let inputMail ="";
let inputPhone ="";

// 行程訂購付款按鈕
const bookingButton = document.querySelector(".booking_button");
bookingButton.addEventListener("click", function() {

    inputName = document.querySelector(".inputMemberName").value;
    inputMail = document.querySelector(".inputMemberMail").value;
    inputPhone = document.querySelector(".inputMemberPhone").value;

    const checks = [inputName,inputMail,inputPhone]
    const isValid = checks.every(check=>contentCheck(check));
    if (!isValid) {return;}

    getPrime()

});

// 取得 TapPay Prime 金鑰
function getPrime(){

    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)

    if (tappayStatus.canGetPrime === false) {
        alert("付款資訊填寫錯誤")
        return
    }
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        getOrder(result.card.prime)
    })
}

// 發送 TapPay Prime 金鑰 
function getOrder(cardPrime){

    const cachedBookingdata=JSON.parse(sessionStorage.getItem("bookingdata"));
    const orderUrl = "/api/orders";
    fetch(orderUrl, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Authorization":token,
        },
        body:JSON.stringify({
            "prime": cardPrime,
            "order": {
              "price": cachedBookingdata.price,
              "trip": {
                "attraction": {
                  "id": cachedBookingdata.attraction.id,
                  "name": cachedBookingdata.attraction.name,
                  "address": cachedBookingdata.attraction.address,
                  "image": cachedBookingdata.attraction.image,
                },
                "date": cachedBookingdata.date,
                "time": cachedBookingdata.time,
              },
              "contact": {
                "name": inputName,
                "email":inputMail,
                "phone":inputPhone,
              }
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        window.location.href = "/thankyou?number=" + data.data.number;
      })
    .catch(error => {
        console.log(error);
    });
}

// 檢核輸入框
function contentCheck(content){
    if (content === "") {
        alert("聯絡資訊尚未填寫");
        return false;
    }
    return true;
}