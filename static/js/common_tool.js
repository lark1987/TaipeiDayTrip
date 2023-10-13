// 儲存緩存資料
export function setCacheData(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
}

// 獲取緩存資料
export function getCacheData(key) {
    const data=sessionStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
}