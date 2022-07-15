require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // мидлвэр
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require ('cors'); // библиотека CORS
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValid, creatUserValid } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger')

const allowedCors = {
  origin: [
    'http://practicum.mesto.nomoredomains.xyz',
    'https://practicum.mesto.nomoredomains.xyz',
    'http://api.domainname.mesto.nomoredomains.xyz',
    'https://api.domainname.mesto.nomoredomains.xyz',
    'https://github.com/gutkati',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true, // устанавливает куки
};

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
// app.use(function (req, res, next) {
//   const { origin } = req.headers;
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   const { method } = req;
//   const DEFAULT_ALLOWED_METHODS = "GET, HEAD, PUT, PATCH, POST, DELETE";
//   const requestHeaders = req.headers['access-control-request-headers'];
//
//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }
//
// })
app.use(requestLogger); // записываются запросы и ответы
app.use('*', cors(allowedCors));
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роуты без авторизации
app.post('/signup', creatUserValid, createUser);
app.post('/signin', loginValid, login);

// авторизация
app.use(auth);

// роуты защищенные авторизацией
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use(errorLogger); // записываются все ошибки
app.use(errors()); // обработчик ошибок

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => { // центролизованный обработчик ошибок
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  }

  res.status(500).send({ message: 'На сервере произошла ошибка' });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
