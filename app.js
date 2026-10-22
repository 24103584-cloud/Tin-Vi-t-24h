function route() {
  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');
  
  if (hash === '#/' || hash === '') {
    renderHome(app);
  } else if (hash.startsWith('#/category/')) {
    const categoryId = hash.replace('#/category/', '');
    renderCategory(app, categoryId);
  } else if (hash.startsWith('#/post/')) {
    const postId = hash.replace('#/post/', '');
    renderPost(app, postId);
  } else if (hash === '#/crawler') {
    renderCrawler(app);
  } else {
    app.innerHTML = '<h2>404 - Trang không tồn tại</h2>';
  }
}

// 1. Trang chủ (Top 3 bài nổi bật + List bài dọc)
function renderHome(container) {
  const posts = Store.getSortedPosts();
  if (posts.length === 0) {
    container.innerHTML = '<p>Chưa có dữ liệu bài viết. Vui lòng chạy crawler!</p>';
    return;
  }

  const top1 = posts[0];
  const top23 = posts.slice(1, 3);
  const remaining = posts.slice(3);

  container.innerHTML = `
    <section class="top-section">
      <div class="top-left">
        <a href="#/post/${top1.id}">
          <img src="${top1.thumbnail}" alt="${top1.title}" />
          <h2>${top1.title}</h2>
          <p>${top1.excerpt}</p>
        </a>
      </div>
      <div class="top-right">
        ${top23.map(post => `
          <div class="top-small-item">
            <a href="#/post/${post.id}">
              <img src="${post.thumbnail}" alt="${post.title}" />
              <h3>${post.title}</h3>
            </a>
          </div>
        `).join('')}
      </div>
    </section>
    <hr />
    <section class="posts-list">
      ${remaining.map(post => renderListItem(post)).join('')}
    </section>
  `;
}

// Render 1 item dạng danh sách dọc
function renderListItem(post) {
  return `
    <article class="post-item">
      <img src="${post.thumbnail}" alt="${post.title}" />
      <div>
        <h3><a href="#/post/${post.id}">${post.title}</a></h3>
        <p class="meta">${post.publishedAt} | ${post.author}</p>
        <p>${post.excerpt}</p>
      </div>
    </article>
  `;
}

// 2. Trang chi tiết bài viết
function renderPost(container, postId) {
  const post = Store.getPostById(postId);
  if (!post) {
    container.innerHTML = '<h2>Bài viết không tồn tại</h2>';
    return;
  }

  container.innerHTML = `
    <article class="post-detail">
      <span class="category-tag">${post.category}</span>
      <h1>${post.title}</h1>
      <div class="post-meta">
        <span>Tác giả: <strong>${post.author}</strong></span> | 
        <span>${post.publishedAt}</span> | 
        <span>Nguồn: ${post.source}</span>
      </div>
      <p class="sapo">${post.excerpt}</p>
      <div class="post-content">${post.content}</div>
    </article>
  `;
}

// Khởi chạy Router
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  route();
});
