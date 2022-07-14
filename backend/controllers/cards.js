const Cards = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

function describeErrors(err, res, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError('Переданы некорректные данные'));
  } else {
    next(err);
  }
}

function addError(req, res, card) {
  if (!card) {
    throw new NotFoundError('Карточка с указанным _id не найдена');
  } else {
    res.status(200).send(card);
  }
}

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  const id = req.user._id; // id пользователя взяли из мидлвэры в файле app.js

  Cards.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => describeErrors(err, res, next));
};

module.exports.getCards = (req, res, next) => {
  Cards.find({}) // поиск всех документов по параметрам
    .then((cards) => res.status(200).send(cards))
    .catch((err) => describeErrors(err, res, next));
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId) // удаление карточки по Id
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }

      if (req.user._id !== card.owner.toString()) { // нет прав удалять крточку другого пользователя
        throw new ForbiddenError('Вы не можете удалить эту карточку');
      }
      Cards.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch((err) => describeErrors(err, res, next));
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    (req.params.cardId),
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    {
      new: true,
    },
  )
    .then((card) => {
      addError(req, res, card);
    })
    .catch((err) => describeErrors(err, res, next));
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate( // удалит первое совпадение по id
    (req.params.cardId),
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true,
    },
  )

    .then((card) => {
      addError(req, res, card);
    })
    .catch((err) => describeErrors(err, res, next));
};
