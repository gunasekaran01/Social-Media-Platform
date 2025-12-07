let posts = [];

function createPost() {
  const text = document.getElementById("postInput").value;
  if (text.trim() === "") return;

  const post = {
    id: Date.now(),
    name: "You",
    profile: "https://i.pravatar.cc/40",
    text: text,
    likes: 0,
    liked: false
  };

  posts.unshift(post);
  document.getElementById("postInput").value = "";
  renderPosts();
}

function toggleLike(id) {
  const post = posts.find(p => p.id === id);
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  renderPosts();
}

function renderPosts() {
  const container = document.getElementById("posts");
  container.innerHTML = "";

  posts.forEach(post => {
    container.innerHTML += `
      <div class="post">
        <div class="post-header">
          <img src="${post.profile}">
          <strong>${post.name}</strong>
        </div>

        <p>${post.text}</p>

        <div class="post-actions">
          <span class="like ${post.liked ? "liked" : ""}" onclick="toggleLike(${post.id})">❤️</span>
          <span>💬</span>
          <span>↗</span>
        </div>
      </div>
    `;
  });
}

renderPosts();
