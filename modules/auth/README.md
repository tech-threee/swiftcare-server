# STUDENT LOGIN

**Method:** POST

**URL:** /api/v1/auth/student

**Content-Type:** application/json

### Request body

```js
{
    "academicId": "10899000",
    "pin": "12345"
}
```

### Response

```js
{
  "success": true,
  "data": {
    "_id": "65732a52a02a656f714faf22",
    "image": "https://firebasestorage.googleapis.com/v0/b/ug-dms.appspot.com/o/abc124c04bd818f731edf37880832747.png?alt=media&token=1f1433b0-c809-42c0-9fd8-f7d49a11147f",
    "title": "Mr.",
    "surname": "Twumasi",
    "otherNames": "Samuel",
    "studentID": "10899000",
    "email": "samuel398721@gmail.com",
    "phone": "555093397",
    "program": "657329e3cbb635ac4bb431de",
    "level": "65518e915d59c66308e27bc8",
    "createdAt": "2023-12-08T14:38:10.766Z",
    "updatedAt": "2023-12-09T15:18:09.402Z",
    "login": {},
    "token": ACCESS_TOKEN (For making request to protected routes)
  }
}
```

# LECTURER LOGIN

**Method:** POST

**URL:** /api/v1/auth/lecturer

**Content-Type:** application/json

### Request body

```js
{
    "academicId": "10899000",
    "pin": "12345"
}

```
