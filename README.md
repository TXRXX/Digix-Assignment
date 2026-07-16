# Book Library

โปรเจกต์จัดการหนังสือ มี login/register, เพิ่ม/ลบหนังสือ, ค้นหาชื่อหนังสือ

- `server/` → Express API + MongoDB
- `client/` → Next.js frontend

## DEMO
สามารถทดลองใช้งานได้ที่ https://books.txrxx.dev/
```
Username: admin
Password: password1234
```

---

## Backend

```bash
cd server
npm install
```

สร้างไฟล์ `server/.env`

```env
PORT=3030
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.pi2a9fq.mongodb.net
JWT_SECRET=THIS_IS_MY_SECRET
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

รัน

```bash
npm run dev
```

server จะขึ้นที่ `http://localhost:3030`

---

## Frontend

```bash
cd client
npm install
```

สร้างไฟล์ `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3030/api
```

รัน

```bash
npm run dev
```

เปิด `http://localhost:3000` → ยังไม่ login จะเด้งไป `/login`

---