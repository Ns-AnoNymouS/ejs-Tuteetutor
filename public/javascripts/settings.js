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

