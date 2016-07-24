function CreateTimer(id, _class, length, size) {
    var divTimer = $('<div/>', {
        id: id,
        class: 'chart ' + _class,
    }).append('<span class="digit"></span>');
    divTimer.easyPieChart({
        //easing: 'easeOutCirc',
        animate: 500,
        scaleColor: '#660000',
        scaleLength: 12,
        lineWidth: 24,
        lineCap: 'butt', //butt round square
        size: 200,
        trackColor: false,
        barColor: function (percent) {
            return (percent > 80 ? 'red' : '#660000')
        }, //#0033CC
    });

    var sec = length;

    var d = 100 / sec;
    var c = 0;
    setInterval(function () {
        sec = sec - 1;
        c = c + d;
        divTimer.data('easyPieChart').update(c);
        //if (sec>65){ timer.data('easyPieChart').options.lineWidth = 48; }; //#0033CC
        $('span', divTimer).text(sec < 0 ? sec : sec.toString().toHHMMSS());
    }, 1000);
    return divTimer;
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours > 0 ? hours + ':' : '' + minutes + ':' + seconds;
}