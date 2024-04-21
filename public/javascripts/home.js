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

window.onload = () => {
    scrollClasses();
};