// const router = require('express').Router();
// const { loginValid, creatUserValid } = require('../middlewares/validation');
// const { login, createUser, logout } = require('../controllers/users');
// const auth = require('../middlewares/auth');
//
//
// // роуты без авторизации
// router.post('/signup', creatUserValid, createUser);
// router.post('/signin', loginValid, login);
//
// // авторизация
// router.use(auth);
//
// // роуты защищенные авторизацией
// router.use('/', require('./routes/users'));
// router.use('/', require('./routes/cards'));
// router.get('/logout', logout);
//
// module.exports = router;