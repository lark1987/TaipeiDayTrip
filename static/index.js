




// 網頁刷新加載資訊
document.addEventListener("DOMContentLoaded", function () {

    fetch("/api/attractions?page=0", {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data=data.data
        console.log(data); //待刪除

        let attraction_name = document.querySelectorAll(".attraction_name");
        let attraction_info = document.querySelectorAll(".attraction_info");
        let attraction_image = document.querySelectorAll(".t");

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
});

