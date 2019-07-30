window.onload = function(){
    fadeOutEffect("loading");  
}

read_displaySetting = () => {
    document.getElementsByClassName('menu_container')[0].style.display="block"
};
read_closeSetting = () => {
    document.getElementsByClassName('menu_container')[0].style.display="none"
};

// write_cancel = () => {
//     location.href = 
// }

function fadeOutEffect(target) {
    var fadeTarget = document.getElementById(target);
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            fadeTarget.style.display = "none";
        }
    }, 50);
    
};