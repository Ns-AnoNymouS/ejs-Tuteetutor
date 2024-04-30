document.getElementById('side').addEventListener("mouseover", () => {
    let sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('active');
});

document.getElementById('side').addEventListener("mouseout", () => {
    let sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('active');
});
document.querySelector(".yes").addEventListener('click', ()=> {
    fetch("/logout")
    window.location.href = '/login'
});
window.onload = () => {
    document.querySelector('.full').onclick = diableLogout;
    document.querySelector('.no').onclick = diableLogout;
    document.getElementById('logout').onclick = showLogout;
    scrollClasses();
};
