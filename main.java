package controller;

public class main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
    download dl = new download();
    gzip gz = new gzip();
    // for cloud file(gz file) download
    dl.download_gzip("http://data.taipei/youbike", "D:\\youbike1.gz");
    // for non-cloud file download
    //dl.download("url", "D:\\tmp.gz");
    gz.ungzipfile("D:\\youbike1.gz", "D:\\youbike.json");
	}

}
