const demoSongs = [
  {
    title: "Blinding Lights",
    videoId: "4NRXx6U8ABQ"
  },
  {
    title: "Shape of You",
    videoId: "JGwWNGJdvx8"
  },
  {
    title: "Levitating",
    videoId: "TUVcZfQe-Kw"
  }
];

function searchSongs() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  const filtered = demoSongs.filter(song =>
    song.title.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p>No songs found.</p>";
    return;
  }

  filtered.forEach(song => {
    const card = document.createElement("div");
    card.classList.add("song-card");

    card.innerHTML = `
      <h4>${song.title}</h4>
      <button onclick="playSong('${song.videoId}')">▶ Play</button>
      <button onclick="saveToPlaylist('${song.title}', '${song.videoId}')">+ Save</button>
    `;

    resultsDiv.appendChild(card);
  });
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
