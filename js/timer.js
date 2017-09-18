var timerId;
function createTimer(id, _class, length, size) {
    var divTimer = $('<div/>', {
        id: id,
        width: size,
        height: size,
        class: _class,
    }).append('<span class="digit"></span>');

    divTimer.easyPieChart({
        //easing: 'easeOutCirc',
        animate: 500,
        scaleColor: '#660000',
        scaleLength: size / 10,
        lineWidth: size / 10,
        lineCap: 'butt', //butt round square
        size: size,
        trackColor: false,
        barColor: function (percent) {
            return (percent > 80 ? 'red' : '#660000')
        }, //#0033CC
    });
    var sec = length;
    var d = 100 / sec;
    var c = 0;
    timerId = setInterval(function () {
        sec = sec - 1;
        c = c + d;
        divTimer.data('easyPieChart').update(c);
        //if (sec>65){ timer.data('easyPieChart').options.lineWidth = 48; }; //#0033CC
        $('span', divTimer).text(sec < 0 ? sec : sec.toString().toHHMMSS());
    }, 1000);

    divTimer.children('span').css({'line-height': size + 'px', 'font-size': size / 5 + 'px'});

    return divTimer;
}
function stopTimer() {
    if (timerId !== undefined) {
        clearInterval(timerId);
    }
}
function startTimer(length, callback) {
    var divTimer = $("#timer");
    if (divTimer.length) {
        var sec = length;
        var d = 100 / sec;
        var c = 0;
        timerId = setInterval(function () {
            sec = sec - 1;
            if (callback) {
                callback(sec);
            }
            c = c + d;
            divTimer.data('easyPieChart').update(c);
            //if (sec>65){ timer.data('easyPieChart').options.lineWidth = 48; }; //#0033CC
            $('span', divTimer).text(sec < 0 ? sec : sec.toString().toHHMMSS());
        }, 1000);
        return true;
    } else {
        return false;
    }
}