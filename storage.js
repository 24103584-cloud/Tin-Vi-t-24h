const Store = {
  KEYS: {
    MENU: 'tt_menu',
    POSTS: 'tt_posts'
  },

  // Khởi tạo dữ liệu ban đầu từ seed.js nếu chưa có
  init() {
    if (!localStorage.getItem(this.KEYS.MENU) && typeof SEED_MENU !== 'undefined') {
      this.saveMenu(SEED_MENU);
    }
    if (!localStorage.getItem(this.KEYS.POSTS) && typeof SEED_POSTS !== 'undefined') {
      this.savePosts(SEED_POSTS);
    }
  },

  getMenu() {
    const data = localStorage.getItem(this.KEYS.MENU);
    return data ? JSON.parse(data) : [];
  },

  saveMenu(menu) {
    localStorage.setItem(this.KEYS.MENU, JSON.stringify(menu));
  },

  getPosts() {
    const data = localStorage.getItem(this.KEYS.POSTS);
    return data ? JSON.parse(data) : [];
  },

  savePosts(posts) {
    localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts));
  },

  // Lấy danh sách bài viết sắp xếp mới nhất -> cũ nhất
  getSortedPosts() {
    const posts = this.getPosts();
    return posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  },

  // Lấy bài viết theo ID
  getPostById(id) {
    return this.getPosts().find(p => p.id === id);
  },

  // Lấy danh sách bài viết theo Chuyên mục
  getPostsByCategory(catId) {
    return this.getSortedPosts().filter(p => 
      p.category === catId || (p.categories && p.categories.includes(catId))
    );
  }
};

Store.init();
