const router = require('express').Router();

const {
  getUsers,
  getInfoAboutMe,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  updateProfileValid,
  updateAvatarValid,
  userIdValid,
} = require('../middlewares/validation');

router.get('/users', getUsers); // возвращает всех пользователей из базы данных
router.get('/users/me', getInfoAboutMe); // возвращает информацию о пользователе.
router.get('/users/:userId', userIdValid, getUserById); // возвращает пользователя по переданному _id
router.patch('/users/me', updateProfileValid, updateProfile); // обновляет информацию о пользователе.
router.patch('/users/me/avatar', updateAvatarValid, updateAvatar); // запрос обновляет аватар пользователя.

module.exports = router;
