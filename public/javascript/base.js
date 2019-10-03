window.onload = function() {
  fadeOutEffect('loading');

  if ($('#location_toggle').length != 0) {
    $('#location_toggle').click(function(e) {
      $('.location_item').toggle();
    });
  }

  $('#write_request_btn').click(function(e) {
    e.preventDefault();
  });

  $('.mypage_leave_btn').click(function(e) {
    e.preventDefault();
    var phone = prompt(
      '회원가입하셨을때 전화번호를 입력하여주세요. 전화번호가 일치하면 회원 탈퇴가 진행됩니다.',
    );
    if ($('#phone').text() == phone) {
      $.ajax({
        url: '/auth/leave',
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if (result.status == 'ok') {
            alert('회원 탈퇴가 성공적으로 진행되었습니다.');
            location.href = '/';
          } else {
            alert(
              '회원 탈퇴에 실패했습니다. 로그인 상태나 부적절한 접근인지 확인해주세요.',
            );
            location.href = '/';
          }
        },
        error: function(err) {
          console.log(err);
        },
      });
    }
  });

  $('#search_bar_icon').click(function(err) {
    const locations = $('[name="locations"] option:selected').val();
    const keyword = $('#search_bar').val();

    locations = locations == '지역을 선택해 주십시오.' ? '' : locations;
    if (locations != '' || keyword != '') {
      const url = '/board/' + locations + '?keyword=' + keyword;
      location.href = url;
    } else {
      alert('지역이나, 검색어 둘 중 하나는 입력해주십시오.');
    }
  });

  $('#read_comment_submit').click(function(err) {
    const comment = $('#read_comment_form').val();
    if (comment == '') {
      alert('댓글을 입력해주세요.');
      return false;
    }
    $.ajax({
      url: '/board/comment_upload',
      type: 'POST',
      dataType: 'json',
      data: {
        boardnum: $('#read_comment_boardnum').val(),
        usernum: $('#read_comment_usernum').val(),
        contents: comment,
      },
      success: function(result) {
        if (result.status == 'ok') {
          const html =
            '<div class="read_comment_wrapper"><div class="read_comment_user">' +
            result.replier +
            '</div><p class="read_comment_content">' +
            comment +
            '</p><div class="read_comment_setting"><form action="../comment_destroy" method="POST"><input type="hidden" name="comment_num" value="' +
            result.comment.commentnum +
            '"><button>삭제</button></form></div></div>';
          $('#wrapper').prepend(html);
        } else {
          alert(
            '댓글 작성에 실패했습니다. 로그인 상태나 부적절한 접근인지 확인해주세요.',
          );
          location.href = '/auth/kakao';
        }
      },
      error: function(err) {
        console.log(err);
      },
    });
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
    if (
      confirm(
        '요청글은 한번 작성되면 수정되지 않습니다.\n요청 보내기: 확인\n재검토 : 취소',
      )
    ) {
      $('#content').val(text);
      document.getElementById('write_form').submit();
    }
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
