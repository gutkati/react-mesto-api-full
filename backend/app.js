require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // мидлвэр
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors'); // библиотека CORS
const { login, createUser, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValid, creatUserValid } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = {
  origin: [
    'http://practicum.mesto.nomoredomains.xyz',
    'https://practicum.mesto.nomoredomains.xyz',
    'http://api.domainname.mesto.nomoredomains.xyz',
    'https://api.domainname.mesto.nomoredomains.xyz',
    'https://github.com/gutkati',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true, // устанавливает куки
};

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('*', cors(allowedCors));
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

app.use(requestLogger); // записываются запросы и ответы

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

app.get('/logout', logout);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // записываются все ошибки
app.use(errors()); // обработчик ошибок



app.use((err, req, res, next) => { // центролизованный обработчик ошибок
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
