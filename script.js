let posts = [
  {
    profileImage: "./img/profile-img/profile1.jpg",
    profileName: "Sam",
    location: "Slovenia",
    postImage: "img/post1.jpg",
    likes: "545",
    description: "Taking the long way home.",
    comments: [], 
  },
  {
    profileImage: "./img/profile-img/profile2.jpg",
    profileName: "Jasmine",
    location: "Malibu, California",
    postImage: "img/post2.jpg",
    likes: "800",
    description: "Summer has officially started.",
    comments: [], 
  },
  {
    profileImage: "./img/profile-img/profile3.jpg",
    profileName: "James",
    location: "UK",
    postImage: "img/post3.jpg",
    likes: "410",
    description: "Taking in the vitamin SEA",
    comments: [], 
  },
];


function createPostHTML(post, i) {
  return `
      <div class="contentPost">
          <div class="postHeader">
              <img src="${post.profileImage}">
              <div class="profileDetails">
                  <div class="profileName">${post.profileName}</div>
                  <div class="postLocation">${post.location}</div>
              </div>
          </div>
          <div class="postImage">
              <img src="${post.postImage}">
          </div>
          <div class="postIcons">
              <div class="iconsLeft">
                  <button class="heartIcon" onclick="likePost(${i})">
                      <img id="heart-${i}" src="./img/heart.png">
                  </button>
                  <img src="./img/message.png">
                  <img src="./img/paperplane.png">
              </div>
              <div>
                  <img src="./img/bookmark.png">
              </div>
          </div>
          <div class="likesNumber">${post.likes} have liked this post</div>
          <div class="postDescription">${post.description}</div>
          <div id="comments-${i}"></div>
          <div class="commentField">
              <input class="commentInputField" id="commentInput-${i}-commentField" type="text" placeholder="Comment..." required>
              <button type="submit" id="commentButton" class="sendCommentButton" onclick="sendComment(${i})">
                  <img src="./img/send.png">
              </button>
          </div>
      </div>
  `;
}

function updateLikesAndHeartIcon(i, post, savedLikes, likesNumberElement, savedHeartStatus) {
  if (savedLikes !== null) {
      post.likes = parseInt(savedLikes);
      likesNumberElement.textContent = `${post.likes} have liked this post`;
  }
  if (savedHeartStatus) {
      const heartIcon = document.getElementById(`heart-${i}`);
      heartIcon.src = savedHeartStatus;
  }
}

function pressEnterKey(event) {
  for (let i = 0; i < posts.length; i++) {
    let commentInputId = `commentInput-${i}-commentField`;
    let commentInput = document.getElementById(commentInputId);

    if (event.key === "Enter" && event.target === commentInput) {
      event.preventDefault(); 
      let newComment = commentInput.value.trim();
      if (newComment.length < 1) {
        alert("Please write your comment");
        return; 
      }
      sendComment(i);
    }
  }
}


function addPostToContainer(postContainer, postHTML) {
  postContainer.innerHTML += postHTML;
}


function addEventListeners() {
  document.addEventListener("keypress", pressEnterKey);
}

function showPost() {
  const postContainer = document.getElementById("post-container");
  postContainer.innerHTML = "";
  addEventListeners();

  for (let i = 0; i < posts.length; i++) {
    addPostToContainer(postContainer, createPostHTML(posts[i], i));
    updatePostDetails(i, posts[i]);
    loadComments(i);
  }
}


function updatePostDetails(i, post) {
  const savedLikes = localStorage.getItem(`likes-${i}`);
  let likesNumberElement = document.querySelector(`#post-container .contentPost:nth-child(${i + 1}) .likesNumber`);

  updateLikesAndHeartIcon(i, post, savedLikes, likesNumberElement, localStorage.getItem(`heartStatus-${i}`));
}


function sendComment(i) {
  let newComment = document.getElementById(`commentInput-${i}-commentField`).value;

  if (newComment.length < 1) {
    alert("Please write your comment");
  } else {
    posts[i].comments.push(newComment);
    saveComment(i);
    loadComments(i);
    document.getElementById(`commentInput-${i}-commentField`).value = "";
  }
}


function setCommentsInLocalStorage(i, comments) {
  localStorage.setItem(`comments-${i}`, JSON.stringify(comments));
}


function saveComment(i) {
  let newComment = document.getElementById(`commentInput-${i}-commentField`).value;
  let savedComments = JSON.parse(localStorage.getItem(`comments-${i}`)) || [];

  savedComments.push(newComment);
  setCommentsInLocalStorage(i, savedComments);
}


function createCommentHTML(commentText, i, j) {
  return `
    <div class="addedComment">
      <p>${commentText}</p>
      <button onclick="deleteComment(${i}, ${j})">X</button>
    </div>`;
}


function loadComments(i) {
  let commentsDiv = document.getElementById(`comments-${i}`);
  commentsDiv.innerHTML = "";

  let savedComments = JSON.parse(localStorage.getItem(`comments-${i}`));

  if (savedComments) {
    for (let j = 0; j < savedComments.length; j++) {
      const commentText = savedComments[j];
      commentsDiv.innerHTML += createCommentHTML(commentText, i, j);
    }
  }
}


function updatePostLikes(post, likesNumberElement, heartIcon, i) {
  if (heartIcon.src.includes("filled-heart.png")) {
    post.likes = (parseInt(post.likes) - 1);
  } else {
    post.likes = (parseInt(post.likes) + 1);
  }

  likesNumberElement.textContent = `${post.likes} have liked this post`;
  heartIcon.src = heartIcon.src.includes("filled-heart.png") ? "./img/heart.png" : "./img/filled-heart.png";
}


function likePost(i) {
  let post = posts[i];
  let likesNumberElement = document.querySelector(`#post-container .contentPost:nth-child(${i + 1}) .likesNumber`);
  let heartIcon = document.getElementById(`heart-${i}`);

  updatePostLikes(post, likesNumberElement, heartIcon, i);

  localStorage.setItem(`heartStatus-${i}`, heartIcon.src);
  localStorage.setItem(`likes-${i}`, post.likes);
}


function removeCommentFromLocalStorage(postIndex, savedComments) {
  localStorage.setItem(`comments-${postIndex}`, JSON.stringify(savedComments));
}


function deleteComment(postIndex, commentIndex) {
  let savedComments = JSON.parse(localStorage.getItem(`comments-${postIndex}`)) || [];

  if (commentIndex >= 0 && commentIndex < savedComments.length) {
    savedComments.splice(commentIndex, 1);
    removeCommentFromLocalStorage(postIndex, savedComments);
    loadComments(postIndex);
  }
}