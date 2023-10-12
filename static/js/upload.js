
upload_button = document.querySelector(".upload_button");
upload_button.addEventListener("click", function() {
    uploadFile()
})

function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (!file) {
        alert('請選擇一個檔案');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        
        document.getElementById('upload-status').innerText = data.message;
    })
    .catch(error => {
        console.error('錯誤：', error);
    });
}