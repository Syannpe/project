import java.io.*;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

class ArtPage {
    public String baseUrl = "http://www.yac8.com/news/";
    public int pageNum = 0;
    public String[] urls;
    public int nameCounter = 0;
    public String downloadDir = "./download/";

    public void downloadImage(String imageUrl, String filename) throws IOException {
        try (InputStream in = Jsoup.connect(imageUrl).ignoreContentType(true).execute().bodyStream();
             OutputStream out = new FileOutputStream(downloadDir + filename)) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        }
    }

    public void setHttpHeader(org.jsoup.Connection.Request request) {
        request.header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188");
        request.header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
        request.header("Accept-Encoding", "gzip, deflate, br");
        request.header("Accept-Language", "en-US,en;q=0.9");
        request.header("Cache-Control", "max-age=0");
        request.header("Connection", "keep-alive");
        request.header("Cookie", "ASPSESSIONIDQWQRTBCS=GAKECIPBOFGLGEHBOCOEHDJG; ASPSESSIONIDSSVQSBDT=HGKECIPBNIEIEHHHGNGHECNC; ASPSESSIONIDQWTRSADS=DNCFCIPBGPLCOILIBAMIIFBA; ASPSESSIONIDSWSRTBCS=EKNCDIPBOHHNDGCNEGCNDDCJ; ASPSESSIONIDQWRQTACT=EBLECIPBLKKMFADPACDEDBDN; ASPSESSIONIDQSVTQACT=FCLECIPBJGNOJDGHKELJGLDH");
        request.header("Connection", "keep-alive");
        request.header("Host", "www.yac8.com");
    }

    public void scrapeImages(String url, int pageNum) throws IOException {
        org.jsoup.Connection connection = Jsoup.connect(url);
        setHttpHeader(connection.request());
        Document document = connection.get();

        Element titleElement = document.select("title").first();
        String title = titleElement.text().replaceAll("\\(\\d+\\)?", "").trim().replaceAll("[.:\\-\\?,\\\\/]", " - ");

        downloadDir = "./download/" + title + "/";

        System.out.println("-".repeat(10) + title + "第" + pageNum + "页" + "-".repeat(10));

        Elements imageElements = document.select("img");
        System.out.println("找到图片" + imageElements.size() + "个");

        for (Element img : imageElements) {
            String src = img.attr("src");
            String imageUrl = new java.net.URL(new java.net.URL(url), src).toString();
            String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            downloadImage(imageUrl, ++nameCounter + ".jpg");
            System.out.println("下载了：" + filename);
        }
    }

    public int getPageNum() throws IOException {
        org.jsoup.Connection connection = Jsoup.connect(baseUrl + ".html");
        setHttpHeader(connection.request());
        Document document = connection.get();

        Elements divs = document.select("table.pageNavBox td div");

        for (Element div : divs) {
            int pageNum = Integer.parseInt(div.text());
            this.pageNum = Math.max(this.pageNum, pageNum);
        }

        System.out.println(this.pageNum);
        return this.pageNum;
    }

    public String[] initUrls() {
        urls = new String[pageNum];
        for (int i = 0; i < pageNum; i++) {
            urls[i] = baseUrl + (i != 0 ? "_" + (i + 1) : "") + ".html";
        }
        return urls;
    }

    public ArtPage(String url) {
        baseUrl += url;
    }
}


class SearchPage {
    public String coreUrl;
    public int pageNum;
    public String[] urls;
    public java.util.List<String[]> links;

    public String[] initUrls(String coreUrl, int pageNum) {
        String[] urls = new String[pageNum];
        for (int i = 0; i < pageNum; i++) {
            urls[i] = coreUrl + "index_" + (i + 1) + ".html";
        }
        return urls;
    }

    public void setHttpHeader(org.jsoup.Connection.Request request) {
        request.header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188");
        request.header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
        request.header("Accept-Encoding", "gzip, deflate, br");
        request.header("Accept-Language", "en-US,en;q=0.9");
        request.header("Cache-Control", "max-age=0");
        request.header("Connection", "keep-alive");
        request.header("Cookie", "ASPSESSIONIDQWQRTBCS=GAKECIPBOFGLGEHBOCOEHDJG; ASPSESSIONIDSSVQSBDT=HGKECIPBNIEIEHHHGNGHECNC; ASPSESSIONIDQWTRSADS=DNCFCIPBGPLCOILIBAMIIFBA; ASPSESSIONIDSWSRTBCS=EKNCDIPBOHHNDGCNEGCNDDCJ; ASPSESSIONIDQWRQTACT=EBLECIPBLKKMFADPACDEDBDN; ASPSESSIONIDQSVTQACT=FCLECIPBJGNOJDGHKELJGLDH");
        request.header("Connection", "keep-alive");
        request.header("Host", "www.yac8.com");
    }

    public void scrapeLinks(String url) throws IOException {
        org.jsoup.Connection connection = Jsoup.connect(url);
        setHttpHeader(connection.request());
        Document document = connection.get();

        Elements articleElements = document.select("article");
        for (Element article : articleElements) {
            String title = article.select("h2 a").text();
            String articleUrl = article.select("h2 a").attr("href");
            String[] link = {title, articleUrl};
            links.add(link);
        }
    }

    public void scrapeAllLinks() throws IOException {
        for (String url : urls) {
            scrapeLinks(url);
        }
    }

    public void saveLinksToFile() throws IOException {
        FileWriter fileWriter = new FileWriter("links.txt");
        BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

        for (String[] link : links) {
            bufferedWriter.write(link[0] + "," + link[1] + "\n");
        }

        bufferedWriter.close();
        fileWriter.close();
    }

    public SearchPage(String coreUrl, int pageNum) {
        this.coreUrl = coreUrl;
        this.pageNum = pageNum;
        urls = initUrls(coreUrl, pageNum);
        links = new java.util.ArrayList<String[]>();
    }
}

//import java.util.concurrent.CompletableFuture;

public class GetImage {

    //索引值，例如第五页为PAGE_START=4
    public static final int PAGE_START = 1;
    public static final int PAGE_END = 2;

    public static void main(String[] args) {
        //创建一个SearchPage对象，传入url和页数
        SearchPage searchPage = new SearchPage("http://www.yac8.com/news/?list_refer-theme-%B6%AD%C6%E4%B2%FD", 2);
        logOperation("-".repeat(10) + "所有搜索页面的url" + "-".repeat(10));
        logOperation(String.join(",\n", searchPage.urls));

        //使用CompletableFuture来实现异步操作
        CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
            try {
                for (String url : searchPage.urls.subList(PAGE_START - 1, PAGE_END - 1)) {
                    //使用thenApplyAsync来获取异步结果
                    searchPage.links.add(searchPage.getAllLinks(url).thenApplyAsync(links -> {
                        logOperation("获取到了" + url + "的所有连接");
                        return links;
                    }).get());
                }

                logOperation("-".repeat(10) + "所有页面链接" + "-".repeat(10));
                logOperation(String.join(",\n", searchPage.links));

                // @ts-ignore
                int allLinkLength = searchPage.links.stream().mapToInt(list -> list.size()).sum();
                int visitedLink = 0;

                int searchPageNum = 0;
                for (List<String> artInOnePages : searchPage.links) {
                    int itemNum = 1;

                    logOperation("-".repeat(10) + "第" + (searchPageNum + PAGE_START) + "搜索页面" + "-".repeat(10));
                    for (String artPageId : artInOnePages) {
                        logOperation("-".repeat(10) + "pageId=" + artPageId + "-".repeat(10));
                        ArtPage artPage = new ArtPage(artPageId);
                        artPage.getPageNum().thenAcceptAsync(pageNum -> {
                            artPage.initUrls();

                            logOperation("共" + artPage.pageNum + "页");
                            logOperation(String.join(",\n", artPage.urls));

                            int pageNum = 1;
                            for (String urlForEachPage : artPage.urls) {
                                logOperation("开始爬取" + artPageId + "页面的第" + pageNum + "页");

                                artPage.scrapeImages(urlForEachPage, pageNum)
                                        .thenRunAsync(() -> logOperation(artPageId + "页面的第" + pageNum + "页爬取完毕"))
                                        .exceptionally(error -> {
                                            errorOperation(artPageId + "页面的第" + pageNum + "页爬取失败: " + error.getMessage());
                                            return null;
                                        });

                                ProgressPrinter.printProgress((double) visitedLink / allLinkLength);
                                pageNum++;
                            }
                            itemNum++;
                            visitedLink++;

                            ProgressPrinter.printProgress((double) visitedLink / allLinkLength);
                        });
                    }
                    searchPageNum++;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
}
