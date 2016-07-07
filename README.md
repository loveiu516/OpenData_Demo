# OpenData_Demo

介接臺北市政府資料開放平臺資料範例程式碼，包含node js及java等程式碼。node js部分原始作者為台大計資中心網路組。

node js說明:

fetech.js 為排程呼叫器，介接功能為bus.js，包含下載、解壓縮、寫入資料庫，資料庫使用mysql db及redis，

fetch.js為介接臺北市政府公車資料，fetch_ntp.js為介接新北市政府公車資料。

bus_ntp因新北市政府限制每次最多下載2000筆，故單次介接中會下載多次資料。

歡迎有興趣的人參考應用。
