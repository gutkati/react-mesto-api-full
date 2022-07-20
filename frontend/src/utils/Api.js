class Api {
    constructor({baseUrl, headers}) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json()
        }
        return Promise.reject(res.status)
    }

    getProfile() {
        return fetch(`${this._baseUrl}/users/me`, {
            credentials: 'include',
            headers: this._headers
        })
            .then(this._checkResponse)
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            credentials: 'include',
            headers: this._headers
        })
            .then(this._checkResponse) //если сервер ответил успешно(ok) создаем из ответа объект, если нет то появляется ошибка
    }

    editProfile(data) {                      //метод редактирования профиля
        return fetch(`${this._baseUrl}/users/me`, {
            method: "PATCH",               //метод изменяет существующие данные на сервере
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({     //делает из объекта строку
                name: data.name,
                about: data.about
            })
        })
            .then(this._checkResponse) //если сервер ответил успешно(ok) создаем из ответа объект, если нет то появляется ошибка
    }

    addCard(object) {
        return fetch(`${this._baseUrl}/cards`, {
            method: "POST",                 //метод изменяет существующие данные на сервере
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({     //делает из объекта строку
                name: object.name,
                link: object.link,
            }),
        })
            .then(this._checkResponse)
    }

    deleteCard(id) {
        return fetch(`${this._baseUrl}/cards/${id}`, {
            method: "DELETE",
            credentials: 'include',
            headers: this._headers
        })
            .then(this._checkResponse)
    }

    deleteLike(id) {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: "DELETE",
            credentials: 'include',
            headers: this._headers
        })
            .then(this._checkResponse)
    }

    addLike(id) {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: "PUT",
            credentials: 'include',
            headers: this._headers
        })
            .then(this._checkResponse)

    }

    changeStatusLike(id, isLiked) {
        if (isLiked) {
            return this.addLike(id);
        } else {
            return this.deleteLike(id)
        }
    }

    newAvatar(data) {                      //метод редактирования профиля
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: "PATCH",                 //метод изменяет существующие данные на сервере
            credentials: 'include',
            headers: this._headers,
            body: JSON.stringify({     //делает из объекта строку
                avatar: data.avatar
            })
        })
            .then(this._checkResponse) //если сервер ответил успешно(ok) создаем из ответа объект, если нет то появляется ошибка

    }

}

export const api = new Api({
    baseUrl: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    }
});