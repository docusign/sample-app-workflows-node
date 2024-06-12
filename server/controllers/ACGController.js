class ACGController {
  static login(req, res, next) {
    req.dsAuth.login(req, res, next);
  }

  static logout(req, res, next) {
    req.dsAuth.logout(req, res, next);
  }

  static isLoggedIn(req, res, next) {
    req.dsAuth.isLoggedIn(req, res, next);
  }

  static dsLoginCB1(req, res, next) {
    req.dsAuthCodeGrant.oauth_callback1(req, res, next);
  }

  static dsLoginCB2(req, res, next) {
    req.dsAuthCodeGrant.oauth_callback2(req, res, next);
  }
}

module.exports = ACGController;
