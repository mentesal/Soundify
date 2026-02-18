const songs = [
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Shape of You", artist: "Ed Sheeran" },
  { title: "Levitating", artist: "Dua Lipa" }
];

function recognizeSong() {
  const status = document.getElementById("status");
  const resultCard = document.getElementById("result-card");
  const title = document.getElementById("song-title");
  const artist = document.getElementById("song-artist");

  status.innerText = "Listening... 🎧";
  resultCard.classList.add("hidden");

  setTimeout(() => {
    const randomSong = songs[Math.floor(Math.random() * songs.length)];

    title.innerText = randomSong.title;
    artist.innerText = randomSong.artist;

    status.innerText = "Song Identified!";
    resultCard.classList.remove("hidden");
  }, 3000);
}
