
// 取得網址路徑的景點編號
let id=window.location.pathname.split("/").pop();
let url="/api/attractions/"+id

getData(url)

// 連線取得資料、存入緩存，或使用緩存資料
function getData(url) {
    const cachedData = getCacheData(url);
    if (cachedData) {
        handleData(cachedData)
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

// 載入景點資料
function handleData(data){

    data=data.data;

    const attraction_name=document.querySelector(".attraction_name");
    attraction_name.textContent=data.name;

    const attraction_info=document.querySelector(".attraction_info");
    attraction_info.textContent=data.category+"　at　"+data.mrt;

    const attraction_description=document.querySelector(".attraction_description");
    attraction_description.textContent=data.description;

    const attraction_address=document.querySelector(".attraction_address");
    attraction_address.textContent=data.address;

    const attraction_transport=document.querySelector(".attraction_transport");
    attraction_transport.textContent=data.transport;

    const picture_container=document.querySelector("#picture_container");
    picture_data=data.images
    picture_data.forEach(function (item, index) {
      const picDIV = document.createElement("img");
      picDIV.classList.add("slide");
      picDIV.src =item
      picture_container.appendChild(picDIV);
    })

    const slides = document.querySelectorAll(".slide");
    window.slides = slides;

    showSlide(currentSlide);
    createDots();
}


// 圖片輪播
let currentSlide = 0; 
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotContainer = document.getElementById("dot_container");
function showSlide(index) {
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.display = "block";
    } else {
      slide.style.display = "none";
    }
  });
  updateDots(index); 
}
prevBtn.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});
nextBtn.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

// 圖片輪播點點
function createDots() {
    slides.forEach((slide, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        showSlide(i); 
      });
      dotContainer.appendChild(dot);
    });
}
function updateDots(index) {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
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
