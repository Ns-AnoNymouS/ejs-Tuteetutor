document.getElementById('side').addEventListener("mouseover", (event) => {
    event.preventDefault();
    let btn = document.querySelector('#side');
    let sidebar = document.querySelector('.sidebar');

    btn.onmouseover = function () {
        sidebar.classList.toggle('active')
    };

    btn.addEventListener("mouseout", () => {
        sidebar.classList.remove('active');
    });
})

let room = document.getElementById('presentRoom');
let classNow = document.getElementById('present');
let time = document.getElementById('presentTime')
let noClass = document.getElementById('noClass')
let holiday = document.getElementById('holiday')
let classesDetails = document.querySelector('.classes-content')
let holidayDetails = document.querySelector('.holidays-content')
let name = document.getElementById("profile-name")
let email = document.getElementById("profile-email")

function fetchData() {
    const username = window.cookies.username;
    const password = window.cookies.token;
    fetch(`${baseUrl}/getEmail?username=${username}&password=${password}`).then((response)=>{
        if (!response.ok) {
            throw new Error(`HTTP ERROR! Status : ${response.status}`);
        }
        return response.text();
    }).then(sts => {
        if (sts == "User not Found" || sts == "Wrong Password"){
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login"
            return;
        }
        else {
            email.innerText = sts;
            name.innerText = username;
        }
    })
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

function fetchClasses() {
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
                if (item.present){
                    itemDiv.id = "present-classes-card"
                }
                if (item.upcomming){
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

window.onload = fetchData;

var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
var yValues = [55, 49, 44, 24, 15];
var barColors = ["red", "green","blue","orange","brown"];

new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "World Wine Production 2018"
    }
  }
});