// ------------------------------
// Soundify App: Voice Command + Music Recognition
// ------------------------------

// Replace with your YouTube API key
const API_KEY = "AIzaSyDhnD7PM1BveGHMhksMcW3RgX4L1avA81g";

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
    const status = document.getElementById("status");
    status.textContent = "Listening...";

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);

    mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", blob);

        const response = await fetch("http://localhost:3000/recognize", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        console.log(result);

        if (result.metadata) {
            const song = result.metadata.music[0];
            const query = `${song.title} ${song.artists[0].name}`;
            searchYouTube(query);
        } else {
            status.textContent = "Song not recognized.";
        }
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 8000);
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
