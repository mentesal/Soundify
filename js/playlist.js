function loadPlaylist() {
  const playlistDiv = document.getElementById("playlist");
  playlistDiv.innerHTML = "";

  const playlist = JSON.parse(localStorage.getItem("playlist")) || [];

  if (playlist.length === 0) {
    playlistDiv.innerHTML = "<p>Your playlist is empty.</p>";
    return;
  }

  playlist.forEach((song, index) => {
    const card = document.createElement("div");
    card.classList.add("song-card");

    card.innerHTML = `
      <h4>${song.title}</h4>
      <button onclick="playSong('${song.videoId}')">▶ Play</button>
      <button onclick="removeFromPlaylist(${index})">🗑 Remove</button>
    `;

    playlistDiv.appendChild(card);
  });
}

function playSong(videoId) {
  const player = document.getElementById("player");
  const iframe = document.getElementById("youtubePlayer");

  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  player.classList.remove("hidden");
}

function removeFromPlaylist(index) {
  let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
  playlist.splice(index, 1);
  localStorage.setItem("playlist", JSON.stringify(playlist));
  loadPlaylist();
}

// Load playlist when page opens
window.onload = loadPlaylist;
