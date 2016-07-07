# OpenData_Demo

介接臺北市政府資料開放平臺資料範例程式碼，包含node js及java等程式碼。node js部分原始作者為台大計資中心網路組。

node js說明:

fetech.js 為排程呼叫器，介接功能為bus.js，包含下載、解壓縮、寫入資料庫，資料庫使用mysql db及redis，

fetch.js為介接臺北市政府公車資料，fetch_ntp.js為介接新北市政府公車資料。

執行方式：設定好mysql資料庫後(stop,route,ntp_stop,ntp_route(是的，新北台北請分開資料表儲存))，

將檔案放在同一個資料夾下，分別RUN fetch.js及fetch_ntp.js，系統就會自動將資料寫入資料庫

ps.bus_ntp因新北市政府限制每次最多下載2000筆，故單次介接中會下載多次資料。

歡迎有興趣的人參考應用。

Java說明:

簡單的下載、解壓縮，可以將臺北市政府資料開放平台上的資料下載回來應用，

使用的都是Java內建的method，所以不需額外的jar檔，download.java可以將資料下載回來，gzip.java可以解壓縮gz檔案格式，

main則是使用範例。

值得注意的是，因為臺北市政府的部分資料是放在雲端上，經過轉址且有壓縮成GZ檔案格式，部分資料是放在平台上，

所以在取用的時候要注意資料是不是GZ檔案喔。
