// let currentSong = new Audio();
// let songs;
// let currFolder;

// // function to convert seconds to minutes
// function secToMin(seconds) {r
//     seconds = Math.max(0, seconds);
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
//     const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
//     return `${formattedMinutes}:${formattedSeconds}`;
// }
// // function to play music
// let playMusic = (track, pause=false) => {
//     let audio = new Audio(`/${currFolder}/` + track);
//     currentSong.src = audio.src;
//     if (!pause){
//         currentSong.play(); 
//         play.src = "svg/pause.svg";
//     }
//     document.querySelector('.songInfo').innerText = decodeURI(track);
//     document.querySelector('.songTime').innerText = "00:00/00:00";
// };

// async function getSongs(folder) {
//     currFolder = folder;
//     let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
//     let response = await a.text();
//     let div = document.createElement('div');
//     div.innerHTML = response;
//     let as = div.getElementsByTagName('a');
//     songs = [];
//     for (let i = 0; i < as.length; i++) {
//         const song = as[i];
//         if (song.href.endsWith('.mp3')) {
//             songs.push(decodeURIComponent(song.href.split(`/${folder}/`)[1]));
//         }
//     }
//      // event listener to each song
//     Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(li => {
//         li.addEventListener('click', () => {
//             let song = li.querySelector('.info div:first-child').innerText;
//             playMusic(song);
//         });
//     });
//     // event listener to play/pause button
//     play.addEventListener('click', () => {
//         if (currentSong.paused) {
//             currentSong.play();
//             play.src = "svg/pause.svg";
//         } else {
//             currentSong.pause();
//             play.src = "svg/play.svg";
//         }
//     });
//     // chatgpt event listener next and prev
//     // event listener to next button
//     next.addEventListener('click', () => {
//         let currentIndex = songs.indexOf(decodeURIComponent(currentSong.src.split(`/${folder}/`)[1]));
//         let nextIndex = (currentIndex + 1) % songs.length;
//         playMusic(songs[nextIndex]);
//     });

//     // event listener to previous button
//     prev.addEventListener('click', () => {
//         let currentIndex = songs.indexOf(decodeURIComponent(currentSong.src.split(`/${folder}/`)[1]));
//         let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
//         playMusic(songs[prevIndex]);
//     });
// }

// async function main() {
    
// }

// main();


let currentSong = new Audio();
let songs;
let currFolder;

function secToMin(seconds) {
    seconds = Math.max(0, seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
}

let playMusic = (track, pause = false) => {
    let audio = new Audio(`/${currFolder}/` + track);
    currentSong.src = audio.src;
    if (!pause) {
        currentSong.play();
        play.src = "svg/pause.svg";
    }
    document.querySelector('.songInfo').innerText = decodeURI(track);
    document.querySelector('.songTime').innerText = "00:00/00:00";
};

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const song = as[i];
        if (song.href.endsWith('.mp3')) {
            songs.push(decodeURIComponent(song.href.split(`/${folder}/`)[1]));
        }
    }
    return songs;
}

async function loadSongs(folder) {
    songs = await getSongs(folder);
    // Rest of the code to display songs in the UI, similar to what you have in your main function
    let songUL = document.querySelector('.songList ul');
    songUL.innerHTML = '';
    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img class="invert" src="svg/music.svg" alt="">
            <div class="info">
                <div>${song.replace('%20', '')}</div>
                <div>Sam</div>
            </div>
            <div class="playNow">
                <span>Play Now</span>
                <img class="invert" src="svg/playdef.svg" alt="">
            </div>
        </li>`;
    }
}

async function main() {
    // Your existing code...
    // time update event listener
    currentSong.addEventListener('timeupdate', () => {
        let duration = currentSong.duration;
        let currentTime = currentSong.currentTime;
        document.querySelector('.songTime').innerText = `${secToMin(currentTime)}/${secToMin(duration)}`;
        document.querySelector('.circle').style.left = `${(currentTime/duration)*100}%`;
    });

    // seekbar event listener
    document.querySelector('.seekBar').addEventListener('click', (e) => {
        duration = currentSong.duration;
        currentTime = currentSong.currentTime;
        let seekTime = (e.offsetX / e.target.clientWidth) * duration;
        currentSong.currentTime = seekTime;
    });

    // hamburger event listener
    // document.querySelector('.left').classList.toggle('hide');
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = "0";
    });

    // close event listener
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = "-120%";
    });

    // volume event listener
    document.querySelector('.volume').getElementsByTagName('input')[0 ].addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value)/100;
    });

    // // load playlist songs when card is clicked
    // Array.from(document.getElementsByClassName('card')).forEach(card => {
    //     // console.log(card);
    //     card.addEventListener('click', async item => {
    //         console.log(item.currentTarget.dataset);
    //         // folder = `songs/${item.currentTa rget.dataset}`;
    //         // console.log(folder);
    //         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    //         console.log(songs);
    //     });
    // });

    // load playlist songs when card is clicked
    Array.from(document.getElementsByClassName('card')).forEach(card => {
        card.addEventListener('click', async item => {
            console.log(item.currentTarget.dataset);
            await loadSongs(`songs/${item.currentTarget.dataset.folder}`);
        });
    });
}

main();