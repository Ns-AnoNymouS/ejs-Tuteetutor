const session = require('express-session');
const db = require('./db')

class Time {
    constructor(hours, minutes, part) {
        this.hours = hours,
        this.minutes = minutes,
        this.part = part
    }

    valueOf() {
        if (this.hours == 12 && this.minutes == 0 && this.part == "PM"){
            return this.hours * 60 + this.minutes; 
        }
        if (this.hours == 12 && this.minutes == 0 && this.part == "AM"){
            return (this.hours+12) * 60 + this.minutes; 
        }
        if (this.part == "AM"){
            return this.hours * 60 + this.minutes;
        }else{
            return (this.hours+12) * 60 + this.minutes;
        }
    }
}

async function fetchData(username, password) {
    let sts = await db.getEmail(username, password)

    if (sts == "User not Found" || sts == "Wrong Password") {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login"
        return sts;
    }
    else {
        email.innerText = sts;
        name.innerText = username;
    }
    fetchClasses();
    fetchHolidays();
}


function formatTime(time) {
    let hours = time.hours
    if (time.hours < 10) {
        hours = `0${time.hours}`;
    }
    let minutes = time.minutes
    if (time.minutes == 0) {
        minutes = '00';
    }
    return `${hours}:${minutes} ${time.part}`;
}

function present() {
    fetch(`${baseUrl}/getCurrent`).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ERROR! Status : ${response.status}`);
        }
        return response.json();
    }).then(sts => {
        if ('room' in sts) {
            room.textContent = "Room no: " + sts.room;
            classNow.textContent = sts.class;
            time.textContent = formatTime(sts.startTime) + ' - ' + formatTime(sts.endTime);
        }
        else if ('break' in sts) {
            room.style.display = "none";
            classNow.textContent = sts.break;
            time.textContent = formatTime(sts.startTime) + ' - ' + formatTime(sts.endTime);
        }
        else {
            room.style.display = "none";
            classNow.style.display = "none";
            time.style.display = "none";
            noClass.style.display = "block"
            noClass.textContent = "No Classes Right now!!!"
        }
    })
}

async function getAllClasses() {
    date = new Date();
    day = date.getDay();
    if (date.getHours() > 12) {
        time = new Time(date.getHours() - 12, date.getMinutes(), 'PM')
    }
    else {
        time = new Time(date.getHours(), date.getMinutes(), 'AM')
    }
    data = []
    let sts = await db.getAllClasses(day)
    sts.forEach(function (item) {
        item.present = false;
        formatedStart = new Time(item.startTime.hours, item.startTime.minutes, item.startTime.part)
        formatedEnd = new Time(item.endTime.hours, item.endTime.minutes, item.endTime.part)
        item.startTime = formatedStart
        item.endTime = formatedEnd
        if (formatedStart <= time && formatedEnd >= time) {
            item.present = true;
        }
    })
    sts.sort((a, b) => a.startTime - b.startTime)

    let upcomming = false
    sts.forEach(function (item) {
        formatedStart = new Time(item.startTime.hours, item.startTime.minutes, item.startTime.part)
        formatedEnd = new Time(item.endTime.hours, item.endTime.minutes, item.endTime.part)
        if (formatedStart >= time && !item.present && !upcomming) {
            upcomming = true
            item.upcomming = true
        }
    })
    return sts
}

async function fetchClasses() {
    fetch(`${baseUrl}/getAllClasses`).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ERROR! Status : ${response.status}`);
        }
        return response.json();
    }).then(sts => {
        if (sts.length == 0) {
            room.style.display = "none";
            classNow.style.display = "none";
            time.style.display = "none";
            noClass.style.display = "block"
            noClass.style.paddingTop = '75px'
            noClass.style.paddingBottom = '75px'
            noClass.style.textAlign = 'Center'
            noClass.textContent = "No Classes Today!!!"
        }
        else {
            sts.forEach(function (item) {
                var itemDiv = document.createElement("div");
                itemDiv.classList.add("classes-card")
                if (item.present) {
                    itemDiv.id = "present-classes-card"
                }
                if (item.upcomming) {
                    itemDiv.id = "upcomming-classes-card"
                }
                itemDiv.innerHTML = '<p>Room no: ' + item.room + '</p>' +
                    '<h3>' + item.class + '</h3>' +
                    '<p>' + formatTime(item.startTime) + ' - ' + formatTime(item.endTime) + '</p>';
                classesDetails.appendChild(itemDiv);

                itemDiv.style.textAlign = 'center'
                itemDiv.style.margin = '10px'

                var p = itemDiv.querySelector('p')
                p.style.fontSize = 'larger'

                var h3 = itemDiv.querySelector('h3')
                h3.style.fontSize = 'x-large'
                h3.style.margin = '10px';
            });
        }
        var element = document.getElementById('present-classes-card');
        var upcomming = document.getElementById('upcomming-classes-card');
        if (element) {
            const targetOffset = element.offsetTop - classesDetails.offsetTop;
            classesDetails.scrollTop = targetOffset;
        }
        else if (upcomming) {
            const targetOffset = upcomming.offsetTop - classesDetails.offsetTop;
            classesDetails.scrollTop = targetOffset;
        }
    })
        .catch(error => {
            console.error('Error fetching data:' + error);
        })
}

function fetchHolidays() {
    fetch(`${baseUrl}/getHolidays`).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ERROR! Status : ${response.status}`);
        }
        return response.json();
    }).then(sts => {
        if (sts.length == 0) {
            var itemDiv = document.createElement('div');
            itemDiv.innerHTML = '<h2>No upcoming holidays<br>in this semester</h2>'
            holidayDetails.appendChild(itemDiv)
            itemDiv.style.textAlign = 'center'
            itemDiv.style.background = 'linear-gradient(to right, #88dbf9, #86d3f14d)';
            itemDiv.style.margin = '10px';
            itemDiv.style.borderRadius = '2vh';
            itemDiv.style.padding = '10px';
            itemDiv.style.marginTop = '20px';
        }
        else {
            sts.forEach(function (item) {
                var itemDiv = document.createElement("div");
                itemDiv.classList.add("holiday-card");
                itemDiv.innerHTML = '<h3>' + item.holiday + '</h3>' + '<p>' + item.date + '-' + (item.month + 1) + '-' + item.year + '</p>';
                holidayDetails.appendChild(itemDiv)

                itemDiv.style.borderRadius = '2vh';

                var h3 = itemDiv.querySelector('h3')
                h3.style.textAlign = 'center';
                h3.style.fontSize = '3.5vh'

                var p = itemDiv.querySelector('p')
                p.style.textAlign = 'center';
                p.style.marginBottom = '10px';
                p.style.fontSize = '1.2rem'
            })
        }
    })
}
