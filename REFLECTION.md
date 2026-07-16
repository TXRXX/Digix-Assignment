ส่วนที่ยากที่สุดคือ ระบบ Authentication
เพราะ ต้อง Hash Password แล้วก็ใช้ JWT ในการทำ Validate ว่า Token valid ไหม
แล้วก็ต้องคำนึงถึง Flow ฝั่ง Frontend ด้วยว่าจะมีการ Validate Token ยังไง