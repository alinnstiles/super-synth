#!/usr/bin/env python3

from app import app
from models import db, User, Recording, Comment
from faker import Faker
from random import randint

faker = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Seeding database...")

        User.query.delete()
        
        users = []
        
        for _ in range(0,5):
            u1 = User(
                username = faker.name()
            )
            users.append(u1)
        
        db.session.add_all(users)
        db.session.commit()
        
        # TODO Recording seed
        
        recordings = []
        
        for _ in range(0,5):
            r1 = Recording(
                name = faker.name(),
                mp3 = "some mp3 file",
                likes = randint(1, 500),
                public = True,
                user_id = randint(1, 5)
            )
            recordings.append(r1)
        
        db.session.add_all(recordings)
        db.session.commit()
        
        # TODO Comment seed
        comment = []
        
        for _ in range(0,5):
            c1 = Comment(
                comment = faker.text(),
                likes = randint(1, 500),
                recording_id = randint(1, 5),
                user_id = randint(1, 5)
            )
            comment.append(c1)
        
        db.session.add_all(comment)
        db.session.commit()
        
        print("Seeding complete!")
