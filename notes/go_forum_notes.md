```
jwt document - authentication
Protect app with middlewares
CORS
OWASP 10
postgresql
sql
```

# JWT for authentication in Golang application

## Introduction

JWTs are popular because:

- A JWT is stateless. That is, it does not need to be stored in a database, unlike opaque tokens.
- The signature of a JWT is never decoded once formed, thereby ensuring that the token is safe and secure.
- Token time expired.

## JWT

- Three parts:
  - Header: the type of token and the signing algorithm used: HMAC or SHA256
  - Payload: the second part of the token which contains the **claims**. These claims include application specific data (E.g: user id, username), token expiration, time(exp), issuer(iss), subject(sub) and so on...
  - Signature: the encoded header, encoded payload, and a secret you provide are used to create the signature.
- data = encodedHeader + encodedPayload (Base64)
- Sign with ECDSA or RSA.

## Token type

- Access token:
  - Added in **header** of the request.
  - Used for requests that require authentication.
  - Recommended that an access token has a short lifespan: 15 minutes
- Refresh token:
  - Lifespan: 7 days.
  - Used to generate new access and refresh tokens.
  - Event: Access token expires, new sets of access and refresh tokens are created when the refresh token route is hit.

## Where to store a JWT

- `HttpOnly` cookie.
- Sending the cookie generated from the backend to the frontend (client),
- `HttpOnly` flag is sent along with the cookie, instructing the browser not to display the cookie through the client-side scripts - Prevent XSS
- Browser local storage or session storage.

## The application

```
go mod init jwt-todo
```

```
go get github.com/gin-gonic
go get github.com/dgrijalva/jwt-go
```

```go
package main 
import (
	"github.com/gin-gonic/gin"
)

var (
	router = gin.Default()
)

func main() {
	router.POST("/login", Login)
	log.Fatal(router.Run(":8080"))
}

type User struct {
    ID uint64	`json:"id"`
    Username string	`json:"username"`
    Password string `json:"password"`
}

var user = User {
    ID: 1,
    Username: "username",
    Password: "password",
}

func Login(c *gin.Context) {
    var u User 
    if err := c.ShouldBindJSON(&u); err != nil {
        c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
        return
    }
    if user.Username != u.Username || user.Password != u.Password {
        c.JSON(http.StatusUnauthorized, "Please provide valid login details")
        return
    }
    token, err := CreateToken(user.ID)
    if err != nil {
        c.JSON(http.StatusUnprocessableEntity, err.Error())
        return
    }
    c.JSON(http.StatusOK, token)
}

func CreateToken(userid uint64) (string, error) {
    var err error
    os.Setenv("ACCESS_SECRET", "djsalkjlkasdf") // this should be in an env file
    atClaims := jwt.MapClaims{}
    atClaims["authorized"] = true
    atClaims["user_id"] = userid
    atClaims["exp"] = time.Now().Add(time.Minute * 15).Unix()
    at := jwt.NewWithClaims(jwt.SigningMethodHS25, atClaims)
    token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
    if err != nil {
        return "", err
    }
    return token, nil
}
```

## Loopholes with refresh token

- Using a persistence storage layer to store JWT metadata.
- Using the concept of e refresh token to generate a new access token, in the event that the access token expired.

### Using NoSQL(Redis, levelDB...) to Store JWT Metadata

- uuid as the key
- userid as the value

```
go get github.com/go-redis/redis/v7
go get github.com/twinj/uuid
```

```go
var client *redis.Client

func init() {
	dsn := os.Getenv("REDIS_DSN")
	if len(dsn) == 0 {
		dsn = "localhost:6379"
	}
	client = redis.NewClient(&redis.Options{
		Addr: dsn, // redis port
	})
	_, err := client.Ping().Result()
}

type TokenDetails struct { 
	AccessToken string
    RefreshToken string
    AccessUuid string
    RefreshUuid string
    AtExpires int64
    RtExpires int64
}

func CreateToken(userid uint64) (*TokenDetails, error) {
  td := &TokenDetails{}
  td.AtExpires = time.Now().Add(time.Minute * 15).Unix()
  td.AccessUuid = uuid.NewV4().String()

  td.RtExpires = time.Now().Add(time.Hour * 24 * 7).Unix()
  td.RefreshUuid = uuid.NewV4().String()

  var err error
  //Creating Access Token
  os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
  atClaims := jwt.MapClaims{}
  atClaims["authorized"] = true
  atClaims["access_uuid"] = td.AccessUuid
  atClaims["user_id"] = userid
  atClaims["exp"] = td.AtExpires
  at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
  td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
  if err != nil {
     return nil, err
  }
  //Creating Refresh Token
  os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
  rtClaims := jwt.MapClaims{}
  rtClaims["refresh_uuid"] = td.RefreshUuid
  rtClaims["user_id"] = userid
  rtClaims["exp"] = td.RtExpires
  rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
  td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
  if err != nil {
     return nil, err
  }
  return td, nil
}

// Saving JWTs metadata
func CreateAuth(userid uint64, td *TokenDetails) error {
    at := time.Unix(td.AtExpires, 0)
    rt := time.Unix(td.RtExpires, 0)
    now := time.Now()
    
    errAccess := client.Set(td.AccessUuid, strconv.Itoa(int(userid)), at.Sub(now)).Err()
    if errAccess != nil {
        return errAccess
    }
    errRefresh := client.Set(td.RefreshUuid, strconv.Itoa(int(userid)), rt.Sub(now)).Err()
    if errRefresh != nil {
        return errRefresh
    }
    return nil
}

// Login
func Login(c *gin.Context) {
  var u User
  if err := c.ShouldBindJSON(&u); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
     return
  }
  //compare the user from the request, with the one we defined:
  if user.Username != u.Username || user.Password != u.Password {
     c.JSON(http.StatusUnauthorized, "Please provide valid login details")
     return
  }
  ts, err := CreateToken(user.ID)
  if err != nil {
 c.JSON(http.StatusUnprocessableEntity, err.Error())
   return
}
 // Save to database
 saveErr := CreateAuth(user.ID, ts)
  if saveErr != nil {
     c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
  }
  tokens := map[string]string{
     "access_token":  ts.AccessToken,
     "refresh_token": ts.RefreshToken,
  }
  c.JSON(http.StatusOK, tokens)
}
```





# Middlewares

