const micBtn = document.getElementById("mic-Btn");
const statusText = document.getElementById("status");
const resultsContainer = document.getElementById("results");
const playerContainer = document.getElementById("player");

const API_KEY = "AIzaSyDhnD7PM1BveGHMhksMcW3RgX4L1avA81g"; // <-- Put your real key here

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;

micBtn.addEventListener("click", () => {
  recognition.start();
  statusText.textContent = "Listening...";
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  statusText.textContent = `Searching for: ${transcript}`;
  searchYouTube(transcript);
};

recognition.onerror = () => {
  statusText.textContent = "Voice recognition failed.";
};

// Search YouTube
async function searchYouTube(query) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=6&key=${API_KEY}`
    );

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      resultsContainer.innerHTML = "<p>No songs found.</p>";
      return;
    }

    displayResults(data.items);
  } catch (error) {
    resultsContainer.innerHTML = "<p>Error fetching results.</p>";
  }
}

// Display Results
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

// Play Video
function playVideo(videoId) {
  playerContainer.innerHTML = `
    <iframe width="100%" height="315"
      src="https://www.youtube.com/embed/${videoId}"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `;
}
