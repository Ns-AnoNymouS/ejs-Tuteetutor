let isPasswordVisible = false;
function togglePassword() {
    if (!isPasswordVisible) {
        document.querySelectorAll(".password").forEach(function (element) {
            element.type = "text"
        });
        document.getElementById("eye").classList.replace("fa-eye", "fa-eye-slash");
        isPasswordVisible = true;
    }
    else {
        document.querySelectorAll(".password").forEach(function (element) {
            element.type = "password"
        });
        document.getElementById("eye").classList.replace("fa-eye-slash", "fa-eye");
        isPasswordVisible = false;
    }
}
document.getElementById("eyecont").addEventListener("click", togglePassword)