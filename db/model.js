export const member = {
  id: '',
  nickname: '',
  password: 'kakao',
  blood: '',
  my_blood: '',
  profile: '',
  phone: '',
  email: '',
};

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
