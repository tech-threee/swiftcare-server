# Communication documentation

## Initiate a communication

**Request**

```sh
POST {{BASE_URL}}/api/v1/communication/
Authorization: Bearer {{JWT}}
Content-Type: application/json

{
  "recipients": [
    {
      "email": "work.davidmainoo@gmail.com", 
      "participantId": "657e4b3c3f21d14faa4ed47a", 
      "userType": "student"
    }
  ],
  "text": "Hello"
}
```

**Response**

```json
{
  "success": true,
  "message": "Communication initiated successfully"
}
```

## List the communications that this user has initiated

**Request**

```sh
GET {{BASE_URL}}/api/v1/communication/
Authorization: Bearer {{JWT}}
Content-Type: application/json
```

**Response**

```json
{
  "success": true,
  "data": {
    "communications": [
      {
        "_id": "65d7b21f1b06875bf4e447af",
        "text": "Hello"
      }
    ],
    "pagination": {
      "pageNumber": 1,
      "pageSize": 1,
      "totalCount": 1
    }
  }
}
```

## Read a communication

**Request**

```sh
GET {{BASE_URL}}/api/v1/communication/65d7b21f1b06875bf4e447af
Authorization: Bearer {{JWT}}
Content-Type: application/json
```

**Response**

```json
{
  "success": true,
  "data": {
    "sender": {
      "participantId": "65732a52a02a656f714faf22",
      "userType": "student",
      "email": "samuel398721@gmail.com"
    },
    "_id": "65d7b21f1b06875bf4e447af",
    "recipients": [
      {
        "participantId": "657e4b3c3f21d14faa4ed47a",
        "userType": "student",
        "email": "work.davidmainoo@gmail.com",
        "_id": "65d7b21f1b06875bf4e447b0"
      }
    ],
    "text": "Hello",
    "replies": [],
    "createdAt": "2024-02-22T20:44:15.291Z",
    "updatedAt": "2024-02-22T20:44:15.291Z"
  }
}
```

## Add a reply to a communication

**Request**

```sh
POST {{BASE_URL}}/api/v1/communication/65d7b21f1b06875bf4e447af
Authorization: Bearer {{JWT}}
Content-Type: application/json
```

**Response**

```json
{
  "success": true,
  "message": "Reply sent successfully"
}
```