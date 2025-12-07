const container = document.querySelector('.container'),

    musicImg = container.querySelector('.img-area img'),

    musicName = container.querySelector('.details .name'),

    musicArtist = container.querySelector('.details .artist'),

    mainAudio = container.querySelector('#main-audio'),

    playPauseBtn = container.querySelector('.play-pause'),

    prevBtn = container.querySelector('#previous'),

    nextBtn = container.querySelector('#next'),

    progressArea = container.querySelector('.progress-area'),

    progressBar = container.querySelector('.progress-bar'),

    musicList = container.querySelector('.music-list'),

    showMoreBtn = container.querySelector('#more'),

    hideMoreBtn = musicList.querySelector('#close');

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener('load', () => {
    // Calling the load music function once the window is loaded
    loadMusic(musicIndex);
    playingNow();
});

// Loading music function
function loadMusic(indexNum) {
    musicName.innerText = allMusic[indexNum - 1].name;
    musicArtist.innerText = allMusic[indexNum - 1].artist;
    musicImg.src = `Photos/${allMusic[indexNum - 1].img}.jpg`
    mainAudio.src = `Audio/${allMusic[indexNum - 1].src}.mp3`
};

// Play music function
function playMusic() {
    container.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = 'pause';
    mainAudio.play();
};

// Pause music function
function pauseMusic() {
    container.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = 'play_arrow';
    mainAudio.pause();
};

//Next Music function
function nextMusic() {
    // Adding the musicIndex by 1
    musicIndex++;

    // If musicIndex is more than array length then musicIndex will be 1 so the 1st song plays again
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//Prev Music function
function prevMusic() {
    // Decreasing the musicIndex by 1
    musicIndex--;

    // If musicIndex is less than 1 then musicIndex will be array length so the last song plays
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// play or music button
playPauseBtn.addEventListener('click', () => {
    const isPaused = container.classList.contains('paused');

    // if isPaused is true then call pauseMusic else call playMusic
    isPaused ? pauseMusic() : playMusic();
    playingNow();
});

// Next button
nextBtn.addEventListener('click', () => {
    // Calling next music function
    nextMusic();
});

// Previous button
prevBtn.addEventListener('click', () => {
    // Calling next music function
    prevMusic();
});

// Update progress bar width according tomusic current time
mainAudio.addEventListener('timeupdate', (e) => {
    // Get current time of the song
    const currentTime = e.target.currentTime;
    // Get total time of the song
    const duration = e.target.duration;

    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = container.querySelector('.current'),
        musicDuration = container.querySelector('.max');

    mainAudio.addEventListener('loadeddata', () => {
        //Update song duration
        let audioDuration = mainAudio.duration;
        let totalMinute = Math.floor(audioDuration / 60);
        let totalSecond = Math.floor(audioDuration % 60);

        if (totalSecond < 10) {
            totalSecond = `0${totalSecond}`
        }

        musicDuration.innerText = `${totalMinute}:${totalSecond}`;
    });

    //Update song currentTime
    let currentMinute = Math.floor(currentTime / 60);
    let currentSecond = Math.floor(currentTime % 60);

    if (currentSecond < 10) {
        currentSecond = `0${currentSecond}`
    }

    musicCurrentTime.innerText = `${currentMinute}:${currentSecond}`;
});

// Updating song according to progress line
progressArea.addEventListener('click', (e) => {
    //Getting the width of the line
    let progressLine = progressArea.clientWidth;

    // Getting the offset x value
    let clickedPoint = e.offsetX;

    //Getting song duration
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedPoint / progressLine) * songDuration;

    playMusic();
});

// Repeat, Shuffle icon changes
const repeatBtn = container.querySelector('#repeat');
repeatBtn.addEventListener('click', () => {
    // Getting the innerText of icon then 
    let getText = repeatBtn.innerText;

    switch (getText) {
        case 'repeat':
            repeatBtn.innerText = 'repeat_one';
            repeatBtn.setAttribute('title', 'Song Looped');
            break;

        case 'repeat_one':
            repeatBtn.innerText = 'shuffle';
            repeatBtn.setAttribute('title', 'Songs Shuffled');
            break;

        case 'shuffle':
            repeatBtn.innerText = 'repeat';
            repeatBtn.setAttribute('title', 'Playlist Looped');
            break;
    }
});

// Repeat, Shuffle function changes
mainAudio.addEventListener('ended', () => {


    let getText = repeatBtn.innerText;

    switch (getText) {
        case 'repeat': //Normal => When song ends plays the next song
            nextMusic();
            break;

        case 'repeat_one': //Loops the song
            loadMusic(musicIndex);
            playMusic();
            break;

        case 'shuffle':
            let random;

            do {
                random = Math.floor((Math.random() * allMusic.length) + 1);
            } while (random === musicIndex);

            musicIndex = random;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle('show');
});

hideMoreBtn.addEventListener('click', () => {
    showMoreBtn.click();
});

const ulTag = container.querySelector('ul');
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                     <audio class="${allMusic[i].src}" src="Audio/${allMusic[i].src}.mp3"></audio>
                     <span id="${allMusic[i].src}" class="audio-duration"></span>
                </li>`;
    ulTag.insertAdjacentHTML('beforeend', liTag);

}

// Adding onclick attribute
const allLiTag = ulTag.querySelectorAll('li');
function playingNow() {
    for (let j = 0; j < allLiTag.length; j++) {

        let audioTag = allLiTag[j].querySelector('.audio-duration');

        // Removing playing class from all others except from one which is playing
        if (allLiTag[j].classList.contains('playing')) {
            allLiTag[j].classList.remove('playing');
            let addDuration = audioTag.getAttribute('t-duration');
            audioTag.innerText = addDuration
        };


        if (allLiTag[j].getAttribute('li-index') === musicIndex) {
            allLiTag[j].classList.add('playing');
            audioTag.innerText = 'Playing';
        };

        allLiTag[j].setAttribute('onclick', 'clicked(this)');
    }
}

// Playing onclick
function clicked(element) {
    let getLiIndex = element.getAttribute('li-index');
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
