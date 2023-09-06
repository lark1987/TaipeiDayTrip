let nextPage = 0;
nextPage = Math.min(nextPage, 5);
const cache = {}; // 创建一个缓存对象 (好像可以刪掉了)

// 从sessionStorage获取缓存数据
function getCacheData(url) {
    const cachedData = sessionStorage.getItem(url);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
}

// 将数据存储到sessionStorage
function setCacheData(url, data) {
    sessionStorage.setItem(url, JSON.stringify(data));
}

// 連線取得資料存入緩存，或使用緩存資料，得到data跟nextPage
function getData(url) {
    const cachedData = getCacheData(url);
    if (cachedData) { // 如果有缓存数据 直接使用缓存数据，不发送新的请求
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
            setCacheData(url, data); // 存入缓存
            handleData(data);
            console.log(data); // 待刪除
            console.log("有連線")// 待刪除
        })
        .catch(error => {
            console.error(error);
        });
    }
}

// 創建 div 載入資料
function handleData(data){

    nextPage = data.nextPage;
    data = data.data;

    const gridContainer = document.getElementById("gridContainer");
    let gridCount = 0;

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("main");

    data.forEach(function (item, index) {

        let Div = document.createElement("div");
        Div.classList.add("attraction");

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
        Div.appendChild(PictureDiv);
        Div.appendChild(NameDiv);
        Div.appendChild(InfoDiv);
        mainDiv.appendChild(Div);
    });
    
    gridContainer.appendChild(mainDiv);
    gridCount++;

}

const generateButton = document.getElementById("generateButton");
generateButton.addEventListener("click", () => {
    url="/api/attractions?page="+nextPage;
    console.log(url);
    getData(url);
});

console.log("456");









// // 處理資料呈現
// function handleData(data) {
//     let attraction_name = document.querySelectorAll(".attraction_name");
//     let attraction_info = document.querySelectorAll(".attraction_info");
//     let attraction_image = document.querySelectorAll(".attraction");

//     data.forEach(function (item, index) {
//         // 載入景點名稱
//         attraction_name[index].textContent = "　" + item.name;

//         // 載入景點資訊
//         const span1 = document.createElement("span");
//         span1.textContent = item.mrt;
//         const span2 = document.createElement("span");
//         span2.textContent = item.category;
//         attraction_info[index].appendChild(span1);
//         attraction_info[index].appendChild(span2);

//         // 載入景點圖片
//         const picture = document.createElement("img");
//         picture.setAttribute("src", item.images[0]);
//         attraction_image[index].appendChild(picture);
//     });
// }

// 網頁刷新加載資訊
// document.addEventListener("DOMContentLoaded", function () {
//     url="/api/attractions?page=0"
//     getData(url);
// });









// 下方是滾動到底部


// // IntersectionObserver 的回調函數
// const intersectionCallback = (entries, observer) => {
//         if (entries[0].isIntersecting) {
//             duplicateItems(); // 複製現有項目
//         }
// };

// // 創建 IntersectionObserver 實例
// const options = {
//     root: null, // 使用 viewport 作為根
//     rootMargin: '0px',
//     threshold: 1, // 當目標元素的 100% 可見時觸發回調
// };
// const observer = new IntersectionObserver(intersectionCallback, options);

// // 監視 content 區域
// const content = document.getElementById('content');
// observer.observe(content);

// // 複製現有項目並添加到 content
// function duplicateItems() {
//     console.log('页面已滚动到最下方');
//     console.log(nextPage);

    // url="/api/attractions?page="+nextPage
    // getData(url)

    // const items = document.querySelectorAll('.main');
    // const newItemFragment = document.createDocumentFragment(); // 创建一个新的文档片段，用于存储克隆的元素
    // items.forEach(item => {
    //     const newItem = item.cloneNode(true);
    //     newItemFragment.appendChild(newItem);
    // });
    
    // const content = document.getElementById('content');
    // content.appendChild(newItemFragment);

// }










// 關鍵字搜尋功能
// const search_button = document.getElementById("search_button");
// search_button.addEventListener("click", function () {

//     const search_input = document.getElementById("search_input");
//     const search_value = search_input.value;
//     url="/api/attractions?page=0&keyword="+search_value

//     console.log(search_value)

//     fetch(url, {
//         method: 'GET',
//     })
//     .then(response => {
//         return response.json();
//     })
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error(error);
//     });


// })