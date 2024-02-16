// console.log("hello");
let currentsong = new Audio();
let songs;
let currFolder;

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" +track)
  currentsong.src = `/${currFolder}/` + track;

  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".time").innerHTML = "00:00 / 00:00";
};

function secondsToMinutesSeconds(seconds) {
  // Ensure the input is a non-negative number
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format the result with leading zeros
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let q = div.getElementsByTagName("a");
  //   console.log(q);
  songs = [];
  for (let index = 0; index < q.length; index++) {
    const element = q[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }
  //   console.log(songs);
  return songs;
}
//$$$$$$$$$$$$$$$$$
async function displayAlbums() {
  console.log("displaying albums");
  let a = await fetch(`/songs/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  console.log("vyhgv");
  let cards = document.querySelector(".cards");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      console.log(e.href);
      let folder = e.href.split("/").slice(-2)[1];
      // Get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cards.innerHTML =
        cards.innerHTML +
        ` 
        <div data-folder="${folder}" class="card1">
                    <div class="img">
                        <img class="card1img" aria-hidden="false" draggable="false" loading="lazy"
                            src="/songs/${folder}/cover.jpg"
                            data-testid="card-image" alt=""
                            class="mMx2LUixlnN_Fu45JpFB SKJSok3LfyedjZjujmFt Yn2Ei5QZn19gria6LjZj" />
                        <img class="playbtn" src="play2.svg" alt="play" />
                        <p>${response.title}</p>
                        <div class="txt">
                        ${response.description}
                        </div>
                    </div>
                </div>`;

      Array.from(document.getElementsByClassName("card1")).forEach((e) => {
        console.log(e);
        e.addEventListener("click", async (event) => {
          console.log(event, event.currentTarget.dataset);
          songs = await getSongs(`songs/${event.currentTarget.dataset.folder}`);
          playMusic(songs[0], true); // Play the first song after changing the folder

          // Update the playlist
          let songsUL = document
            .querySelector(".songslist")
            .getElementsByTagName("ul")[0];
          songsUL.innerHTML = "";

          for (const song of songs) {
            songsUL.innerHTML += `<li>
                        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                          <div>${song.replaceAll("%20", " ")}</div>
                          <div>DJ</div>
                        </div>
                        <img class="invert" src="play.svg" alt="">
                      </li>`;
          }

          // Attach event listener to each new song
          Array.from(
            document.querySelector(".songslist").getElementsByTagName("li")
          ).forEach((li) => {
            li.addEventListener("click", (element) => {
              playMusic(li.querySelector(".info").firstElementChild.innerHTML);
            });
          });
        });
      });
    }
  }
}

async function main() {
  //List of all songs
  await getSongs("songs/Arijit%20Singh");
  console.log(songs);
  playMusic(songs[0], true);

  //Display All Albums on page
  displayAlbums();

  // show all songs in playlist
  let songsUL = document
    .querySelector(".songslist")
    .getElementsByTagName("ul")[0];
  songsUL.innerHTML = "";

  for (const song of songs) {
    songsUL.innerHTML =
      songsUL.innerHTML +
      `<li>
        <img class="invert" src="music.svg" alt="" >
        <div class="info">
           <div >${song.replaceAll("%20", " ")}</div> 
           <div >DJ</div> 
        </div>
        <img class="invert" src="play.svg" alt="">
    </li>`;
  }

  //*************Attach event listner to each song********************
  Array.from(
    document.querySelector(".songslist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  //Playing the first song
  var audio = new Audio(songs[0]);
  // audio.play();

  //*************Attach event listner to play next and previous song********************

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  //*************time Update********************

  currentsong.addEventListener("timeupdate", () => {
    // console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}/${secondsToMinutesSeconds(currentsong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  audio.addEventListener("loadeddata", () => {
    // let duration = audio.duration;
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // The duration variable now holds the duration (in seconds) of the audio clip
  });

  //Add event listner to seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  //Add event listner to previous and next
  previous.addEventListener("click", () => {
    // console.log("Previous Cicked")
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    // console.log(songs,index);
    if (index - 1 >= 0) {
      playMusic(songs[index + 1]);
    }
  });
  next.addEventListener("click", () => {
    currentsong.pause();
    // console.log("next Cicked")
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    // console.log(songs,index);
    // console.log(length)

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Volume*****
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      // console.log(e, e.target,e.target.value);
      currentsong.volume = parseInt(e.target.value) / 100;
    });

  //Load the playlist whever clicked

  //Add event listner to mute song

  let defaultvol = currentsong.volume;

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.src.includes("volume-high.svg")) {
      console.log("e.target1");
      e.target.src = "volume-off.svg";
      currentsong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      console.log("e.target2");
      e.target.src = "volume-high.svg";
      currentsong.volume = 0.5;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 50;
    }
  });



  //Add event listner for Hamburger
  // ********$$$$$$$$********
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left= "0"

  })

  // ********$$$$$$$$********
  //Add event listner for close button
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left= "-110%"

  })









}

main();
