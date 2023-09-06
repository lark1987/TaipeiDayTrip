
let nextPage = 0;

// 獲取緩存資料
function getCacheData(url) {
    const cachedData = sessionStorage.getItem(url);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
}

// 儲存緩存資料
function setCacheData(url, data) {
    sessionStorage.setItem(url, JSON.stringify(data));
}

// 連線取得資料、存入緩存，或使用緩存資料
function getData(url) {
    const cachedData = getCacheData(url);
    if (cachedData) {
        handleData(cachedData);
        console.log(cachedData); //待刪除
        console.log("沒有連線")
        return;
    }
    else{fetch(url, {
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setCacheData(url, data); 
            handleData(data);
            console.log(data); // 待刪除
            console.log("有連線")
        })
        .catch(error => {
            console.error(error);
        });
    }
}

// 創建 div 載入資料
function handleData(data){

    nextPage = data.nextPage;
    nextPage = Math.min(nextPage, 5);
    data = data.data;
    
    const gridContainer = document.getElementById("gridContainer");

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("main");

    data.forEach(function (item, index) {

        let attractionDiv = document.createElement("div");
        attractionDiv.classList.add("attraction");

        // 載入景點圖片
        let PictureDiv = document.createElement("img");
        PictureDiv.setAttribute("src",item.images[0]);

        // 載入景點名稱
        let NameDiv = document.createElement("div");
        NameDiv.classList.add("attraction_name");
        let NameText = document.createTextNode(item.name); 
        NameDiv.appendChild(NameText);

         // 載入景點資訊
        let InfoDiv = document.createElement("div");
        InfoDiv.classList.add("attraction_info");
        let span1 = document.createElement("span");
        span1.textContent = item.mrt;
        let span2 = document.createElement("span");
        span2.textContent = item.category;
        InfoDiv.appendChild(span1);
        InfoDiv.appendChild(span2);

        // 全部放進 main
        attractionDiv.appendChild(PictureDiv);
        attractionDiv.appendChild(NameDiv);
        attractionDiv.appendChild(InfoDiv);
        mainDiv.appendChild(attractionDiv);
    });
    
    gridContainer.appendChild(mainDiv);

}

// 網頁刷新加載資訊
// document.addEventListener("DOMContentLoaded", function () {
//     url="/api/attractions?page=0"
//     getData(url);
// });


// 滾動到底部加載資料
let isClickable = true;
const targetElement = document.getElementById('footer');
const observer = new IntersectionObserver(entries => {
    const targetEntry = entries[0];
    if (targetEntry.isIntersecting) {

        console.log("底部區域")

        // 防止連續點擊
        if (isClickable) {
            isClickable = false;

            console.log("延遲測試")
            url="/api/attractions?page="+nextPage;
            console.log(url);// 待刪除
            getData(url);
    
            setTimeout(() => {isClickable = true;}, 3000); 
        }
    } 
});
observer.observe(targetElement);



// 關鍵字搜尋功能
const search_button = document.getElementById("search_button");
search_button.addEventListener("click", function () {

    const search_input = document.getElementById("search_input");
    const search_value = search_input.value;
    url="/api/attractions?page=0&keyword="+search_value

    console.log(search_value)
    // getData(url);
})