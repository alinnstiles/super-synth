#!/usr/bin/env python3
import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS


from models import db, User, Recording, Comment

from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
app.secret_key = os.environ.get('SECRET KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Add validations

CORS(app)

bcrypt = Bcrypt(app)

migrate = Migrate(app, db)

db.init_app(app)

URL_PREFIX = '/api'

@app.post('/api/users')
def create_user():
    print(session['user_id'])
    try:
        new_user = User(username=data['username'])
        new_user._hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf=8')
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return new_user.to_dict(), 201
    except Exception as e:
        return { 'error': str(e) }, 406

@app.get(URL_prEFIX + '/check-session')
def check_session():
    user = User.query.where(User.id == session['user_id']).first()
    if user:
        return user.to_dict(), 200
    else:
        return {}, 204
# SESSION LOGIN/LOGOUT#

@app.post(URL_PREFIX + '/login')
def login():
    user = User.query.where(User.username == request.json.get('username')).first()
    if user and bcrypt.check_password_hash(user._hashed_password, request.json.get('password')):
        session['user_id'] = user.id
        return user.to_dict(), 201
    else:
        return {'error': 'Username or password was invalid'}, 401
        
@app.delete(URL_PREFIX + '/login')
def logout():
    session.pop

# EXAMPLE OTHER RESOURCES #

@app.get(URL_PREFIX + '/notes')
def get_notes():
    user = User.query.where(User.id == session['user_id']).first()
    return jsonify( [note.to_dict() for note in Note.query.all()] ), 200

@app.post(URL_PREFIX + '/notes')
def create_note():
    try:
        data = request.json
        new_note = Note(**data)
        db.session.add(new_note)
        db.session.commit()
        return jsonify( new_note.to_dict() ), 201
    except Exception as e:
        return jsonify( {'error': str(e)} ), 406

# write your routes here!

if __name__ == '__main__':
    app.run(port=5555, debug=True)
