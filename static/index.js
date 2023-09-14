
let nextPage = 0;
let search_value = "";

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

// 連線取得資料、存入緩存，或使用緩存資料
function getData(url) {
    const cachedData = getCacheData(url);
    if (cachedData) {
        if(url==="/api/mrts"){
            handleMRT(cachedData);
            return;
        }
        handleData(cachedData);
        return;
    }
    else{fetch(url, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(url==="/api/mrts"){
                setCacheData(url, data); 
                handleMRT(data);
                return;
            }
            setCacheData(url, data); 
            handleData(data);
        })
        .catch(error => {
            console.error(error);
        });
    }
}

// 創建 div 載入景點資料
function handleData(data){

    nextPage = data.nextPage;
    data = data.data;

    const gridContainer = document.getElementById("gridContainer");

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("main");

    data.forEach(function (item, index) {

        let attractionDiv = document.createElement("div");
        attractionDiv.classList.add("attraction");

        // 景點超連結
        attractionDiv.addEventListener("click", function() {
            const currentURL = window.location.href;
            const targetUrl = currentURL+"attraction/"+item.id;
            window.location.href = targetUrl;
        });

        let img_container = document.createElement("div");
        img_container.classList.add("img_container");

        // 載入景點圖片
        let PictureDiv = document.createElement("img");
        PictureDiv.setAttribute("src",item.images[0]);

        // 載入景點名稱
        let NameDiv = document.createElement("div");
        NameDiv.classList.add("attraction_name");
        let NameText = document.createTextNode(item.name); 
        NameDiv.appendChild(NameText);

        img_container.appendChild(PictureDiv);
        img_container.appendChild(NameDiv);

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
        attractionDiv.appendChild(img_container);
        attractionDiv.appendChild(InfoDiv);
        mainDiv.appendChild(attractionDiv);

    });
    
    gridContainer.appendChild(mainDiv);

}

// 看見底部加載資料
let isClickable = true;
const targetElement = document.getElementById("footer");
const observer = new IntersectionObserver(entries => {
    const targetEntry = entries[0];
    if (targetEntry.isIntersecting) {

        // 防止連續呼叫
        if (isClickable) {
            isClickable = false;

            let url="/api/attractions?"

            if(search_value !== null && nextPage !== null){
                url+="keyword="+search_value+"&page="+nextPage;
                getData(url);
            }
            else if(nextPage !== null) {
                url+="page="+nextPage;
                getData(url);
            }
        }       
            setTimeout(() => {isClickable = true;}, 2000); 
    }
});
observer.observe(targetElement);


// 關鍵字搜尋按鈕
const search_button = document.getElementById("search_button");
search_button.addEventListener("click", function(){
        const search_input = document.getElementById("search_input");
        search_value = search_input.value;
        searchData(search_value)
})

// 關鍵字搜尋加載資料
function searchData (search_value) {
    url="/api/attractions?page=0&keyword="+search_value

    const mains = document.querySelectorAll(".main");
    mains.forEach(main => {
        main.parentNode.removeChild(main);
    })

    getData(url);
}


// 捷運站列表水平滾動
const scrollContainer = document.querySelector(".scroll_container");
const scrollLeftButton = document.querySelector("#scroll_left");
const scrollRightButton = document.querySelector("#scroll_right");
const list_container = document.querySelector(".list_container");

scrollLeftButton.addEventListener("click", () => {
    list_container.scrollBy({
    left: -200, 
    behavior: "smooth", 
  });
});

scrollRightButton.addEventListener("click", () => {
    list_container.scrollBy({
    left: 200, 
    behavior: "smooth", 
  });
});

window.addEventListener("load", () => {
        url="/api/mrts"
        getData(url);
})


// 創建 div 載入捷運列表
function handleMRT(data){

    data=data.data
    data.forEach(itemText => {
        let item = document.createElement("li");
        item.textContent = itemText;
        list_container.appendChild(item);
    });
}

// 捷運列表點擊處理
list_container.addEventListener("click", function(event) {
    if (event.target.tagName === "LI") {
        search_value = event.target.innerText;
        searchData(search_value)
    }
});

// 首頁按鈕
const header_LOGO = document.querySelector(".header_LOGO");
header_LOGO.addEventListener("click", ()=>{

const protocol = window.location.protocol; 
const host = window.location.host;
const homepageURL = `${protocol}//${host}`;

window.location.href = homepageURL; 
})  



  