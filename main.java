package controller;

public class main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
    download dl = new download();
    gzip gz = new gzip();
    //gzip檔案格式使用
    dl.download_gzip("http://data.taipei/youbike", "D:\\youbike1.gz");
    //非gzip檔案格式使用
    //dl.download("url", "D:\\tmp.gz");
    gz.ungzipfile("D:\\youbike1.gz", "D:\\youbike.json");
	}

}
