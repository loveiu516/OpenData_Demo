package controller;

public class main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
    download dl = new download();
    gzip gz = new gzip();
    //gzip�ɮ׮榡�ϥ�
    dl.download_gzip("http://data.taipei/youbike", "D:\\youbike1.gz");
    //�Dgzip�ɮ׮榡�ϥ�
    //dl.download("url", "D:\\tmp.gz");
    gz.ungzipfile("D:\\youbike1.gz", "D:\\youbike.json");
	}

}
