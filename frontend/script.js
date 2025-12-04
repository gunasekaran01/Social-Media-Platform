const API = "http://localhost:5000/api";

async function register() {
  let data = {
    username: username.value,
    email: email.value,
    password: password.value,
  };

  await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });

  alert("Registered!");
}

async function login() {
  let data = {
    email: email.value,
    password: password.value,
  };

  let res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });

  let out = await res.json();

  if (out.user) {
    localStorage.setItem("user", out.user.username);
    window.location.href = "feed.html";
  } else alert(out.message);
}

async function createPost() {
  const form = new FormData();
  form.append("user", localStorage.getItem("user"));
  form.append("text", document.getElementById("postText").value);
  form.append("image", document.getElementById("postImage").files[0]);

  await fetch(`${API}/posts/create`, {
    method: "POST",
    body: form,
  });

  loadPosts();
}

async function loadPosts() {
  let res = await fetch(`${API}/posts`);
  let posts = await res.json();

  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach(p => {
    feed.innerHTML += `
      <div class="post">
        <h3>@${p.user}</h3>
        <p>${p.text}</p>
        ${p.image ? `<img src="http://localhost:5000/${p.image}" width="100%">` : ""}
        <button onclick="likePost('${p._id}')">❤️ ${p.likes}</button>
        <br><br>
        <input id="c${p._id}" placeholder="Comment">
        <button onclick="comment('${p._id}')">Comment</button>

        <div>
          ${p.comments.map(c => `<p><b>${c.user}:</b> ${c.text}</p>`).join("")}
        </div>
      </div>
    `;
  });
}

async function likePost(id) {
  await fetch(`${API}/posts/like/${id}`, { method: "POST" });
  loadPosts();
}

async function comment(id) {
  const commentText = document.getElementById(`c${id}`).value;

  await fetch(`${API}/posts/comment/${id}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      user: localStorage.getItem("user"),
      text: commentText,
    }),
  });

  loadPosts();
}

if (document.body.contains(document.getElementById("feed"))) {
  loadPosts();
}
