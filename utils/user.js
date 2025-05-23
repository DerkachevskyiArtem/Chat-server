const _ = require('lodash');

module.exports.prepareUser = (user, ommittedFields = ['password']) => {
  const userObj = user.toJSON();

  const preparedUser = _.omit(userObj, ommittedFields);

  return preparedUser;
}