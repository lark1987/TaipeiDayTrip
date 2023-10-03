
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

// 取得 TapPay Prime 金鑰
const bookingButton = document.querySelector(".booking_button");
bookingButton.addEventListener("click", function() {

    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)

    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return
    }
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        alert('get prime 成功，prime: ' + result.card.prime)

        getOrder(result.card.prime)
    })
});

// 發送 TapPay Prime 金鑰 
const cachedBookingdata=JSON.parse(sessionStorage.getItem("bookingdata"));
function getOrder(cardPrime){

    const inputMemberName = document.querySelector(".inputMemberName").value;
    const inputMemberMail = document.querySelector(".inputMemberMail").value;
    const inputMemberPhone = document.querySelector(".inputMemberPhone").value;

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
                "name": inputMemberName,
                "email":inputMemberMail,
                "phone":inputMemberPhone,
              }
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
      })
    .catch(error => {
        console.log(error);
    });
}