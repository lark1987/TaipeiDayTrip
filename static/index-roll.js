//創建DIV
function createGrid(){

    const gridContainer = document.getElementById("gridContainer");
    let gridCount = 0;

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("main");

    for (let i = 0; i < 12; i++) {

        let Div = document.createElement("div");
        Div.classList.add("attraction");

        let PictureDiv = document.createElement("img");
        PictureDiv.setAttribute("src","https://janstockcoin.com/wp-content/uploads/2021/06/pexels-photo-747964-scaled.jpeg");

        let NameDiv = document.createElement("div");
        NameDiv.classList.add("attraction_name");
        let NameText = document.createTextNode("name"); 
        NameDiv.appendChild(NameText);

        let InfoDiv = document.createElement("div");
        InfoDiv.classList.add("attraction_info");
        let InfoText = document.createTextNode("info"); 
        InfoDiv.appendChild(InfoText);

        Div.appendChild(PictureDiv);
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