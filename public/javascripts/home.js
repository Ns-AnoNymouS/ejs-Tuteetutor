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

function showLogout(){
    blurContainer.style.display = 'flex'
    container.style.display = 'flex'
}

function diableLogout(){
    blurContainer.style.display = 'none'
    container.style.display = 'none'
}

document.querySelector(".yes").addEventListener('click', ()=> {
    fetch("/logout")
    window.location.href = '/login'
})

window.onload = () => {
    document.querySelector('.full').onclick = diableLogout;
    document.querySelector('.no').onclick = diableLogout;
    document.getElementById('logout').onclick = showLogout;
    scrollClasses();
};