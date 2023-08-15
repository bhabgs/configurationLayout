// 手机号验证
function isPhoneNo(phone) {
  var pattern = /^1[34578]\d{9}$/;
  return pattern.test(phone);
}

// 验证类
var Validator = function () {
  this.cache = []; // 保存校验规则
};

Validator.prototype.add = function (dom, rules) {
  var self = this;
  for (var i = 0, rule; (rule = rules[i++]); ) {
    (function (rule) {
      var strategyAry = rule.strategy.split(":");
      var errorMsg = rule.errorMsg;

      self.cache.push(function () {
        var strategy = strategyAry.shift();
        strategyAry.unshift(dom.value);
        strategyAry.push(errorMsg);
        return strategies[strategy].apply(dom, strategyAry);
      });
    })(rule);
  }
};

// 添加验证规则

Validator.prototype.start = function () {
  for (var i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
    var msg = validatorFunc();
    if (msg) {
      return msg;
    }
  }
};

// 策略类
var strategies = {
  isNonEmpty: function (value, errorMsg) {
    if (value === "") {
      return errorMsg;
    }
  },
  minLength: function (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function (value, errorMsg) {
    if (!isPhoneNo(value)) {
      return errorMsg;
    }
  },
  isEmail: function (value, errorMsg) {
    if (!isEmail(value)) {
      return errorMsg;
    }
  },
  isIdCard: function (value, errorMsg) {
    if (!isIdCard(value)) {
      return errorMsg;
    }
  },
  isNumber: function (value, errorMsg) {
    if (!isNumber(value)) {
      return errorMsg;
    }
  },
  isMoney: function (value, errorMsg) {
    if (!isMoney(value)) {
      return errorMsg;
    }
  },
};

// 生成策略类方法
var validataFunc = function () {
  var validator = new Validator();
  validator.add(registerForm.userName, [
    {
      strategy: "isNonEmpty",
      errorMsg: "用户名不能为空",
    },
    {
      strategy: "minLength:6",
      errorMsg: "用户名长度不能小于6位",
    },
  ]);
  validator.add(registerForm.password, [
    {
      strategy: "minLength:6",
      errorMsg: "密码长度不能小于6位",
    },
  ]);
  validator.add(registerForm.phoneNumber, [
    {
      strategy: "isMobile",
      errorMsg: "手机号码格式不正确",
    },
  ]);
  validator.add(registerForm.email, [
    {
      strategy: "isEmail",
      errorMsg: "邮箱格式不正确",
    },
  ]);
  validator.add(registerForm.idCard, [
    {
      strategy: "isIdCard",
      errorMsg: "身份证格式不正确",
    },
  ]);
  validator.add(registerForm.money, [
    {
      strategy: "isMoney",
      errorMsg: "金额格式不正确",
    },
  ]);
  validator.add(registerForm.number, [
    {
      strategy: "isNumber",
      errorMsg: "数字格式不正确",
    },
  ]);
  var errorMsg = validator.start();
  return errorMsg;
};
