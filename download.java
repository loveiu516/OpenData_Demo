package controller;

import java.io.BufferedInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


public class download {
	
	public static String getFinalURL(String url) throws IOException {
	    HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
	    con.setInstanceFollowRedirects(false);
	    con.connect();
	    con.getInputStream();

	    if (con.getResponseCode() == HttpURLConnection.HTTP_MOVED_PERM || con.getResponseCode() == HttpURLConnection.HTTP_MOVED_TEMP) {
	        String redirectUrl = con.getHeaderField("Location");
	        return getFinalURL(redirectUrl);
	    }
	    return url;
	}
	

	public boolean download_gzip(String urlstr,String destFileName)
	{
		boolean flag =true;
		try {
			URLConnection con = new URL( getFinalURL(urlstr) ).openConnection();
			System.out.println( "orignal url: " + con.getURL() );
			con.connect();
			System.out.println( "connected url: " + con.getURL() );
			InputStream is = con.getInputStream();
			System.out.println( "redirected url: " + con.getURL() );
			byte[] b = new byte[2048];
			int length;
			OutputStream os = new FileOutputStream(destFileName);
			while ((length = is.read(b)) != -1) {
				System.out.print(b);
				os.write(b, 0, length);
			}
			is.close();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return flag;
	}
  
	public boolean download(String urlstr,String destFileName)
	{
		boolean flag = true;
		try {
			URL url = new URL(urlstr);
			InputStream is = url.openStream();
			OutputStream os = new FileOutputStream(destFileName);

			byte[] b = new byte[2048];
			int length;

			while ((length = is.read(b)) != -1) {
				os.write(b, 0, length);
			}

			is.close();
			os.close();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return flag;
	}
	
}
