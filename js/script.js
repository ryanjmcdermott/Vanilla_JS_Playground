window.onload = function() {
    
    const container = document.querySelector("video-container"),
    mainVideo = container.querySelector("video"),
    videoTimeline = container.querySelector("video-timeline"),
    progressBar = container.querySelector("progress-bar"),
    volumeBtn = container.querySelector(".volume"),
    volumeBtnIcon = volumeBtn.querySelector("i"),
    volumeSlider = container.querySelector(".left input"),
    currentVidTime = container.querySelector("current-time"),
    videoDuration = container.querySelector("video-duration"),
    skipBackward = container.querySelector(".skip-backward"),
    skipForward = container.querySelector(".skip-forward"),
    playPauseBtn = container.querySelector(".play-pause"),
    playPauseBtnIcon = playPauseBtn.querySelector("i"),
    speedBtn = container.querySelector(".playback-speed"),
    speedBtnIcon = speedBtn.querySelector("span"),
    speedOptions = container.querySelector(".speed-options"),
    fullScreenBtn = container.querySelector(".fullscreen"),
    picInPicBtn = container.querySelector(".pic-in-pic");
    let timer;
    
    // Hide video controls on Timeout
    const hideControls = () => {
        if (mainVideo.paused) return; // if video is paused, return to show controls
        timer = setTimeout(()=> {
            container.classList.remove("show-controls");
        }, 3000);
    };

    hideControls();

    container.addEventListener("mousemove", () => {
        container.classList.add("show-controls"); // add show-controls class on mousemove
        clearTimeout(timer); // clear timer
        hideControls(); // calling hideControls
    });

    // FORMAT TIMECODE
    function formatTime(time) {
        // getting seconds, minutes, hours
        let seconds = Math.floor(time % 60), minutes = Math.floor(time / 60) % 60, hours = Math.floor(time / 3600);

        // adding 0 at the beginning if the value is less than 10
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        hours = hours < 10 ? `0${hours}` : hours;

        // if hours is 0, return minutes and seconds only, else return all
        if (hours == 0) {
            return `${minutes}:${seconds}`;
        } else {
            return `${hours}:${minutes}:${seconds}`;
        }
    }

    // Update progress bar with current time
    mainVideo.addEventListener("timeupdate", e => {
        let { currentTime, duration } = e.target; // getting currentTime & duration of the video
        let percent = (currentTime / duration) * 100; // getting percent
        progressBar.style.width = `${percent}%`;
        currentVidTime.innerText = formatTime(currentTime);
    });

    // setting video duration in timecode
    mainVideo.addEventListener("loadeddata", e => {
        videoDuration.innerText = formatTime(e.target.duration);
    })

    volumeBtn.addEventListener("click", () => {
        if(!volumeBtnIcon.classList.contains("fa-volume-high")) { // if volume icon isn't volume high icon
            mainVideo.volume = 0.5; // passing 0.5 value as video volume
            volumeBtnIcon.classList.replace("fa-volume-xmark", "fa-volume-high");
        } else {
            mainVideo.volume = 0.0; // passing 0.5 value as video volume
            volumeBtnIcon.classList.replace("fa-volume-high", "fa-volume-xmark");
        }
        volumeSlider.value = mainVideo.volume;
    });
    
    volumeSlider.addEventListener("input", e => {
        mainVideo.volume = e.target.value; // passing slider value as video volume
        if (e.target.value == 0) { // if slider value is 0, charge icon to mute icon
            volumeBtnIcon.classList.replace("fa-volume-high", "fa-volume-xmark");
            console.log("value = 0");
        } else  {
            volumeBtnIcon.classList.replace("fa-volume-xmark", "fa-volume-high"); 
        }
        volumeSlider.value = mainVideo.volume; // update slider value to equal video volume
    });

    // SKIP BACKWARD 5 SECONDS
    skipBackward.addEventListener("click", () => {
        mainVideo.currentTime -= 5; // subtract 5 seconds from the current video time
    });
    
    // SKIP FORWARD 5 SECONDS
    skipForward.addEventListener("click", () => {
        mainVideo.currentTime += 5; // add 5 seconds from the current video time
    });

    // PLAY / PAUSE
    // if video is paused play the video, else pause the video
    playPauseBtn.addEventListener("click", () => {
        mainVideo.paused ? mainVideo.play() : mainVideo.pause();
    });

    // if video is paused, change icon to play
    mainVideo.addEventListener("pause", () => {
        playPauseBtnIcon.classList.replace("fa-pause", "fa-play");
    });

    // if video is paused, change icon to play
    mainVideo.addEventListener("play", () => {
        playPauseBtnIcon.classList.replace("fa-play", "fa-pause");
    });
    
    // SPEED OPTIONS
    // toggles the speedOptions "show" class on click
    speedBtn.addEventListener("click", () => {
        speedOptions.classList.toggle("show"); 
    });

    // adjusts speed of video from speedOptions menu
    speedOptions.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", () => {
            mainVideo.playbackRate = option.dataset.speed;
            speedOptions.querySelector(".active").classList.remove("active");
            option.classList.add("active");
        });
    });
    
    // if non-speed elements are clicked, remove "show" class from speedOptions
    document.addEventListener("click", e => {
        if(e.target !== speedBtn && e.target !== speedBtnIcon) {
            speedOptions.classList.remove("show");
        }
    });

    // PICTURE IN PICTURE
    picInPicBtn.addEventListener("click", () => {
        mainVideo.requestPictureInPicture();
    });

    // FULLSCREEN
    fullScreenBtn.addEventListener("click", () => {
        container.classList.toggle("fullscreen");
        if (document.fullscreenElement) {
            fullScreenBtn.classList.replace("fa-compress", "fa-expand");
            return document.exitFullscreen();
        }
        fullScreenBtn.classList.replace("fa-expand", "fa-compress");
        container.requestFullscreen();
    });

    // VIDEO TIMELINE
    // updates video currentTime when timeline is clicked
    videoTimeline.addEventListener("click", e => {
        let timelineWidth = e.target.clientWidth; // client timeline width
        mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currentTime
    });

    // Draggable Progess Bar 
    const draggableProgressBar = e => {
        let timelineWidth = videoTimeline.clientWidth; // client videoTimeline width
        progressBar.style.width = `${e.offsetX}px`; // passing offsetX value as progressBar width
        mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currentTime
        currentVidTime.innerText = formatTime(mainVideo.currentTime); // passing video current time as currentVideoTime innerText
    };

    // calling draggableProgress function on mousemove event
    videoTimeline.addEventListener("mousedown", () => {
        videoTimeline.addEventListener("mousemove", draggableProgressBar);
    });
    
    // removing mousemove listener on mouseup event
    container.addEventListener("mouseup", () => {
        videoTimeline.removeEventListener("mousemove", draggableProgressBar);
    });

    // progress bar timecode on mouseover
    videoTimeline.addEventListener("mousemove", e => {
        const progressTime = videoTimeline.querySelector("span");
        let offsetX = e.offsetX; // getting mouseX position
        progressTime.style.left = `${offsetX}px`; // passing offsetX value as progressTime left value 
        let timelineWidth = videoTimeline.clientWidth; // client videoTimeline width
        let percent = (e.offsetX / timelineWidth) * mainVideo.duration; // getting percent
        progressTime.innerText = formatTime(percent); // passing percent as progressTime innerText
    });
};

