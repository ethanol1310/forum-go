package seed

import (
	"log"

	"github.com/ethanol1310/go-forum/api/models"
	"github.com/jinzhu/gorm"
)

var users = []models.User{
	models.User{
		Username: "ethanol1310",
		Email:    "ethanol@example.com",
		Password: "password",
	},
	models.User{
		Username: "eth",
		Email:    "eth@example.com",
		Password: "password",
	},
}

var posts = []models.Post{
	models.Post{
		Title:   "Title 1",
		Content: "asdlfjlka aslkdjfl as salkdjflk kjdsaf lkasjdfl  asdlfn",
	},
	models.Post{
		Title:   "Title 2",
		Content: "Hahahaha",
	},
}

func Load(db *gorm.DB) {

	err := db.Debug().DropTableIfExists(&models.Post{}, &models.User{}, &models.Like{}, &models.Comment{}).Error
	if err != nil {
		log.Fatalf("cannot drop table: %v", err)
	}
	err = db.Debug().AutoMigrate(&models.User{}, &models.Post{}).Error
	if err != nil {
		log.Fatalf("cannot migrate table: %v", err)
	}

	err = db.Debug().Model(&models.Post{}).AddForeignKey("author_id", "users(id)", "cascade", "cascade").Error
	if err != nil {
		log.Fatalf("attaching foreign key error: %v", err)
	}

	for i, _ := range users {
		err = db.Debug().Model(&models.User{}).Create(&users[i]).Error
		if err != nil {
			log.Fatalf("cannot seed users table: %v", err)
		}
		posts[i].AuthorID = users[i].ID

		err = db.Debug().Model(&models.Post{}).Create(&posts[i]).Error
		if err != nil {
			log.Fatalf("cannot seed posts table: %v", err)
		}
	}
}
