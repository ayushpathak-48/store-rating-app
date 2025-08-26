## Run Backend
### Add environement variables (backend/.env)
```bash
DATABASE_URL=POSTGRESS_DATABASE_URL
JWT_SECRET=YOUR_SECRET_KEY
JWT_REFRESH_SECRET=YOUR_SECRET_KEY
```
## Run following commands one by one
```bash
$ cd backend
$ npm install
$ npx prisma migrate deploy
$ npx prisma generate
$ npm run start:dev
```

## Project setup

```bash
$ cd frontend
$ npm install
$npm run dev
```


### API Url: https://store-rating-app-ijr7.onrender.com
