# Wiring up controllers and routes

## Base File

- Database connection information
- Our routes
- Start server

```go
package controllers

type Server struct {
	DB *gorm.DB
	Router *gin.Engine
}

var errList = make(map[string]string)

func (server *Server) Initialize(DBDriver, DBUser, DBPassword DBPort,
                                 DBHost, DBName string) {
    // Connect database
    if DBDriver == "postgres" {
        DBURL := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable password=%s", DBHost, DBPort, DBUser, DBName, DBPassword)
        server.DB, err = gorm.Open(DBDriver, DBURL)
        if err != nil {
            fmt.Printf("Cannot connect to %s database", DBName)
            log.Fatal("This is the error: ", err)
        } else {
            fmt.Printf("We are connected to the %s database", DBDriver)
        }
    }
    // Database migration
    server.DB.Debug().AutoMigrate(
        &models.User{},
        &models.Post{},
        &models.ResetPassword{},
        &models.Like{},
        &models.Comment{},
    )
    
    // Server router
    server.Router = gin.Default()
    server.Router.Use(middlewares.CORSMiddleware())
    server.initializeRoutes()
}

func (server *Server) Run(addr string) {
    // Listen and Serve
}
```



## Users controller 

```go
package controllers

func (server *Server) CreateUser(c *gin.Context) {
    errList = map[string]string{}
    body, err := ioutil.ReadAll(c.Request.Body)
    // check err and return
    if err != nil {
        errList["Invalid_body"] = "Unable to get request"
        c.JSON(http.StatusUnprocessableEntity, gin.H{
            "status": http.StatusUnprocessableEntity,
            "error": errList,
        })
        return
    }
    
    user := models.User{}
    err = jso.Unmarshall(body, &user)
    // check err and return
    user.Prepare()
    errorMessages := user.Validate("")
    // check len errorMessages
    userCreated, err := user.SaveUser(server.DB)
    // check error
    if err != nil {
        formattedError := formaterror.FormatError(err.Error())
        errList = formattedError
        c.JSON(http.StatucInternalServerError, gin.H{
            "status": http.StatusIntervalServerError,
            "error": errList
        })
    }
    // return c.JSON
    c.JSON(http.StatusCreated, gin.H{
        "status": http.StatusCreated,
        "response": userCreated,
    })
}

func (server *Server) GetUsers(c *gin.Context);
func (server *Server) GetUser(c *gin.Context);
func (server *Server) UpdateAvatar(c *gin.Context);
func (server *Server) UpdateUser(c *gin.Context);
func (server *Server) DeleteUser(c *gin.Context);
```



## Posts controller

```go
func (server *Server) CreatePost(c *gin.Context);
func (server *Server) GetPosts(c *gin.Context);
func (server *Server) GetPost(c *gin.Context);
func (server *Server) UpdatePost(c *gin.Context);
func (server *Server) DeletePost(c *gin.Context);
func (server *Server) GetUserPosts(c *gin.Context);
```

## Likes controller

```go
func (l *Like) SaveLike(db *gorm.DB) (*Like, error);
func (l *Like) DeleteLike(db *gorm.DB) (*Like, error);
func (l *Like) GetLikesInfo(db *gorm.DB, pid uint64);
func (l *Like) DeleteUserLikes(db *gorm.DB, uid uint32);
func (l *Like) DeletePostLikes(db *gorm.DB, pid uint64)
```

## Comments controller

```go
func (server *Server) CreateComment(c *gin.Context);
func (server *Server) GetComments(c *gin.Context);
func (server *Server) UpdateComment(c *gin.Context);
func (server *Server) DeleteComment(c *gin.Context)
```

## Login controllers

```go
func (server *Server) Login(c *gin.Context);
func (server *Server) SignIn(email, password string);
```

## Reset password controllers

```go
package controllers

func (server *Server) ForgotPassword(c *gin.Context) {
    errList = map[string]string
    
    body, err := ioutil.ReadAll(c.Request.Body)
    if err != nil {
        errList["Infalid_body"] = "Unable to get request"
        c.JSON(http.StatusUnprocessableEntity, gin.H{
            "status": http.StatusUnprocessableEntity,
            "error": errList,
        })
    }
    user := models.User{}
    err = json.Unmarshall(body, &user)
    // check error
    user.Prepare()
    errorMessages := user.Validate("forgotpassword")
    // check len errorMessages
    err = server.DB.Debug().Model(models.User{}).Where("email = ?", user.Email).Take(&user).Error
    // check error
    resetPassword := models.ResetPassword{}
    resetPassword.Prepare()
}
```



## Routes

```go
package controllers

import "github.com/ethanol1310/go-forum/api/middlewares"

func (s *Server) initializeRoutes() {

	v1 := s.Router.Group("/api/v1")
	{
		// Login Route
		v1.POST("/login", s.Login)

		// Reset password:
		v1.POST("/password/forgot", s.ForgotPassword)
		v1.POST("/password/reset", s.ResetPassword)

		//Users routes
		v1.POST("/users", s.CreateUser)
		v1.GET("/users", s.GetUsers)
		v1.GET("/users/:id", s.GetUser)
		v1.PUT("/users/:id", middlewares.TokenAuthMiddleware(), s.UpdateUser)
		v1.PUT("/avatar/users/:id", middlewares.TokenAuthMiddleware(), s.UpdateAvatar)
		v1.DELETE("/users/:id", middlewares.TokenAuthMiddleware(), s.DeleteUser)

		//Posts routes
		v1.POST("/posts", middlewares.TokenAuthMiddleware(), s.CreatePost)
		v1.GET("/posts", s.GetPosts)
		v1.GET("/posts/:id", s.GetPost)
		v1.PUT("/posts/:id", middlewares.TokenAuthMiddleware(), s.UpdatePost)
		v1.DELETE("/posts/:id", middlewares.TokenAuthMiddleware(), s.DeletePost)
		v1.GET("/user_posts/:id", s.GetUserPosts)

		//Like route
		v1.GET("/likes/:id", s.GetLikes)
		v1.POST("/likes/:id", middlewares.TokenAuthMiddleware(), s.LikePost)
		v1.DELETE("/likes/:id", middlewares.TokenAuthMiddleware(), s.UnLikePost)

		//Comment routes
		v1.POST("/comments/:id", middlewares.TokenAuthMiddleware(), s.CreateComment)
		v1.GET("/comments/:id", s.GetComments)
		v1.PUT("/comments/:id", middlewares.TokenAuthMiddleware(), s.UpdateComment)
		v1.DELETE("/comments/:id", middlewares.TokenAuthMiddleware(), s.DeleteComment)
	}
}
```

## Server

```go
package api

import (
	"fmt"
	"log"
	"os"

	"github.com/ethanol1310/go-forum/api/controllers"
	"github.com/joho/godotenv"
)

var server = controllers.Server{}

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print(".env is not found")
	}
}

func Run() {
	var err error
	err = godotenv.Load()

	if err != nil {
		log.Fatalf("Error getting env, %v", err)
	} else {
		fmt.Println("We are getting values")
	}

	server.Initialize(os.Getenv("DB_DRIVER"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_PORT"), os.Getenv("DB_HOST"), os.Getenv("DB_NAME"))
	apiPort := fmt.Sprintf(":%s", os.Getenv("API_PORT"))
	fmt.Printf("Listening to port %s", apiPort)

	server.Run(apiPort)
}
```

```go
package main

import "github.com/ethanol1310/go-forum/api"

func main() {
	api.Run()
}
```

# PostgreSQL

## Password for default user

```
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'ethanol';
```

- Login 

```
psql -U postgres -h localhost
```

## Create database

```

CREATE USER ethanol with PASSWORD 'ethanol';

CREATE DATABASE forum_db;

GRANT ALL PRIVILEGES ON DATABASE forum_db TO ethanol;
```

## Login database

```
psql -U ethanol -h localhost -d forum_db
```

### Create table

```
-- Create table Account
Create table Account (User_Name varchar(30), Full_Name varchar(64) ) ;

-- Insert 2 row to Account.

Insert into Account(user_name, full_name) values ('gates', 'Bill Gate');

Insert into Account(user_name, full_name) values ('edison', 'Thomas Edison');

-- Query
Select * from Account;
```



