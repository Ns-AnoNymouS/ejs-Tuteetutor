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


// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelector('.btn-submit').addEventListener('click', function() {
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;
//         const confirmPassword = document.getElementById('confimpass').value;

//         if (password !== confirmPassword) {
//             alert("Passwords do not match!");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('username', username);
//         const profileImage = document.getElementById('profileImage').files[0];
//         if (profileImage) {
//             formData.append('profileImage', profileImage);
//         }

//         fetch('/updateProfile', {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//             // Handle response as needed (e.g., display success message)    
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     });
// });