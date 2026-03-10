# 🛡️ NexAuth

**NexAuth** is a full-stack authentication system built with **Django REST Framework** (backend) and **React + Vite** (frontend). Users can register with a profile photo, log in, view and edit their profile on a dashboard, and securely log out.

---

## ✨ Features

- ✅ Register with username, email, password & profile picture upload
- ✅ Login with token-based authentication (DRF Token Auth)
- ✅ Protected dashboard showing user profile
- ✅ Edit profile (username, email, bio, photo)
- ✅ Secure logout (server-side token deletion)
- ✅ CORS configured for Vite dev server
- ✅ Professional dark UI with Bootstrap Icons

---

## 📁 Project Structure

```
nexauth/
│
├── backend/                        # Django project
│   ├── accounts/                   # Core auth app
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py               # Custom User model (AbstractUser)
│   │   ├── serializers.py          # Register, Login, Profile serializers
│   │   ├── views.py                # AuthViewSet + UserViewSet
│   │   └── urls.py                 # App-level URL router
│   │
│   ├── nexauth/                    # Django project config
│   │   ├── __init__.py
│   │   ├── settings.py             # Full settings (CORS, DRF, media, etc.)
│   │   ├── urls.py                 # Root URL config
│   │   └── wsgi.py
│   │
│   ├── media/                      # Uploaded profile images (auto-created)
│   ├── requirements.txt
│   └── manage.py
│
└── frontend/                       # React + Vite project
    ├── index.html                  # Bootstrap Icons + Google Fonts CDN
    ├── vite.config.js              # Dev server + API proxy config
    ├── package.json
    └── src/
        ├── main.jsx                # React entry point
        ├── App.jsx                 # Router + auth guards
        ├── services/
        │   └── api.js              # All API calls + token helpers
        ├── pages/
        │   ├── Login.jsx           # Login page
        │   ├── Register.jsx        # Register page (with avatar upload)
        │   └── Dashboard.jsx       # Protected dashboard + edit profile
        └── styles/
            └── style.css           # Full custom design system (dark theme)
```

---

## 🚀 Getting Started

### Backend Setup

```bash
cd backend

# 1. Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply migrations
python manage.py makemigrations accounts
python manage.py migrate

# 4. (Optional) Create superuser for admin panel
python manage.py createsuperuser

# 5. Start dev server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

---

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

The Vite proxy forwards `/api` and `/media` requests to Django automatically.

---

## 🔌 API Endpoints

| Method | Endpoint                        | Auth required | Description              |
|--------|---------------------------------|---------------|--------------------------|
| POST   | `/api/auth/register/`           | No            | Create new account       |
| POST   | `/api/auth/login/`              | No            | Log in, returns token    |
| POST   | `/api/auth/logout/`             | Yes           | Delete server-side token |
| GET    | `/api/user/profile/`            | Yes           | Get current user profile |
| PATCH  | `/api/user/profile/update/`     | Yes           | Update profile + photo   |

Authentication header: `Authorization: Token <your_token>`

---

## ⚙️ Key Settings (settings.py)

```python
AUTH_USER_MODEL = 'accounts.User'       # Custom User model

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',             # Vite dev server
]

MEDIA_URL = '/media/'                    # Profile image serving
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## 🗄️ Data Models

### `User` (extends `AbstractUser`)

| Field           | Type          | Notes                         |
|-----------------|---------------|-------------------------------|
| `username`      | CharField     | Unique, used for login        |
| `email`         | EmailField    | Unique                        |
| `bio`           | TextField     | Optional                      |
| `profile_image` | ImageField    | Uploaded to `media/profile_images/` |
| `created_at`    | DateTimeField | Auto                          |
| `updated_at`    | DateTimeField | Auto                          |

---

## 🧰 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Backend   | Django 4.2, Django REST Framework |
| Auth      | DRF Token Authentication          |
| Database  | SQLite (swap to PostgreSQL easily)|
| Images    | Pillow                            |
| CORS      | django-cors-headers               |
| Frontend  | React 18, React Router v6         |
| Build     | Vite 5                            |
| Icons     | Bootstrap Icons (CDN)             |
| Fonts     | Syne + Inter (Google Fonts)       |

---

## 🔐 Production Notes

- Replace `SECRET_KEY` with an environment variable
- Set `DEBUG = False`
- Configure PostgreSQL in `DATABASES`
- Run `python manage.py collectstatic`
- Use Nginx to serve media files
- Set specific `ALLOWED_HOSTS`
- Consider switching to JWT (djangorestframework-simplejwt) for stateless auth

---

## 📄 License

MIT — free to use and modify.