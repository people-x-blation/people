window.onload = function() {
  fadeOutEffect('loading');
  $('#nav_home_span, #nav_search_span, #nav_write_span, #nav_login_span, #nav_mypage_span, #nav_logout_span, #nav_signup_span').delay(2000).hide(500);
};

read_displaySetting = () => {
  document.getElementsByClassName('menu_container')[0].style.display = 'block';
};
read_closeSetting = () => {
  document.getElementsByClassName('menu_container')[0].style.display = 'none';
};
read_comment_displaySetting = () => {
  document.getElementsByClassName('menu_container')[1].style.display = 'block';
};
read_comment_closeSetting = () => {
  document.getElementsByClassName('menu_container')[1].style.display = 'none';
};

// write_cancel = () => {
//     location.href =
// }

function fadeOutEffect(target) {
  var fadeTarget = document.getElementById(target);
  var fadeEffect = setInterval(function() {
    if (!fadeTarget.style.opacity) {
      fadeTarget.style.opacity = 1;
    }
    if (fadeTarget.style.opacity > 0) {
      fadeTarget.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
      fadeTarget.style.display = 'none';
    }
  }, 50);
}
