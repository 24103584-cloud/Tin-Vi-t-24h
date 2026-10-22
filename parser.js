/**
 * Trích xuất bài viết từ trang chi tiết Dân trí
 * @param {Document} doc - HTML Document đã được parse
 * @param {string} url - URL bài viết gốc
 * @returns {Object} Dữ liệu bài viết chuẩn hoá
 */
function parseArticle(doc, url) {
  // 1. Trích xuất ID bài viết từ URL (ví dụ: ...-20260928122246655.htm -> dtri-20260928122246655)
  const idMatch = url.match(/-(\d+)\.htm$/);
  const id = idMatch ? `dtri-${idMatch[1]}` : `dtri-${Date.now()}`;

  // 2. Slug
  const urlParts = url.split('/');
  const rawFileName = urlParts[urlParts.length - 1] || '';
  const slug = rawFileName.replace(/-\d+\.htm$/, '');

  // 3. Tiêu đề (dự phòng nhiều lớp)
  const titleEl = doc.querySelector('h1.title-page') || doc.querySelector('h1');
  const title = titleEl ? titleEl.textContent.trim() : (doc.querySelector('meta[property="og:title"]')?.content || '');

  // 4. Sapo / Excerpt (Lọc bỏ ngày giờ hoặc tiền tố "(Dân trí) - ")
  let excerpt = '';
  const sapoEl = doc.querySelector('.singular-sapo');
  if (sapoEl) {
    excerpt = sapoEl.textContent.trim();
  } else {
    excerpt = doc.querySelector('meta[property="og:description"]')?.content || '';
  }
  excerpt = excerpt.replace(/^\(Dân trí\)\s*-\s*/i, '').trim();

  // 5. Nội dung (lấy các thẻ p, h2, h3 trong container chính, bỏ chú thích/tin liên quan)
  const contentEl = doc.querySelector('.singular-content');
  let content = '';
  if (contentEl) {
    const nodes = contentEl.querySelectorAll('p, h2, h3');
    const paragraphs = Array.from(nodes)
      .filter(node => !node.closest('.photo-caption') && !node.closest('.related-news'))
      .map(node => node.outerHTML);
    content = paragraphs.join('');
  }

  // 6. Tác giả
  const authorEl = doc.querySelector('.author-name') || doc.querySelector('meta[name="author"]');
  const author = authorEl ? (authorEl.textContent || authorEl.content).trim() : 'Dân trí';

  // 7. Thời gian đăng bài (trích xuất từ 12 chữ số đầu của mã ID nếu có)
  let publishedAt = new Date().toISOString();
  if (idMatch && idMatch[1].length >= 12) {
    const rawDigits = idMatch[1].substring(0, 12); // YYYYMMDDHHmm
    const y = rawDigits.substring(0, 4);
    const m = rawDigits.substring(4, 6);
    const d = rawDigits.substring(6, 8);
    const hh = rawDigits.substring(8, 10);
    const mm = rawDigits.substring(10, 12);
    publishedAt = `${y}-${m}-${d} ${hh}:${mm}`;
  }

  // 8. Chuyên mục
  const categorySegment = urlParts.length > 3 ? urlParts[3] : 'tin-tuc';

  // 9. Ảnh đại diện (thumbnail)
  const thumbEl = doc.querySelector('meta[property="og:image"]');
  const thumbnail = thumbEl ? thumbEl.content : '';

  return {
    id,
    title,
    slug,
    excerpt,
    content,
    author,
    category: categorySegment,
    categories: [categorySegment],
    publishedAt,
    source: 'dantri.com.vn',
    thumbnail
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseArticle };
}
