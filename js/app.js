function recognizeSong() {
  const statusText = document.getElementById("status");
  const resultsContainer = document.getElementById("results");
  const playerContainer = document.getElementById("player");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser does not support speech recognition!");
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
    searchYouTube(transcript);
  };

  recognition.onerror = () => {
    statusText.textContent = "Voice recognition failed.";
  };

  // YouTube search function
  async function searchYouTube(query) {
    const API_KEY = "YOUR_API_KEY_HERE"; // replace with your real key
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
    } catch (err) {
      resultsContainer.innerHTML = "<p>Error fetching results.</p>";
    }
  }

  // Display function
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

  // Play video
  window.playVideo = function(videoId) {
    playerContainer.innerHTML = `
      <iframe width="100%" height="315"
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0"
        allowfullscreen>
      </iframe>
    `;
  };
}
