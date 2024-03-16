# PATIENT LOGIN STEP 1

**Method:** POST

**URL:** /api/v1/auth/patient

**Content-Type:** application/json

### Request body

```js
{
    "email": "fake@fakegmail.com",
}
```

### Response

```js
{
  "success": true,
  "data": {
    "email": "fake@fakergmail.com"
  }
}
```

# PATIENT LOGIN STEP 2

**Method:** POST

**URL:** /api/v1/auth/patient/verify-otp

**Content-Type:** application/json

### Request body

```js
{
    "email": "fake@fakegmail.com",
    "otp": "098723"
}
```

### Response

```js
{
  "success": true,
  "data": LoggedinUserData
}
```

# STAFF LOGIN

**Method:** POST

**URL:** /api/v1/auth/staff

**Content-Type:** application/json

### Request body

```js
{
    "ID": "10899000",
    "password": "12345"
}

```
