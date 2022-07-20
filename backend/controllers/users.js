const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError'); // 409
const NotFoundError = require('../errors/NotFoundError'); // 404
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const ValidationError = require('../errors/ValidationError'); // 400

const SECRET_KEY = 'some-secret-key';
const { NODE_ENV, JWT_SECRET } = process.env;

function describeErrors(err, res, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError('Переданы некорректные данные'));
  } else {
    next(err);
  }
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // вызвать метод select, так получаем хэш пароля
    .then((user) => {
      if (!user) { // пользователь не найден - отклоняем промис
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // хэши не совпали - отклоняем промис
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY,
        { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          httpOnly: true, sameSite: "none", secure: true, maxAge: 3600000 * 24 * 7
        })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch((err) => next(err));
};

module.exports.logout = (req, res) => {
  res
    .clearCookie('jwt', {
    httpOnly: true, sameSite: "none", secure: true, maxAge: 3600000 * 24 * 7
  })
    .send({ message: 'куки удалены' });
};


module.exports.createUser = (req, res, next) => { // создать пользователя
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10) // хешируем пароль
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })) // записываем данные в базу
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    })) // возвращаем записанные данные в базу пользователю
    .catch((err) => {
      if (err.code === 11000) { // если пользователь регистрируется по существующему в базе email
        next(new ConflictError('Данный email уже существует'));
      } else {
        describeErrors(err, res, next);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({}) // поиск всех документов по параметрам
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

module.exports.getInfoAboutMe = (req, res, next) => {
  User.findById(req.user._id) // находит текущего пользователя по _id
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному Id не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => describeErrors(err, res, next));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId) // возвращает первого пользователя из базы по _id
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному Id не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => describeErrors(err, res, next));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => describeErrors(err, res, next));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => describeErrors(err, res, next));
};