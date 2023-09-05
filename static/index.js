// 連線取得資料
let nextPage = ""
function getData(url){
    fetch(url, {
        method: 'GET',
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data); //待刪除
        nextPage=data.nextPage
        data=data.data

        let attraction_name = document.querySelectorAll(".attraction_name");
        let attraction_info = document.querySelectorAll(".attraction_info");
        let attraction_image = document.querySelectorAll(".attraction");

        data.forEach(function(item, index) {

            // 載入景點名稱
            attraction_name[index].textContent="　"+item.name;

            // 載入景點資訊
            const span1 = document.createElement("span");
            span1.textContent = item.mrt;
            const span2 = document.createElement("span");
            span2.textContent = item.category;
            attraction_info[index].appendChild(span1);
            attraction_info[index].appendChild(span2);

            // 載入景點圖片
            const picture = document.createElement("img");
            picture.setAttribute("src", item.images[0]);
            attraction_image[index].appendChild(picture);
        })
    })
    .catch(error => {
        console.error(error);
    });
}

// 網頁刷新加載資訊
document.addEventListener("DOMContentLoaded", function () {
    url="/api/attractions?page=0"
    getData(url);
});




// IntersectionObserver 的回調函數
const intersectionCallback = (entries, observer) => {
        if (entries[0].isIntersecting) {
            duplicateItems(); // 複製現有項目
        }
};

// 創建 IntersectionObserver 實例
const options = {
    root: null, // 使用 viewport 作為根
    rootMargin: '0px',
    threshold: 1, // 當目標元素的 100% 可見時觸發回調
};
const observer = new IntersectionObserver(intersectionCallback, options);

// 監視 content 區域
const content = document.getElementById('content');
observer.observe(content);

// 複製現有項目並添加到 content
function duplicateItems() {
    console.log('页面已滚动到最下方');
    console.log(nextPage);
    // url="/api/attractions?page="+nextPage
    // getData(url)

    // const items = document.querySelectorAll('.main');
    // items.forEach(item => {
    //     const newItem = item.cloneNode(true); // 複製現有項目
    //     getData(url)
    // });

}
