const _op = (left, right) => right(left);

const x = _op(a(), b());
