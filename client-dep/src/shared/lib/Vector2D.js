// TODO: 모두 static method만 사용하도록 설계할지 고민
// - 클라이언트로부터 정보를 받아 저장하는 등의 상황에서
// - location, velocity 등이 모두 Vector2D instance로 되어 있다면
// - 매번 오브젝트에서 벡터로 변환해주는 작업이 필요해질 것
// - 그러므로 모든 벡터 계산은 static하게 처리하도록 하자

// static method의 모든 입력값은 {x, y} 의 형태를 띄고 있다고 전제함
// 계산 결과로 새로운 object를 생성할 것인지 여부 또한 고민
// 일단.. 첫 번째 인자 값을 변경하는 것으로 통일하며, 첫 번째 인자를 리턴

class Vector2D {
  static add(a, b) {
    a.x += b.x;
    a.y += b.y;
    return a;
  }

  static sub(a, b) {
    a.x -= b.x;
    a.y -= b.y;
    return a;
  }

  static mult(a, value) {
    a.x *= value;
    a.y *= value;
    return a;
  }

  static div(a, value) {
    a.x /= value;
    a.y /= value;
    return a;
  }

  static dist(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static clone(a) {
    return { x: a.x, y: a.y };
  }

  static equal(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }

  static getMagSq(a) {
    return this.dot(a, a);
  }

  static getMag(a) {
    return Math.sqrt(this.getMagSq(a));
  }

  static normalize(a) {
    let m = this.getMag(a);
    if (m === 0) {
      a.x = 1;
      a.y = 0;
      return a;
    } else {
      return this.div(a, m);
    }
  }

  static setMag(a, v) {
    // 우선 벡터 a를 normalize한 뒤 v를 곱함
    return this.mult(this.normalize(a), v);
  }

  static limit(a, maximum) {
    // TODO: 벡터 크기를 계산하는 로직이 반복되므로 최적화 가능
    if (this.getMagSq(a) > maximum * maximum) {
      this.setMag(a, maximum);
    }
    return a;
  }
}

export default Vector2D;
