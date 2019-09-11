window.onload = function() {
  fadeOutEffect('loading');

  $('#nav_home_span, #nav_search_span, #nav_write_span, #nav_login_span, #nav_mypage_span, #nav_logout_span, #nav_signup_span')
  .delay(2000)
  .hide(500);
  
  if($('#location_toggle').length != 0) {
    $('#location_toggle').click(function(e){
      $('.location_item').toggle();
    });
  }
  
  $('#write_request_btn').click(function(e) {
    e.preventDefault();
  });
};

function read_displaySetting() {
  document.getElementsByClassName('menu_container')[0].style.display = 'block';
}
function read_closeSetting() {
  document.getElementsByClassName('menu_container')[0].style.display = 'none';
}
function read_comment_displaySetting() {
  document.getElementsByClassName('menu_container')[1].style.display = 'block';
}
function read_comment_closeSetting() {
  document.getElementsByClassName('menu_container')[1].style.display = 'none';
}

function write_cancel() {
  location.href = '/board';
}

function submit_check(CKEDITOR) {
  var text = CKEDITOR.instances.write_content.getData();

  var flag = true;
  if ($('#write_title').val() == '') {
    alert('제목을 써주세요.');
    flag = false;
  } else if (
    $('#locations option:selected').val() == '지역을 선택해 주십시오.'
  ) {
    alert('지역을 골라주세요.');
    flag = false;
  } else if ($('#write_hospital').val() == '') {
    alert('병원이름을 입력해주세요');
    flag = false;
  } else if (text == '') {
    alert('내용을 입력해주세요');
    flag = false;
  }
  if (flag) {
    $('#content').val(text);
    document.getElementById('write_form').submit();
  }
}

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