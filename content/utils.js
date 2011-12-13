var tbdialoututils = {

  prefs: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.tbdialout."),
  console: Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService),
  passwordManager: Components.classes["@mozilla.org/login-manager;1"].
       getService(Components.interfaces.nsILoginManager),
  nsLoginInfo: new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
       Components.interfaces.nsILoginInfo, "init"),


  getPass: function (passid) {
    this.logger(5, "Getting password with id " + passid);
    try {
      // Find users for the given parameters
      var logins = this.passwordManager.findLogins({}, 'chrome://tbdialout', null, passid);
      var password = "";
      // Find our user from returned array of nsILoginInfo objects - username is value of passid
      for (var i = 0; i < logins.length; i++) {
        if (logins[i].username == passid) {
          password = logins[i].password;
          break;
        }
      }
    } catch (err) {
      tbdialoututils.logger(1, "Error getting password " + passid +": " + err.message);
      return false;
    }
    return password;
  },

  setPass: function (passid, passval) {
    if (passval.length < 1) {
      this.logger(3, "setPass called with zero length password. Not saving");
      return false;
    }
    this.logger(5, "Saving new value for " + passid);

    try {
      // first remove any existing login
      // Find our user from returned array of nsILoginInfo objects - username is value of passid
      var logins = this.passwordManager.findLogins({}, 'chrome://tbdialout', null, passid);
      for (var i = 0; i < logins.length; i++) {
        if (logins[i].username == passid) {
          this.passwordManager.removeLogin(logins[i]);
          break;
        }
      }

      // now set the new password. Use passid as both realm and user
      var LoginInfo = new this.nsLoginInfo('chrome://tbdialout',
            null, passid, passid, passval, "", "");

      this.passwordManager.addLogin(LoginInfo);
    } catch (err) {
      tbdialoututils.logger(1, "Error setting password " + passid +": " + err.message);
      return false;
    }
    return true;
  },

  // utility for logging messages to the error console
  // levels:
  // 1: Caught exceptions, major problems
  // 2: Unexpected responses
  // 3: Notices, information
  // 4: Debug, protocol transactions
  // 5: Even more debug
  logger: function (level, msg) {
    if( this.prefs.getIntPref("loglevel") >= level ) {
      function formattime(s) {
        function pad(n, d) {
          d = d;
          n = n + '';
          while (n.length < d) n = '0' + n;
          return n;
        };
        return pad(s.getHours(),2)+':'
          +pad(s.getMinutes(),2)+':'
          +pad(s.getSeconds(),2)+'.'
          +pad(s.getMilliseconds(),3)
      }
      this.console.logStringMessage("[TBDialout] " + formattime(new Date()) + ": " + msg);
    }
  },

  migratePass: function () {
    tbdialoututils.logger(5, "Migrating passwords to new storage");
    var passtypes = ["custompass", "ami.secret"];
    var idx;
    var pass;
    try {
      for (idx in passtypes) {
        pass = this.prefs.getCharPref( passtypes[idx] );
        if (pass.length > 0) {
          this.setPass(passtypes[idx], pass);
        }
        this.prefs.clearUserPref(passtypes[idx]);
      }
    } catch (err) {
      tbdialoututils.logger(1, "Error migrating passwords: " + err.message);
    }
    this.prefs.setBoolPref("passmigrated", true);
  },

}