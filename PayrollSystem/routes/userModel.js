/**
 * Created by apple on 2017/3/1.
 */
function User(email, password, defaults) {
    this.email = email;
    this.password = password;
    this.defaults = defaults;
}
module.exports = User;