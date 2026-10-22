const Crawler = {
  /**
   * Crawl bài viết từ URL
   * @param {string} url 
   * @returns {Promise<Object>}
   */
  async crawlArticle(url) {
    let htmlText = '';
    
    // Thử gọi proxy từ server localhost
    try {
      const response = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Proxy error');
      htmlText = await response.text();
    } catch (err) {
      console.warn('Lỗi CORS server local, thử proxy dự phòng...');
      // Dự phòng qua proxy công cộng nếu server local không chạy
      const fallbackRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      htmlText = await fallbackRes.text();
    }

    // Chuyển chuỗi HTML thành DOM Object bằng DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Dùng hàm bóc tách chung trong parser.js
    return parseArticle(doc, url);
  }
};
