export class Member {
  constructor() {
    this.id = '';
    this.nickname = '';
    this.password = 'kakao';
    this.blood = '';
    this.my_blood = '';
    this.profile = '';
    this.phone = '';
    this.email = '';
    this.is_admin = false;
  }
}

export class Board {
  constructor() {
    this.title = '';
    this.author = '';
    this.like_count = '';
    this.create_at = '';
    this.show_flag = '';
    this.locations = '';
    this.hospital = '';
    this.contents = '';
    this.donation_type = ''; // 0 - 전혈, 1 - 백혈구, 2 - 혈소판, 3 - 향후 추가
  }
}

export class Comment {
  constructor() {
    this.comment_num = '';
    this.content = '';
    this.replier = '';
  }
}

export const participants = {
  boardnum: '',
  request_usernum: '',
  part_usernum: '',
  show_flag: '',
};

export class NoticeDB {
  constructor() {
    this.notinum = '';
    this.title = '';
    this.contents = '';
    this.create_at = '';
  }
}
