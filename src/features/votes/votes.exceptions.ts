function BaseException<Tag extends string>(tag: Tag) {
  return class Exception {
    _tag = tag;
  };
}

export class UserHasAlreadyVoted extends BaseException('UserHasAlreadyVoted') {
  static raise() {
    return new this();
  }
}
