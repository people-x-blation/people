export class member {
  constructor() {
    this.id = '';
    this.nickname = '';
    this.password = 'kakao';
    this.blood = '';
    this.my_blood = '';
    this.profile = '';
    this.phone = '';
    this.email = '';
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
