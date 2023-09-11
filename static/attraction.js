
// 取得網址路徑的景點編號
let id=window.location.pathname.split("/").pop();
let url="/api/attractions/"+id
getData(url)

// 連線取得資料、存入緩存，或使用緩存資料
function getData(url) {
    const cachedData = getCacheData(url);
    if (cachedData) {
        handleData(cachedData)
        console.log("沒有連線")
        return;
    }
    else{fetch(url, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setCacheData(url, data); 
            handleData(data)
            console.log("有連線")
        })
        .catch(error => {
            console.error(error);
        });
    }
}

// 獲取緩存資料
function getCacheData(url) {
    const cachedData=sessionStorage.getItem(url);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
}

// 儲存緩存資料
function setCacheData(url, data) {
    sessionStorage.setItem(url, JSON.stringify(data));
}

// 創建 div 載入景點資料 (尚缺圖片處理)
function handleData(data){

    data = data.data;
    console.log(data)

    const attraction_name = document.querySelectorAll(".attraction_name");
    attraction_name[0].textContent=data.name;

    const attraction_info = document.querySelectorAll(".attraction_info");
    attraction_info[0].textContent=data.category+"at"+data.mrt;

    const attraction_description = document.querySelectorAll(".attraction_description");
    attraction_description[0].textContent=data.description;

    const attraction_address = document.querySelectorAll(".attraction_address");
    attraction_address[0].textContent=data.address;

    const attraction_transport = document.querySelectorAll(".attraction_transport");
    attraction_transport[0].textContent=data.transport;

}













// 選擇時間顯示導覽費用
const morning = document.getElementById("morning");
const afternoon = document.getElementById("afternoon");
const fee = document.getElementById("fee");
morning.addEventListener("change", updateFee);
afternoon.addEventListener("change", updateFee);
function updateFee() {
    if (morning.checked) {
        fee.textContent = "新台幣 2000 元";
    } else if (afternoon.checked) {
        fee.textContent = "新台幣 2500 元";
    }
}
