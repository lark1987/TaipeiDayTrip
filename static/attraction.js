
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

    // const attraction_name = document.querySelectorAll(".attraction_name");

}













// 获取轮播图像和按钮的引用
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotContainer = document.getElementById("dot-container");

let currentSlide = 0; // 当前显示的幻灯片索引

// 初始化显示第一张幻灯片
showSlide(currentSlide);
createDots();

// 上一张按钮点击事件处理程序
prevBtn.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

// 下一张按钮点击事件处理程序
nextBtn.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

// 显示指定索引的幻灯片
function showSlide(index) {
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.display = "block";
    } else {
      slide.style.display = "none";
    }
  });
  updateDots(index); // 更新圆点指示器
}

function createDots() {
    slides.forEach((slide, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        showSlide(i); // 点击圆点时显示对应的幻灯片
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
