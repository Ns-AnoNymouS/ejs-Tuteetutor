function replace() {
    document.getElementById("div1").style.display = "none";
    document.getElementById("div2").style.display = "block";
}

let value;
function getVal(val){
    value = val;
    f1();
}
let value1;
function getVal1(value){
    value1 = value;
}
let value2;
function getVal2(event){
    value2 = event.target.getAttribute('value');
}
function f1(){
    if(value=="CSE" && value1=="UG1"){
        
    }
    else if(value=="ECE" && value1=="UG1"){
    }
    else if(value=="CSE" && value1=="UG2"){
        window.location.href = "coursesCSE";
    }
    else if(value=="ECE" && value1=="UG2"){
        window.location.href = "coursesECE";
    }
    else if(value=="CSE" && value1=="UG3"){
        window.open("");
    }
    else if(value=="ECE" && value1=="UG3"){
        window.open("");
    }
    else if(value=="CSE" && value1=="UG4"){
        window.open("");
    }
    else if(value=="ECE" && value1=="UG4"){
        window.open("");
    }
    else{
    }
}

function submit(){
    window.location.href = 'home';
};
