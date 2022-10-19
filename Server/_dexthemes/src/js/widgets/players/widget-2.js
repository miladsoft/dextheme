"use strict";

// Class definition
var DEXPlayersWidget2 = function () {
    // Private methods
    var initPlayer = function() {
        // https://www.w3schools.com/jsref/dom_obj_audio.asp
        var element = document.getElementById("dex_player_widget_2");

        if ( !element ) {
            return;
        }

        var audio = element.querySelector('[data-dex-element="audio-track-1"]');
        var progress = element.querySelector('[data-dex-element="progress"]');        
        var currentTime = element.querySelector('[data-dex-element="current-time"]');
        var duration = element.querySelector('[data-dex-element="duration"]');
        var playButton = element.querySelector('[data-dex-element="play-button"]');
        var playIcon = element.querySelector('[data-dex-element="play-icon"]');
        var pauseIcon = element.querySelector('[data-dex-element="pause-icon"]');

        var replayButton = element.querySelector('[data-dex-element="replay-button"]');
        var shuffleButton = element.querySelector('[data-dex-element="shuffle-button"]');
        var playNextButton = element.querySelector('[data-dex-element="play-next-button"]');
        var playPrevButton = element.querySelector('[data-dex-element="play-prev-button"]');

        var formatTime = function(time) {
            var s = parseInt(time % 60);
            var m = parseInt((time / 60) % 60);

            return m + ':' + (s < 10 ? '0' : '') + s;
        }

        // Duration
        duration.innerHTML = formatTime(audio.duration); 

        // Update progress
        var setBarProgress = function() {
            progress.value = (audio.currentTime / audio.duration) * 100;
        }
        
        // Handle audio update
        var handleAudioUpdate = function() {
            currentTime.innerHTML = formatTime(audio.currentTime);

            setBarProgress();

            if (this.ended) {
                playIcon.classList.remove('d-none');
                pauseIcon.classList.add('d-none');
            }
        }

        audio.addEventListener('timeupdate', handleAudioUpdate);

        // Handle play
        playButton.addEventListener('click', function() {
            if (audio.duration > 0 && !audio.paused) {
                audio.pause();

                playIcon.classList.remove('d-none');
                pauseIcon.classList.add('d-none');
            } else if (audio.readyState >= 2) {
                audio.play();

                playIcon.classList.add('d-none');
                pauseIcon.classList.remove('d-none');
            }
        });

        // Handle replay
        replayButton.addEventListener('click', function() {
            if (audio.readyState >= 2) {
                audio.currentTime = 0;
                audio.play();

                playIcon.classList.add('d-none');
                pauseIcon.classList.remove('d-none');
            }
        });

        // Handle prev play
        playPrevButton.addEventListener('click', function() {
            if (audio.readyState >= 2) {
                audio.currentTime = 0;
                audio.play();

                playIcon.classList.add('d-none');
                pauseIcon.classList.remove('d-none');
            }
        });

        // Handle next play
        playNextButton.addEventListener('click', function() {
            if (audio.readyState >= 2) {
                audio.currentTime = 0;
                audio.play();

                playIcon.classList.add('d-none');
                pauseIcon.classList.remove('d-none');
            }
        });

        // Shuffle replay
        shuffleButton.addEventListener('click', function() {
            if (audio.readyState >= 2) {
                audio.currentTime = 0;
                audio.play();

                playIcon.classList.add('d-none');
                pauseIcon.classList.remove('d-none');
            }
        });

        // Handle track change
        progress.addEventListener('change', function() {
            audio.currentTime = progress.value;

            playIcon.classList.add('d-none');
            pauseIcon.classList.remove('d-none');
            audio.play();
        });
    }

    // Public methods
    return {
        init: function () {
            initPlayer();
        }   
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = DEXPlayersWidget2;
}

// Window load
window.addEventListener("load", function() {
    DEXPlayersWidget2.init();
}); 