// ------------------------------
// Soundify App: Voice Command + Music Recognition
// ------------------------------

// Replace with your YouTube API key
const API_KEY = "YOUR_YOUTUBE_API_KEY";

// DOM Elements
const statusText = document.getElementById("status");
const resultsContainer = document.getElementById("results");
const playerContainer = document.getElementById("player");

// ------------------------------
// 1️⃣ Voice Command Recognition
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
    if(videos.length > 0) playVideo(videos[0].id.videoId);
  };

  recognition.onerror = () => {
    statusText.textContent = "Voice recognition failed. Try again!";
  };
}

// ------------------------------
// 2️⃣ Music Recognition via ACRCloud
// ------------------------------
async function recognizeMusic() {
  statusText.textContent = "Listening for song... 🎶";

  try {
    // ------------------------------
    // ACRCloud JS SDK
    // ------------------------------
    const acr = new ACRCloud({
      host: "identify-eu-west-1.acrcloud.com",      // <-- Paste your host here
      access_key: "629a857dd6fe92f0a8e8e9df6cb175b0", // <-- Paste your access key here
      access_secret: "BCWvEEhw0ofIS7vPKgWqwGXF0xTgsHXuzxB4mBXc", // <-- Paste your access secret here
      timeout: 10
    });

    // Start recognition
    const result = await acr.recognize();
    console.log("ACRCloud result:", result);

    if(result.status.code === 0 && result.metadata.music.length > 0) {
      const songTitle = result.metadata.music[0].title;
      const artist = result.metadata.music[0].artists[0].name;
      statusText.textContent = `Found: ${songTitle} - ${artist}`;

      // Search YouTube
      const videos = await searchYouTube(`${songTitle} ${artist}`);
      if(videos.length > 0) playVideo(videos[0].id.videoId);

    } else {
      statusText.textContent = "No song detected. Try again!";
      console.error("ACRCloud did not return music info:", result);
    }

  } catch(err) {
    console.error("ACRCloud error:", err);
    statusText.textContent = "Error detecting song. Check console.";
  }
}

// ------------------------------
// 3️⃣ YouTube Search
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

  } catch(error) {
    console.error(error);
    resultsContainer.innerHTML = "<p>Error fetching results.</p>";
    return [];
  }
}

// ------------------------------
// 4️⃣ Display YouTube Results
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
// 5️⃣ Play YouTube Video
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
