const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  creatCardValid,
  cardIdValid,
} = require('../middlewares/validation');

router.get('/cards', getCards); // возвращает все карточки из базы данных.
router.post('/cards', creatCardValid, createCard); // создает новую карточку по переданным параметрам
router.delete('/cards/:cardId', cardIdValid, deleteCard); // запрос удаляет карточку по _id
router.put('/cards/:cardId/likes', cardIdValid, likeCard); // добавляет лайк карточке
router.delete('/cards/:cardId/likes', cardIdValid, dislikeCard); // удаляет лайк с карточки

module.exports = router;
