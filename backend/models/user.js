const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => /https?:\/\/w?w?w?\.?[\w\W]{1,}/gi.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  email: {
    type: String,
    required: true, // обязательное поле для заполнения
    unique: true, // уникальный пользователь проходит аутентификацию по электронной почте
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // API не возвращает хэш пароля
  },
});

module.exports = mongoose.model('user', userSchema);
