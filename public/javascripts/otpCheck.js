document.addEventListener("DOMContentLoaded", function () {
    var inputs = document.querySelectorAll("input");
    var button = document.querySelector("button");
    var expire = document.getElementById("expire");
    var container = document.querySelector(".container");
    var messageBlock = document.querySelector(".messageBlock");
    const expire_time = 300// sessionStorage.getItem("expire_time");

    document.querySelector(".mail").textContent = "******@iiits.in";
    let OTP = "", expireInterval = "";
    inputs[0].focus();
    function generateOTPs() {
        if (expire_time > 0) {
            expire.innerText = expire_time - 1;
        }
        else {
            expire.innerText = 1;
        }
        expireInterval = setInterval(function () {
            expire.innerText--;
            sessionStorage.setItem('expire_time', expire.innerText);
            if (expire.innerText <= 0) {
                clearInterval(expireInterval);
                if (!messageBlock){
                    messageBlock = document.createElement('div');
                    messageBlock.className = 'messageBlock';
                    var errorMessage = document.createElement('p');
                    errorMessage.id = 'message';
                    errorMessage.textContent = "OTP Expired";
                    messageBlock.appendChild(errorMessage);
                    document.body.appendChild(messageBlock);
                    document.getElementById("error").appendChild(messageBlock);
                }
                container.style.height = "550px";
                messageBlock.style.display = "block";
                inputs.forEach((input, index) => {
                    input.setAttribute("disabled", true);
                })
            }
        }, 1000)
    }
    inputs.forEach((input, index) => {
        input.addEventListener("keyup", function (e) {
            const currentInput = input;
            const nextInput = input.nextElementSibling;
            const prevInput = input.previousElementSibling;

            if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
                nextInput.removeAttribute("disabled", true);
                nextInput.focus();
            }
            if (e.key === "Backspace") {
                inputs.forEach((input, index1) => {
                    if (index <= index1 && prevInput) {
                        input.setAttribute("disabled", true);
                        prevInput.focus();
                        prevInput.value = "";
                    }
                });
            }
            if (!inputs[3].disabled && inputs[3].value !== "") {
                inputs[3].blur();
                button.classList.add("active");
                return;
            }
            button.classList.remove("active");
        })
    });

    button.addEventListener("click", () => {
        let otp = "";
        inputs.forEach((input) => {
            otp += input.value;
        });
        if (otp.length != 4) {
            return
        }
        document.querySelector(".loader").style.display = "flex";
        let type = "signup"
        if (signup == "false" || !email) {
            type = "forgotpassword"
        }
        fetch(`${baseUrl}/otp?email=${email}&username=${username}&password=${password}&otp=${otp}&type=${type}`).then(response => response.text()).then(data => {
            document.querySelector(".loader").style.display = "none";
            if (data == "Successfully signed up") {
                var expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30);
                document.cookie = `username=${encodeURIComponent(username)}; expires=${expirationDate.toUTCString()}`;
                document.cookie = `token=${encodeURIComponent(password)}; expires=${expirationDate.toUTCString()}`;
                window.location.href = "courses";

            }
            else if (data == "Wrong OTP") {
                container.style.height = "550px";
                messageBlock.style.display = "block";
                message.textContent = data;
            }
            else if (data == "OTP verified") {
                sessionStorage.removeItem("username");
                sessionStorage.removeItem("password");
                sessionStorage.removeItem("expire_time");
                sessionStorage.removeItem("signup");
                window.location.href = "/updatePassword";
            }
            else {
                alert("Please Enter the details again");
                if (signup == "true") {
                    window.location.href = "signup";
                } else {
                    window.location.href = "forgotPassword";
                }
            }
        })
    })
    generateOTPs()

})

document.getElementById("resend").addEventListener("click", () => {
    document.querySelector(".loader").style.display = "flex";
    const email = sessionStorage.getItem("email");
    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");
    fetch(`${baseUrl}/signup?email=${email}&username=${username}&password=${password}`).then(response => {
        document.querySelector(".loader").style.display = "none";
        setTimeout(() => {
            messageBlock.style.display = "none";
            container.style.height = "500px";
            emailId.style.border = originalStyles.border1;
            usernameId.style.border = originalStyles.border2;
            confirm.style.border = originalStyles.border3;
        }, 5000);
        if (!response.ok) {
            messageBlock.style.display = "block";
            message.textContent = response.statusText;
            container.style.height = "550px";
        }
        return response.text();
    }).then(data => {
        if (data != "OTP") {
            window.location.href = "/login";
        }
        else {
            sessionStorage.setItem('expire_time', 300);
            window.location.href = "otp";
        }
    })
});