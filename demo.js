let currentSong = new Audio();
let songs;
let currFolder;
let folder;

function secToMin(seconds) {
    seconds = Math.max(0, seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
}

let playMusic = (track, pause=false) => {
    let audio = new Audio(`/${folder}/` + track);
    currentSong.src = audio.src;
    if (!pause){
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
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const song = as[i];
        if (song.href.endsWith('.mp3')) {
            songs.push(decodeURIComponent(song.href.split(`/${folder}/`)[1]));
        }
    }
    let songUL = document.querySelector('.songList ul');
    songUL.innerHTML = "";
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
    // event listener to each song
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(li => {
        li.addEventListener('click', () => {
            let song = li.querySelector('.info div:first-child').innerText;
            playMusic(song);
        });
    });
    return songs;
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement('div');
        div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');
    let cardContainer = document.querySelector('.cardContainer');
    let array = Array.from(anchors)
        for(let i = 0; i < array.length; i++){
        const anchor = array[i];
        if (anchor.href.includes('/songs/')){
            let songFolder = anchor.href.split('/songs/')[1];
            let a = await fetch(`http://127.0.0.1:5500/songs/${songFolder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML += `<div data-folder="${songFolder}" class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
                    <!-- Green Circle -->
                    <circle cx="50" cy="50" r="50" fill="#4CAF50" />
                    <!-- Play Button SVG -->
                    <polygon points="35,30 35,70 70,50" fill="#000000" />
                </svg>                              
            </div>
            <img src="/songs/${songFolder}/cover.jpeg" alt="cover">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`;
        }
        }
    // load playlist songs when card is clicked
    Array.from(document.getElementsByClassName('card')).forEach(card => {
        card.addEventListener('click', async item => {
            folder = `songs/${item.currentTarget.dataset.folder}`;
            songs = await getSongs(folder);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    folder = 'songs/ncr';
    await getSongs(folder);
    playMusic(songs[0], true);
    
    // display all cards
    displayAlbums();

    // event listener to play/pause button
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg";
        } else {
            currentSong.pause();
            play.src = "svg/play.svg";
        }
    });
    // chatgpt event listener next and prev
    // event listener to next button
    next.addEventListener('click', () => {
        let currentIndex = songs.indexOf(decodeURIComponent(currentSong.src.split(`/${folder}/`)[1]));
        let nextIndex = (currentIndex + 1) % songs.length;
        playMusic(songs[nextIndex]);
    });

    // event listener to previous button
    prev.addEventListener('click', () => {
        let currentIndex = songs.indexOf(decodeURIComponent(currentSong.src.split(`/${folder}/`)[1]));
        let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        playMusic(songs[prevIndex]);
    });



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

    // volume set event listener
    document.querySelector('.volume>img').addEventListener('click', e => {
        console.log(e.target.src);
        if (e.target.src.includes('volume.svg')) {
            e.target.src = 'svg/mute.svg';
            console.log(e.target.src);
            currentSong.volume = 0;
            document.querySelector('.volume').getElementsByTagName('input')[0 ].value = 0;
        } else {
            e.target.src = 'svg/volume.svg';
            currentSong.volume = 0.3;
            document.querySelector('.volume').getElementsByTagName('input')[0 ].value = 30;
        }
    });

    // shuffle event listener 
    // chatgpt
    document.querySelector('.shuffle').addEventListener('click', () => {
            if (songs.length > 1) {
            let currentIndex = songs.indexOf(decodeURIComponent(currentSong.src.split(`/${folder}/`)[1]));
            let randomIndex = Math.floor(Math.random() * songs.length);
            while (currentIndex === randomIndex) {
                randomIndex = Math.floor(Math.random() * songs.length);
            }
            playMusic(songs[randomIndex]);
        }
    });
    // autoplay the next song
    currentSong.addEventListener('ended', () => {
        let currentIndex = songs.indexOf(decodeURIComponent(currentSong.src.split(`/${folder}/`)[1]));
        let nextIndex = (currentIndex + 1) % songs.length;
        playMusic(songs[nextIndex]);
    });
}

main();