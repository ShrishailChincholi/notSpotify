async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/newsong/");
    let response = await a.text();


    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/newsong/")[1]);
        }
    }
    return songs
}
let currentsong = new Audio();
const playmusic = (track, pause = false) => {
    currentsong.src = "/newsong/" + track
    if (!pause) {
        currentsong.play()
    }
    currentsong.play()
    play.innerHTML = "<i class='fa-solid fa-pause'></i>"
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function main() {

    // get all songs
    songs = await getsongs();
    playmusic(songs[0], true)
    // console.log(songs)

    let songul = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>  <i class="fa-solid fa-music"></i>
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Shrishial</div>
                    </div>
                  <div class="playnow">
                      <span>Play now</span>
                    <i class="fa-solid fa-play"></i>
                  </div></li>`
    }

    // attach an event lister to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

        })

    })


    // icone chnage
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.innerHTML = "<i class='fa-solid fa-pause'></i>"
        } else {
            play.innerHTML = " <i class='fa-solid fa-play'></i>"
            currentsong.pause()
        }
    })


    // lister for timeupdate 
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circule").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

    })

    // add an event lister to seekbar
    document.querySelector(".seekbar").addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circule").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // privous 
    back.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playmusic(songs[index - 1])
        }

    })

    //  next
    next.addEventListener("click", () => {
          currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length ) {
            playmusic(songs[index + 1])
        }


    })
}


main();

// secon to minutes
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;



}
