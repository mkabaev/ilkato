/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var audiotypes = {
    "mp3": "audio/mpeg",
    "mp4": "audio/mp4",
    "ogg": "audio/ogg",
    "wav": "audio/wav"
};

function ss_soundbits(sound) {
    var audio_element = document.createElement('audio');
    if (audio_element.canPlayType) {
        for (var i = 0; i < arguments.length; i++) {
            var source_element = document.createElement('source');
            source_element.setAttribute('src', arguments[i]);
            if (arguments[i].match(/\.(\w+)$/i))
                source_element.setAttribute('type', audiotypes[RegExp.$1]);
            audio_element.appendChild(source_element);
        }
        audio_element.load();
        audio_element.playclip = function () {
            audio_element.pause();
            audio_element.currentTime = 0;
            audio_element.play();
        }
        return audio_element;
    }
}
// var sound = ss_soundbits('s1.mp3');
// var plopsound  = ss_soundbits('your/path/to/plopp.ogg', "your/path/to/plopp.mp3");

