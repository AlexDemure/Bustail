# Bustail 
Сервис пассажирских перевозок

## Развертывание

```sh
git clone git@github.com:AlexDemure/bustail.git
cd bustail
cd ./env_files/
cp core.env.example core.env mailing.env.example mailing.env postgres.env.example postgres.env 

cd ./frontend
npm install  # add node_modules
npm run build  # add build files

# DEV
docker-compose up -d --build

# PROD
docker-compose -f docker-compose.prod up -d --build
```

#### Используемые технологии
- FastApi Framework (Python)
- React (JavaScript)
- PostgreSQL (main) & SQLite3 (test)
- Tortoise ORM
- Aerich (Мигратор)
- HTML/CSS
- Yandex Object Storage (Облачное хранилище)
- Yandex Kassa (Платежная система)
- Apscheduler (Удаленный запуск)
- Netdata (Мониторинг сервера)
- CI/CD (CircleCI)
- Pytest/Unittest
- Redis (Используется в качестве менеджера задач)
- Docker & Docker-compose
- Sentry
