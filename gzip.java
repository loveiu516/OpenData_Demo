package controller;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class gzip {
	public boolean gzipfile(String sourceFileName,String destFileName) throws Exception 
	{
		boolean flag = true;
	try {
		FileInputStream fis = new FileInputStream(sourceFileName);
		FileOutputStream fos = new FileOutputStream(destFileName);
		GZIPOutputStream gos = new GZIPOutputStream(fos);

		doCopy(fis, gos); // copy and compress
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	return flag;
	}
	
	public boolean ungzipfile(String sourceFileName,String destFileName) 
	{
		boolean flag = true;
		byte[] buffer = new byte[1024];
		 
	     try{
	 
	    	 GZIPInputStream gzis = 
	    		new GZIPInputStream(new FileInputStream(sourceFileName));
	 
	    	 FileOutputStream out = 
	            new FileOutputStream(destFileName);
	 
	        int len;
	        while ((len = gzis.read(buffer)) > 0) {
	        
	        	out.write(buffer, 0, len);
	        }
	 
	        gzis.close();
	    	out.close();
	 
	    	System.out.println("Done");
	    	
	    }catch(Exception ex){
	       ex.printStackTrace();   
	    }
	return flag;
	}
	
	public void doCopy(InputStream is, OutputStream os) throws Exception {
		int oneByte;
		while ((oneByte = is.read()) != -1) {
			os.write(oneByte);
		}
		os.close();
		is.close();
	}
}
