const songsList = [
  {
    id: 0,
    title: "Sweetheart",
    artist: "Ostin",
    duration: "2:45",
    src: "./songs/sweetheart_by_ostin.mp3",
  },
  {
    id: 1,
    title: "Painter",
    artist: "vitokompozito",
    duration: "3:16",
    src: "./songs/painter_by_vitokompozito.mp3",
  },
  {
    id: 2,
    title: "Coffee Jazz",
    artist: "DogisReal",
    duration: "1:46",
    src: "./songs/coffee-jazz_by_dogisreal.mp3",
  },
  {
    id: 3,
    title: "Lovely Night",
    artist: "SoundStreet",
    duration: "2:57",
    src: "./songs/lovely-night_by_soundstreet.mp3",
  },
  {
    id: 4,
    title: "Jazz After Dark",
    artist: "SoundStreet",
    duration: "2:27",
    src: "./songs/jazz-after-dark_by_soundstreet.mp3",
  },
  {
    id: 5,
    title: "Feel The Warmth",
    artist: "Stanislav",
    duration: "2:31",
    src: "./songs/feel-the-warmth_by_stanislav.mp3",
  },
  {
    id: 6,
    title: "Sky",
    artist: "AOGANI",
    duration: "2:06",
    src: "./songs/sky_by_aogani.mp3",
  },
  {
    id: 7,
    title: "Gentle Morning",
    artist: "IsaevIlnarMusic",
    duration: "3:45",
    src: "./songs/gentle-morning_by_isaevilnarmusic.mp3",
  },
  {
    id: 8,
    title: "Morning In The City",
    artist: "AHOAMI",
    duration: "1:53",
    src: "./songs/morning-in-the-city_by_ahoami.mp3",
  },
  {
    id: 9,
    title: "Before Dawn",
    artist: "99Instrumentals",
    duration: "2:20",
    src: "./songs/before-dawn_by_99instrumentals.mp3",
  },
  {
    id: 10,
    title: "Believe",
    artist: "IsaevIlnarMusic",
    duration: "3:09",
    src: "./songs/believe_by_isaevilnarmusic.mp3",
  }
];
/* source: https://tunetank.com/ */

const playlistSongs = document.getElementById("playlist-songs");
const previousButton = document.getElementById("previous");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle");

const audio = new Audio();

let userData = {
  songs: [...songsList],
  currentSong: null,
  songCurrentTime: 0
};

const playSong = (id) => {
  clearInterval(updateTimer);
  resetValues();

  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song; /* !*!*!*!* */
  playButton.classList.add("playing");

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
  updateTimer = setInterval(seekUpdate, 1000);
  resumeCoverAnimation();
};

function getCurrentSongIndex() {
  return userData?.songs.indexOf(userData?.currentSong);
}

function pauseSong() {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
  pauseCoverAnimation();
}

function playPreviousSong() {
  if (userData?.currentSong === null)
    return;
  else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];
    playSong(previousSong.id);
  }
}

function playNextSong() {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];
    playSong(nextSong.id);
  }
}

function shuffle() {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
}

const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }

  userData.songs = userData?.songs.filter((song) => song.id !==id);
  renderSongs(userData?.songs);
  highlightCurrentSong();
  setPlayButtonAccessibleText();

  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      userData.songs = [...songsList];

      renderSongs(sortSongs());
      setPlayButtonAccessibleText();
      resetButton.remove();
    });
  }
};

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
}

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
  const songsHTML = array.map((song) => {
    return `
    <div class="playlist-song-container">
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
        <div class="pl-title-artist-div">
          <div class="playlist-song-title">${song.title}</div>
          <div class="playlist-song-artist">${song.artist}</div>
        </div>
        <div class="playlist-song-duration">${song.duration}</div>
      </button>

      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <i class="fa-regular fa-circle-xmark"></i>
        </button>
      </li>
    </div>
    `;
  }).join("");
  playlistSongs.innerHTML = songsHTML;
};


/* *********************** */
const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];

  playButton.setAttribute("aria-label", song?.title ? `Play ${song.title}` : "Play");
};

playButton.addEventListener("click", () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

previousButton.addEventListener("click", playPreviousSong);
nextButton.addEventListener("click", playNextSong);
pauseButton.addEventListener("click", pauseSong);
shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

  if(nextSongExists) {
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
});


function pauseCoverAnimation() {
  const albumCover = document.querySelector("#player-album-cover img");
  albumCover.style.animationPlayState = "paused";
}
function resumeCoverAnimation() {
  const albumCover = document.querySelector("#player-album-cover img");
  albumCover.style.animationPlayState = "running";
}

const seekSlider = document.querySelector(".seek-slider");
const currTime = document.querySelector(".current-time");
const totalDuration = document.querySelector(".total-duration");
/* let track_index = 0;
let isPlaying = false;
  */
let updateTimer;

function resetValues() {
  currTime.textContent = "00:00";
  totalDuration.textContent = "00:00";
  seekSlider.value = 0;
} 
function seekTo() {
  const seekto = audio.duration * (seekSlider.value / 100); 
  audio.currentTime = seekto;
}

seekSlider.addEventListener("change", seekTo);

function seekUpdate() {
  let seekPosition = 0;
  if (!isNaN(audio.duration)) {
    seekPosition = audio.currentTime * (100 / audio.duration);
    seekSlider.value = seekPosition;

    let currMinutes = Math.floor(audio.currentTime / 60);
    let currSeconds = Math.floor(audio.currentTime - currMinutes * 60);
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

    if (currSeconds < 10) {
      currSeconds = "0" + currSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currMinutes < 10) {
      currMinutes = "0" + currMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }
    
    currTime.textContent = currMinutes + ":" + currSeconds;
    totalDuration.textContent = durationMinutes + ":" + durationSeconds;
  }
};

const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.value = 40;
volumeSlider.addEventListener("input", setVolume);
function setVolume() {
  audio.volume = volumeSlider.value / 100;
}

function sortSongs() {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};
pauseCoverAnimation();
renderSongs(sortSongs());
setPlayButtonAccessibleText();

