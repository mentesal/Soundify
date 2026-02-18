const API_KEY = "AIzaSyDhnD7PM1BveGHMhksMcW3RgX4L1avA81g";

async function searchSongs() {
  const query = document.getElementById("searchInput").value;
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "Searching...";

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${query}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    resultsDiv.innerHTML = "";

    data.items.forEach(item => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      const thumbnail = item.snippet.thumbnails.medium.url;

      const card = document.createElement("div");
      card.classList.add("song-card");

      card.innerHTML = `
        <img src="${thumbnail}" width="100%">
        <h4>${title}</h4>
        <button onclick="playSong('${videoId}')">▶ Play</button>
        <button onclick="saveToPlaylist('${title}', '${videoId}')">+ Save</button>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (error) {
    resultsDiv.innerHTML = "Error fetching results.";
    console.error(error);
  }
}

function playSong(videoId) {
  const player = document.getElementById("player");
  const iframe = document.getElementById("youtubePlayer");

  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  player.classList.remove("hidden");
}

function saveToPlaylist(title, videoId) {
  let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

  playlist.push({ title, videoId });

  localStorage.setItem("playlist", JSON.stringify(playlist));

  alert("Saved to playlist!");
}
