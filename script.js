// Select all elements with class card-status
var cardStatusElements = document.querySelectorAll('.card-status');
const BASEURL = "http://localhost:5000/api";
// Loop through each card-status element
cardStatusElements.forEach(function (cardStatusElement) {
    // Check if the text content is not "Online"
    if (cardStatusElement.textContent.trim() !== 'Online') {
        // display the element
        cardStatusElement.style.display = 'block';
        cardStatusElement.style.color = '#FFA3A3';
    }
    else {
        // get id of element
        var id = cardStatusElement.id;
        // change color of element by id
        document.getElementById(id).style.color = '#A3FFA3';
        // display the element
        console.log(document.querySelector(".status").textContent);
        console.log("Not all systems are operational");
        cardStatusElement.style.display = 'block';
    }
});

function color(percentFree) {
    if (percentFree > 50) {
        return '#A3FFA3';
    } else if (percentFree > 25) {
        return '#F99C39';
    } else {
        return '#FFA3A3';
    }
}



function updatecolors() {
    console.log("Updating colors");
    var progressElements = document.querySelectorAll('progress');
    progressElements.forEach(function (progressElement) {
        // Get the value attribute
        var value = progressElement.value;
        var percentFree = progressElement.max - value;
        var colorValue = color(percentFree);
        var id = progressElement.id;
        console.log("styling id:", id);
        stylesheet = document.styleSheets[0];
        var found = false;
        if (stylesheet.cssRules.length > 0) {
            // Find the right rule
            for (var i = 0; i < stylesheet.cssRules.length; i++) {

                if (stylesheet.cssRules[i].selectorText == "#" + id + "::-webkit-progress-value") {
                    stylesheet.cssRules[i].style.backgroundColor = colorValue;
                    found = true;
                }
                if (stylesheet.cssRules[i].selectorText == "#" + id + "::-moz-progress-bar") {
                    stylesheet.cssRules[i].style.backgroundColor = colorValue;
                    found = true;
                }
            }
            if (!found) {
                stylesheet.insertRule("#" + id + "::-webkit-progress-value { background-color: " + colorValue + "; }", 0);
                try {
                    stylesheet.insertRule("#" + id + "::-moz-progress-bar { background-color: " + colorValue + "; }", 0);
                }
                catch (e) {
                }
            }
        } else {
            // Add the rule
            stylesheet.insertRule("#" + id + "::-webkit-progress-value { background-color: " + colorValue + "; }", 0);
            try {
                stylesheet.insertRule("#" + id + "::-moz-progress-bar { background-color: " + colorValue + "; }", 0);
            }
            catch (e) {
            }
        }
    });
}

function getuptimedata(id) {

    uptimems = 0;
    fetch(BASEURL + "/uptime", {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        // find the id of the element
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                uptimems = data[i].uptime;
            }
        }
        document.querySelector(".uptime").textContent = "Uptime: " + dhm(uptimems);
    }
    );
}

function getLoadData(id) {
    fetch(BASEURL + "/load", {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        // find the id of the element
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                document.querySelector(".load").textContent = "Load: " + data[i].load;
                updateprogresssmooth(document.querySelector(".load-progress").value, data[i].load, ".load-progress");
            }
        }
    }
    );
    console.log("Load data updated");
}

function getMemoryData(id) {
    fetch(BASEURL + "/memusage", {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        // find the id of the element
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                console.log("memory data: ", data[i].memusage);
                document.querySelector(".memory").textContent = "Memory usage: " + data[i].memusage;
                updateprogresssmooth(document.querySelector(".memory-progress").value, data[i].memusage, ".memory-progress");
            }
        }
    }
    );
    console.log("Memory data updated");
}

function getDiskData(id) {
    fetch(BASEURL + "/diskusage", {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        // find the id of the element
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                document.querySelector(".disk").textContent = "Disk usage: " + data[i].diskusage;
                updateprogresssmooth(document.querySelector(".disk-progress").value, data[i].diskusage, ".disk-progress");
            }
        }
    }
    );
    console.log("Disk data updated");
}

function updatedata() {
    getuptimedata(1);
    getLoadData(1);
    getMemoryData(1);
    getDiskData(1);
}
updatedata()
setInterval(updatedata, 10000);

function dhm(ms) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const sec = Math.floor(minutesms / 1000);
    highestunit = days > 0 ? days + "d" : hours > 0 ? hours + "h" : minutes > 0 ? minutes + "m" : sec + "s";
    return highestunit;
}

function updateprogresssmooth(oldv, newv, barclass) {
    // The whole process should take 0.5 seconds
    var duration = 200;
    var start = new Date().getTime();
    var end = start + duration;
    var progress = 0;
    var interval = setInterval(function () {
        var now = new Date().getTime();
        progress = Math.min((now - start) / duration, 1);
        var result = oldv + (newv - oldv) * progress;
        document.querySelector(barclass).value = result;
        if (progress == 1) {
            clearInterval(interval);
        }
    }, 10);
    // run udpate colors after the progress bar is updated
    setTimeout(updatecolors, 550);
}