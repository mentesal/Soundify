
const API_KEY = "AIzaSyDhnD7PM1BveGHMhksMcW3RgX4L1avA81g";

// DOM Elements
const micBtn = document.querySelector(".mic-btn");
const statusText = document.getElementById("status");
const resultsContainer = document.getElementById("results");
const playerContainer = document.getElementById("player");

// ------------------------------
// Voice Recognition
// ------------------------------
function recognizeSong() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser does not support voice recognition!");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  statusText.textContent = "Listening... 🎤";

  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    statusText.textContent = `Searching for: ${transcript}`;

    const videos = await searchYouTube(transcript);

    if(videos.length > 0) {
      // Auto play first result
      playVideo(videos[0].id.videoId);
    }
  };

  recognition.onerror = () => {
    statusText.textContent = "Voice recognition failed. Try again!";
  };
}

// ------------------------------
// YouTube Search Function
// ------------------------------
async function searchYouTube(query) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=6&key=${API_KEY}`
    );

    const data = await response.json();

    if(!data.items || data.items.length === 0){
      resultsContainer.innerHTML = "<p>No songs found.</p>";
      return [];
    }

    displayResults(data.items);
    return data.items;

  } catch (error) {
    resultsContainer.innerHTML = "<p>Error fetching results.</p>";
    console.error(error);
    return [];
  }
}

// ------------------------------
// Display Search Results
// ------------------------------
function displayResults(videos) {
  resultsContainer.innerHTML = "";

  videos.forEach(video => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.medium.url;

    const card = document.createElement("div");
    card.classList.add("song-card");
    card.innerHTML = `
      <img src="${thumbnail}" width="100%">
      <h4>${title}</h4>
      <button onclick="playVideo('${videoId}')">Play</button>
    `;
    resultsContainer.appendChild(card);
  });
}

// ------------------------------
// Play Video
// ------------------------------
window.playVideo = function(videoId) {
  playerContainer.innerHTML = `
    <iframe width="100%" height="315"
      src="https://www.youtube.com/embed/${videoId}?autoplay=1"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen>
    </iframe>
  `;
};

// ------------------------------
// Optional: Mic Button Click (if you remove onclick from HTML)
// ------------------------------
// micBtn.addEventListener("click", recognizeSong);
