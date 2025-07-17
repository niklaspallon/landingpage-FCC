// Function to update shortDesc text
function updateShortDesc(newText) {
    const shortDescElement = document.querySelector('p.shortDesc');
    if (shortDescElement) {
        shortDescElement.textContent = newText;
    }
}

// Function to save the text to localStorage
function saveShortDesc(text) {
    localStorage.setItem('shortDescText', text);
}

// Function to load the text from localStorage
function loadShortDesc() {
    const savedText = localStorage.getItem('shortDescText');
    if (savedText) {
        updateShortDesc(savedText);
        // If we're on the admin page, update the textarea
        const textarea = document.getElementById('shortDesc');
        if (textarea) {
            textarea.value = savedText;
        }
    }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('shortDescForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const newText = document.getElementById('shortDesc').value;
            updateShortDesc(newText);
            saveShortDesc(newText);
            alert('Texten har uppdaterats!');
        });
    }
    
    // Load saved text
    loadShortDesc();
});

// Example of how to update the text (this would be called from your admin panel)
// updateShortDesc('Ny text här');
// saveShortDesc('Ny text här');

// Function to save posts to localStorage
function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Function to load posts from localStorage
function loadPosts() {
    const savedPosts = localStorage.getItem('posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
}

// Function to display posts
function displayPosts() {
    const postsList = document.getElementById('postsList');
    if (!postsList) return;

    const posts = loadPosts();
    postsList.innerHTML = '';

    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="post-actions">
                <button onclick="editPost(${index})">Redigera</button>
                <button class="delete" onclick="deletePost(${index})">Ta bort</button>
            </div>
        `;
        postsList.appendChild(postElement);
    });
}

// Function to create a new post
function createPost(title, content) {
    const posts = loadPosts();
    posts.unshift({ title, content }); // Add new post at the beginning
    savePosts(posts);
    displayPosts();
}

// Function to delete a post
function deletePost(index) {
    const posts = loadPosts();
    posts.splice(index, 1);
    savePosts(posts);
    displayPosts();
}

// Function to edit a post
function editPost(index) {
    const posts = loadPosts();
    const post = posts[index];
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    deletePost(index); // Remove the old version
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('postForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('postTitle').value;
            const content = document.getElementById('postContent').value;
            createPost(title, content);
            
            // Clear the form
            document.getElementById('postTitle').value = '';
            document.getElementById('postContent').value = '';
            
            alert('Posten har skapats!');
        });
    }
    
    // Display existing posts
    displayPosts();
});

// Function to update the main page with posts
function updateMainPage() {
    const posts = loadPosts();
    const shortDescElement = document.querySelector('p.shortDesc');
    if (shortDescElement && posts.length > 0) {
        // Display all posts
        let postsHTML = '';
        posts.forEach(post => {
            postsHTML += `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                </div>
            `;
        });
        shortDescElement.innerHTML = postsHTML;
    }
}

// Update main page when it loads
if (window.location.pathname.endsWith('index.html')) {
    document.addEventListener('DOMContentLoaded', updateMainPage);
} 