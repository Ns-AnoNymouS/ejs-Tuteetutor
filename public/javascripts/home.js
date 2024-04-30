document.getElementById('side').addEventListener("mouseover", () => {
    let sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('active');
});

document.getElementById('side').addEventListener("mouseout", () => {
    let sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('active');
});

let classesDetails = document.querySelector('.classes-content');

function scrollClasses() {
    var element = document.getElementById('present-classes-card');
    var upcomming = document.getElementById('upcomming-classes-card');
    if (element) {
        const targetOffset = element.offsetTop - classesDetails.offsetTop;
        classesDetails.scrollTop = targetOffset;
    } else if (upcomming) {
        const targetOffset = upcomming.offsetTop - classesDetails.offsetTop;
        classesDetails.scrollTop = targetOffset;
    }
}

var blurContainer = document.querySelector('.full')
var container = document.querySelector('.confirmation')
var buttons = document.querySelector('.buttons')

function showLogout(){
    blurContainer.style.display = 'flex';
    setTimeout(()=> {
        container.style.height = '150px';
        container.style.width = '350px';
    }, 0)
    setTimeout(()=>{
        buttons.style.display = 'flex';
    }, 100)
}

function diableLogout(){
    container.style.height = '0';
    container.style.width = '0';
    buttons.style.display = 'none';
    setTimeout(()=> {
        blurContainer.style.display = 'none'
    }, 100)
}

window.onload = () => {
    document.querySelector('.full').onclick = diableLogout;
    document.querySelector('.no').onclick = diableLogout;
    document.getElementById('logout').onclick = showLogout;
    scrollClasses();
};

