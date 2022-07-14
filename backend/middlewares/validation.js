const { celebrate, Joi } = require('celebrate');

module.exports.loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.creatUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/w?w?w?\.?[\w\W]{1,}/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.creatCardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(/https?:\/\/w?w?w?\.?[\w\W]{1,}/),
  }),
});

module.exports.updateProfileValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.updateAvatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/w?w?w?\.?[\w\W]{1,}/),
  }),
});

module.exports.userIdValid = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24),
  }),
});

module.exports.cardIdValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
});
