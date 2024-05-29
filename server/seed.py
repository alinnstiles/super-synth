#!/usr/bin/env python3

from app import app
from models import db, User, Recording, Comment, Note
from faker import Faker
from random import randint, choice

faker = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Seeding database...")

        User.query.delete()
        Recording.query.delete()
        Note.query.delete()
        Comment.query.delete()
        
        users = []
        
        for _ in range(0,5):
            u1 = User(
                username = faker.name(),
                _hashed_password = "password123"
            )
            users.append(u1)
        
        db.session.add_all(users)
        db.session.commit()
        
        recordings = []
        
        for _ in range(0,5):
            r1 = Recording(
                name = faker.name(),
                likes = randint(1, 500),
                public = True,
                user_id = randint(1, 5)
            )
            recordings.append(r1)
        
        db.session.add_all(recordings)
        db.session.commit()
        
        notes = []
        
        for x in range(1, 6):
            for _ in range(0,10):
                n1 = Note(
                    key = choice(['z','x','c','v','b','n','m','s','d','g','h','j']),
                    recording_id = x
                )
                notes.append(n1)
        
        db.session.add_all(notes)
        db.session.commit()
            
        
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
