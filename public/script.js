const BASEURL = "http://localhost:5000/api";
const refreshrate = 5000;
var heartbeat = 3;


var cardStatusElements = document.querySelectorAll('.card-status');
cardStatusElements.forEach(function (cardStatusElement) {
    if (cardStatusElement.textContent.trim() !== 'Online') {
        cardStatusElement.style.display = 'block';
        cardStatusElement.style.color = '#FFA3A3';
    }
    else {
        var id = cardStatusElement.id;
        document.getElementById(id).style.color = '#A3FFA3';
        cardStatusElement.style.display = 'block';
    }
});



async function getUserString(id) {
    const response = await fetch(BASEURL + "/user", {
        method: 'GET'
    });
    const data = await response.json();
    for (var i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            return data[i].userstring;
        }
    }
}

async function getMachineNb() {
    const response = await fetch(BASEURL + "/machines", {
        method: 'GET',
    });
    const data = await response.json();
    return data.length;
}


getMachineNb().then(machineCount => {
    if (machineCount == 0) {
        var statustitle = document.querySelector(".status");
        statustitle.textContent = "No machines found";
        statustitle.style.color = "#FFA3A3";
    }
}).catch(error => {
    var statustitle = document.querySelector(".status");
    statustitle.textContent = "Network error, please try again latber.";
    statustitle.style.color = "#FFA3A3";
});


getMachineNb().then(machineCount => {
    for (let i = 1; i <= machineCount; i++) {
        var card = document.createElement("div");
        var body = document.querySelector("body");
        body.appendChild(card);
        card.className = "card";
        card.id = "card" + i;
        var flex = document.createElement("div");
        card.appendChild(flex);
        flex.className = "flexbox";
        var cardTitle = document.createElement("h3");
        cardTitle.className = "card-title";
        cardTitle.id = "card-title" + i;
        getUserString(i).then(userstring => {
            document.querySelector("#card-title" + i).textContent = userstring;
        });
        flex.appendChild(cardTitle);
        var rebootImg = document.createElement("img");
        rebootImg.src = "../imgs/reboot.png";
        rebootImg.className = "reboot";
        rebootImg.draggable = false;
        flex.appendChild(rebootImg);
        var statusp = document.createElement("p");
        statusp.className = "card-status";
        statusp.id = "status" + i;
        statusp.textContent = "Online";
        card.appendChild(statusp);
        var grid = document.createElement("div");
        grid.className = "grid-container";
        card.appendChild(grid);
        var uptime = document.createElement("div");
        var griditem = document.createElement("div");
        griditem.className = "grid-item";
        grid.appendChild(griditem);
        uptime.className = "uptime";
        uptime.id = "uptime" + i;
        uptime.textContent = "Uptime: Loading...";
        griditem.appendChild(uptime);
        var heartbeatcontainer = document.createElement("div");
        heartbeatcontainer.className = "heartbeat-container";
        for (var j = 1; j <= 3; j++) {
            var heartbeat = document.createElement("div");
            heartbeat.className = "heartbeat";
            heartbeat.id = "hb" + i + j;
            heartbeatcontainer.appendChild(heartbeat);
        }
        griditem.appendChild(heartbeatcontainer);
        var griditem = document.createElement("div");
        griditem.className = "grid-item";
        grid.appendChild(griditem);
        var load = document.createElement("div");
        load.className = "load";
        load.id = "load" + i;
        load.textContent = "Load avg: Loading...";
        griditem.appendChild(load);
        var loadprogress = document.createElement("progress");
        loadprogress.className = "load-progress";
        loadprogress.id = "load-progress" + i;
        loadprogress.value = 0;
        loadprogress.max = 100;
        griditem.appendChild(loadprogress);
        var griditem = document.createElement("div");
        griditem.className = "grid-item";
        grid.appendChild(griditem);
        var memory = document.createElement("div");
        memory.className = "memory";
        memory.id = "memory" + i;
        memory.textContent = "Memory usage: Loading...";
        griditem.appendChild(memory);
        var memoryprogress = document.createElement("progress");
        memoryprogress.className = "memory-progress";
        memoryprogress.id = "memory-progress" + i;
        memoryprogress.value = 0;
        memoryprogress.max = 100;
        griditem.appendChild(memoryprogress);
        var griditem = document.createElement("div");
        griditem.className = "grid-item";
        grid.appendChild(griditem);
        var disk = document.createElement("div");
        disk.className = "disk";
        disk.id = "disk" + i;
        disk.textContent = "Disk usage: Loading...";
        griditem.appendChild(disk);
        var diskprogress = document.createElement("progress");
        diskprogress.className = "disk-progress";
        diskprogress.id = "disk-progress" + i;
        diskprogress.value = 0;
        diskprogress.max = 100;
        griditem.appendChild(diskprogress);
        var griditem = document.createElement("div");
        griditem.className = "grid-item";
        grid.appendChild(griditem);
        var temp = document.createElement("div");
        temp.className = "temp";
        temp.id = "temp" + i;
        temp.textContent = "Temperature: Loading...";
        griditem.appendChild(temp);
        var tempprogress = document.createElement("progress");
        tempprogress.className = "temp-progress";
        tempprogress.id = "temp-progress" + i;
        tempprogress.value = 0;
        tempprogress.max = 100;
        griditem.appendChild(tempprogress);

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
    var progressElements = document.querySelectorAll('progress');
    progressElements.forEach(function (progressElement) {
        var value = progressElement.value;
        var percentFree = progressElement.max - value;
        var colorValue = color(percentFree);
        var id = progressElement.id;
        stylesheet = document.styleSheets[0];
        var found = false;
        if (stylesheet.cssRules.length > 0) {
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
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                uptimems = data[i].uptime;
            }
        }
        document.querySelector("#uptime" + id).textContent = "Uptime: " + dhm(uptimems);
    }
    );
}


function getLoadData(id) {
    fetch(BASEURL + "/load", {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                document.querySelector("#load" + id).textContent = "Load: " + data[i].load;
                updateprogresssmooth(document.querySelector("#load-progress" + id).value, data[i].load, "#load-progress" + id);
            }
        }
    }
    );
}


function getMemoryData(id) {
    fetch(BASEURL + "/memusage", {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                document.querySelector("#memory" + id).textContent = "Memory usage: " + data[i].memusage;
                updateprogresssmooth(document.querySelector("#memory-progress" + id).value, data[i].memusage, "#memory-progress" + id);
            }
        }
    }
    );
}


function getDiskData(id) {
    fetch(BASEURL + "/diskusage", {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                document.querySelector("#disk" + id).textContent = "Disk usage: " + data[i].diskusage;
                updateprogresssmooth(document.querySelector("#disk-progress" + id).value, data[i].diskusage, "#disk-progress" + id);
            }
        }
    }
    );
}


function getTemperatureData(id) {
    fetch(BASEURL + "/temp", {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                document.querySelector("#temp" + id).textContent = "Temperature: " + data[i].temp;
                updateprogresssmooth(document.querySelector("#temp-progress" + id).value, data[i].temp, "#temp-progress" + id);
            }
        }
    }
    );
}


function heartbeatupdate(id) {
    fetch(BASEURL + "/lastseen", {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                var timenow = new Date().getTime();
                if (timenow - data[i].lastseen <= refreshrate) {
                    for (var j = 1; j <= 3; j++) {
                        document.getElementById("hb" + id + j).style.backgroundColor = "#A3FFA3";
                        updateStatusToOnline(id);
                    }
                } else if (timenow - data[i].lastseen <= 2 * refreshrate) {
                    for (var j = 1; j <= 2; j++) {
                        document.getElementById("hb" + id + j).style.backgroundColor = "#A3FFA3";
                    }
                    document.getElementById("hb" + id + 3).style.backgroundColor = "#FFA3A3";
                    updateStatusToOnline(id);
                }
                else if (timenow - data[i].lastseen <= 3 * refreshrate) {
                    document.getElementById("hb" + id + 1).style.backgroundColor = "#A3FFA3";
                    for (var j = 2; j <= 3; j++) {
                        document.getElementById("hb" + id + j).style.backgroundColor = "#FFA3A3";
                    }
                    updateStatusToOnline(id);
                }
                else {
                    for (var j = 1; j <= 3; j++) {
                        document.getElementById("hb" + id + j).style.backgroundColor = "#FFA3A3";
                    }
                    document.querySelector("#status" + id).textContent = "Offline";
                    document.querySelector("#status" + id).style.color = "#FFA3A3";
                }
            }
        }
    }
    );
}


function updateTitle() {
    var down = 0;
    var title = document.querySelector(".status")
    getMachineNb().then(machineCount => {
        for (var i = 1; i <= machineCount; i++) {
            if (document.querySelector("#status" + i).textContent == "Offline") {
                down++;
            }
        }
        if (down > 0 && down < machineCount) {
            title.textContent = down + "/" + machineCount + " machines down, Time to fix!";
            title.style.color = "#F99C39";
        } else if (down == machineCount) {
            title.textContent = "All machines down, PANIC!";
            title.style.color = "#FFA3A3";
        } else {
            title.textContent = "All machines up and running";
            title.style.color = "#85FFC7";
        }
    });


}


function updateStatusToOnline(id) {
    document.querySelector("#status" + id).textContent = "Online";
    document.querySelector("#status" + id).style.color = "#ffffff";
}


function updatedata() {
    getMachineNb().then(machineCount => {
        for (var i = 1; i <= machineCount; i++) {
            heartbeatupdate(i);
            if (document.querySelector("#status" + i).textContent == "Online") {
                updateTitle();
                getuptimedata(i);
                getLoadData(i);
                getMemoryData(i);
                getDiskData(i);
                getTemperatureData(i);
            }
        }
    });
}


getMachineNb().then(machineCount => {
    if (machineCount > 0) {
        updatedata();
        setInterval(updatedata, 5000);
    }
});


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


function updateprogresssmooth(oldv, newv, barid) {
    var duration = 200;
    var start = new Date().getTime();
    var end = start + duration;
    var progress = 0;
    var interval = setInterval(function () {
        var now = new Date().getTime();
        progress = Math.min((now - start) / duration, 1);
        var result = oldv + (newv - oldv) * progress;
        document.querySelector(barid).value = Math.round(result);
        if (progress == 1) {
            clearInterval(interval);
        }
    }, 10);
    setTimeout(updatecolors, 550);
}