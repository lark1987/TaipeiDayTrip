//創建DIV
function createGrid(){

    const gridContainer = document.getElementById("gridContainer");
    let gridCount = 0;

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("main");

    for (let i = 0; i < 12; i++) {

        let Div = document.createElement("div");
        Div.classList.add("attraction", "t");

        let NameDiv = document.createElement("div");
        NameDiv.classList.add("attraction_name");

        let InfoDiv = document.createElement("div");
        InfoDiv.classList.add("attraction_info");

        // 将 t1NameDiv 和 t1InfoDiv 添加到 t1Div
        Div.appendChild(NameDiv);
        Div.appendChild(InfoDiv);
        mainDiv.appendChild(Div);
    }
    
    gridContainer.appendChild(mainDiv);
    gridCount++;

}

const generateButton = document.getElementById("generateButton");
generateButton.addEventListener("click", () => {
    createGrid();
})