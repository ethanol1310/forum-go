# Building the Backend

## Technologies

**Backend**

- Golang
- Gin Framework
- GORM
- PostgreSQL

**Frontend**

- React
- React Hooks
- Redux

## Basic setup

### The base directory

```
mkdir go_forum
```

### Go modules

```
go mod init github.com/ethanol1310/forum
```

### Basic installations

```
go get github.com/badoux/checkmail
go get github.com/jinzhu/gorm
go get golang.org/x/crypto/bcrypt
go get github.com/golang-jwt/jwt
go get github.com/jinzhu/gorm/dialects/postgres
go get github.com/joho/godotenv
go get gopkg.in/go-playground/assert.v1
go get github.com/gin-contrib/cors 
go get github.com/gin-gonic/contrib
go get github.com/gin-gonic/gin
go get github.com/aws/aws-sdk-go 
go get github.com/sendgrid/sendgrid-go
go get github.com/stretchr/testify
go get github.com/twinj/uuid
go get github.com/matcornic/hermes/v2
go get github.com/dchest/captcha
```

### .env file

```
APP_ENV=local
API_PORT=8888
DB_HOST=forum-postgres            # RUNNING THE APP WITH DOCKER   
# DB_HOST=127.0.0.1                # RUNNING THE APP WITHOUT DOCKER
DB_DRIVER=postgres
API_SECRET=98hbun98h                  
DB_USER=steven
DB_PASSWORD=password
DB_NAME=forum_db
DB_PORT=5432


#TEST_DB_HOST=forum-postgres-test       # RUNNING THE TEST  WITH DOCKER
TEST_DB_HOST=127.0.0.1                  # RUNNING THE TEST  WITHOUT DOCKER
TEST_DB_DRIVER=postgres
TEST_API_SECRET=98hbun98h
TEST_DB_USER=steven
TEST_DB_PASSWORD=password
TEST_DB_NAME=forum_db_test
TEST_DB_PORT=5432
```

### Create api and tests directory

```
mkdir api && mkdir tests
```

## Wiring up the models

- 5 Models:
  1. User
  2. Post
  3. Like
  4. Comment
  5. Reset password

### User model

```
cd api
mkdir models
```

- Features:
  1. Sign up
  2. Login
  3. Update details
  4. Delete account

```go
package models

type User struct {
	ID         uint32    `gorm:"primary_key;auto_increment" json:"id"`
	Username   string    `gorm:"size:255;not null;unique" json:"username"`
	Email      string    `gorm:"size:100;not null;unique" json:"email"`
	Password   string    `gorm:"size:100;not null;" json:"password"`
	AvatarPath string    `gorm:"size:255;null;" json:"avatar_path"`
	CreatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

// Hash password before saving
func (u *User) BeforeSave() error;

// Preare data for user from form frontend/request
func (u *User) Prepare();

// After find
func (u *User) AfterFind() (err error)

// Validate data
func (u *User) Validate(action string) map[string]string {
    var errorMessages = make(map[string]string)
    var err error
    
    switch srtings.ToLower(action) {
        case "update":
        	// check validate email
        case "login":
        	// check validate password
        	// check validate email
        case "forgotpassword":
        	// check validate email
    default:
        	// check validate username
        	// check validate password
        	// check validate email
        
    }
}


// Save user
func (u *User) SaveUser(db *gorm.DB) (*User, error) {
    // Create user
    // check error and return
}

// Find all users
func (u *User) FindAllUsers(db *gorm.DB) (*[]User, error) {
    // Find first 100 user
    // check error and return
}

// Find user by ID
func (u *User) FindUserByID(db *gorm.DB, uid uint32) (*User, error) {
    // Find user by id
    // check error and return
}

// Update user's information
func (u *User) UpdateAUser(db *gorm.DB, uid uint32) (*User, error) {
    // check password is not none
    	// BeforeSave -> hashPassword
    	// Update column with email, password, updated_at
    // update email, updated_at
    // display the updated user
}

// Update user's avatar
func (u *User) UpdateAUserAvatar(db *gorm.DB, uid uint32) (*User, error) {
	// update user's avatar
    // display the updated user
}

// Delete a user
func (u *User) DeleteAUser(db *gorm.DB, uid uint32) (int64, error) {
    // delete a user
    // return db.RowsAffected
}

// Update password
func (u *User) UpdatePassword(db *gorm.DB) error {
    // Hash password
    // Update columns
}
```



### Post model

- Features:
  1. Created
  2. Updated
  3. Deleted
  4. FindAllPost
  5. FindUserPost
  6. FindPostByID

```go
package models

type Post struct {
	ID        uint64    `gorm:"primary_key;auto_increment" json:"id"`
	Title     string    `gorm:"size:255;not null;unique" json:"title"`
	Content   string    `gorm:"text;not null;" json:"content"`
	Author    User      `json:"author"`
	AuthorID  uint32    `gorm:"not null" json:"author_id"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (p *Post) Prepare() {
    // Title
    // Content
    // ...
}
func (p *Post) Validate() map[string]string {
    // Validate Title/Content/AuthorID
}
func (p *Post) SavePost(db *gorm.FB) (*Post, error) {
    // Create Post -> database
    // Check error and return
    // Get author from p.AuthorID in User -> Set post and return
    // return post, error
}
func (p *Post) FindAllPosts(db *gorm.DB) (*[]Post, error) {
    // Limit 100 posts
}
func (p *Post) FindPostByID(db *gorm.DB) (*Post, error);
func (p *Post) UpdateAPost(db *gorm.DB) (*Post, error);
func (p *Post) DeleteAPost(db *gorm.DB) (int64, error);
func (p *Post) FindUserPosts(db *gorm.DB, uid uint32) (*[]Post, error);
func (c *Post) DeleteUserPosts(db *gorm.DB, uid uint32) (int64, error);
```

### Like model

- Features:

  1. Created
  2. Deleted
3. GetLikesInfo

```go
package models

type Like struct {
	ID        uint64    `gorm:"primary_key;auto_increment" json:"id"`
	UserID    uint32    `gorm:"not null" json:"user_id"`
	PostID    uint64    `gorm:"not null" json:"post_id"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (l *Like) SaveLike(db *gorm.DB) (*Like, error);
func (l *Like) DeleteLike(db *gorm.DB) (*Like, error);
func (l *Like) GetLikesInfo(db *gorm.DB, pid uint64) (*[]Like, error);
func (l *Like) DeleteUserLikes(db *gorm.DB, uid uint32) (int64, error);
func (l *Like) DeletePostLikes(db *gorm.DB, pid uint64) (int64, error);
```



### Comment model

- Features:
  1. Created
  2. Updated
  3. Deleted
  4. Get

```go
package models

type Comment struct {
	ID        uint64    `gorm:"primary_key;auto_increment" json:"id"`
	UserID    uint32    `gorm:"not null" json:"user_id"`
	PostID    uint64    `gorm:"not null" json:"post_id"`
	Body      string    `gorm:"text;not null;" json:"body"`
	User      User      `json:"user"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (c *Comment) Prepare();
func (c *Comment) Validate(action string) map[string]string;
func (c *Comment) SaveComment(db *gorm.DB) (*Comment, error);
func (c *Comment) GetComments(db *gorm.DB, pid uint64) (*[]Comment, error);
func (c *Comment) UpdateAComment(db *gorm.DB) (*Comment, error);
func (c *Comment) DeleteAComment(db *gorm.DB) (int64, error);
func (c *Comment) DeleteUserComments(db *gorm.DB, uid uint32) (int64, error);
func (c *Comment) DeletePostComments(db *gorm.DB, pid uint64) (int64, error);
```



### Reset password model

- Features:
  1. A notification will be sent to their email address with instructions to create a new password.

```go
package models

type ResetPassword struct {
	gorm.Model
	Email string `gorm:"size:100;not null;" json:"email"`
	Token string `gorm:"size:255;not null;" json:"token"`
}


func (resetPassword *ResetPassword) Prepare();
func (resetPassword *ResetPassword) SaveDatails(db *gorm.DB) (*ResetPassword, error);
func (resetPassword *ResetPassword) DeleteDatails(db *gorm.DB) (int64, error);
```



## Security model

```
mkdir Password
```

### Hash Password with bcrypt

### Token Creation for ResetPassword

- When a user requests to change his password, a **token** is sent to that user's email. A function is written to hash the token. This function will be used when we wire up the **ResetPassword**  controller file.

## Using JWT for Authentication

- Authentication for several things such as creating a post, liking a post, updating a profile, commenting on a post, and so on.
- Put in place an authentication system.

```
mkdir auth
```

## Protect App with Middlewares

- We created authentication. Middlewares are like the Police. They will ensure that the auth rules are not broken.
- CORS middleware will allow us to interact with the React Client that we will be wiring up in section 2.

```
mkdir middlewares
```

## Ultilities

### Error Formatting

- A user will need to update his profile(including adding an image) when  he does, we will need to make sure that we image added has a unique  name.

```
mkdir utils
```

### File Formatting

## Emails

- When a user whises to change his password, an email is sent to him.
- Set up that email file.
- Using Sendgrid service

```go
package mailer

import (
	"net/http"
	"os"

	"github.com/matcornic/hermes/v2"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type sendMail struct{}

type SendMailer interface {
	SendResetPassword(string, string, string, string, string) (*EmailResponse, error)
}

var (
	SendMail SendMailer = &sendMail{}
)

type EmailResponse struct {
	Status   int
	RespBody string
}

func (s *sendMail) SendResetPassword(ToUser string, FromAdmin string,
	Token string, SendgridKey string, AppEnv string) (*EmailResponse, error) {
	h := hermes.Hermes{
		Product: hermes.Product{
			Name: "Ethanol",
			Link: "https://ethanol.com",
		},
	}
	var forgotUrl string
	if os.Getenv("APP_ENV") == "production" {
		forgotUrl = "https://ethanol.com/resetpassword/" + Token //this is the url of the frontend app
	} else {
		forgotUrl = "http://127.0.0.1:3000/resetpassword/" + Token //this is the url of the local frontend app
	}

	email := hermes.Email{
		Body: hermes.Body{
			Name: ToUser,
			Intros: []string{
				"Welcome to Ethanol!",
			},
			Actions: []hermes.Action{
				{
					Instructions: "Click this link to reset your password",
					Button: hermes.Button{
						Color: "#FFFFFF",
						Text:  "Reset Password",
						Link:  forgotUrl,
					},
				},
			},
			Outros: []string{
				"Need help, reply to this email",
			},
		},
	}
	emailBody, err := h.GenerateHTML(email)
	if err != nil {
		return nil, err
	}

	from := mail.NewEmail("Ethanol", FromAdmin)
	subject := "Reset Password"
	to := mail.NewEmail("Reset Password", ToUser)
	message := mail.NewSingleEmail(from, subject, to, emailBody, emailBody)
	client := sendgrid.NewSendClient(SendgridKey)
	_, err = client.Send(message)
	if err != nil {
		return nil, err
	}
	return &EmailResponse{
		Status:   http.StatusOK,
		RespBody: "Success, Please click on the link provided in your email",
	}, nil
}

```



