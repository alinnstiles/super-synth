#!/usr/bin/env python3
import os
from flask_bcrypt import Bcrypt
from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS


from models import db, User, Recording, Comment, Note

from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)

bcrypt = Bcrypt(app)

migrate = Migrate(app, db)

db.init_app(app)

######################### USER ############################

# Signup
@app.post('/api/users')
def create_user():
    try:
        new_user = User(username=request.json['username'])
        new_user._hashed_password = bcrypt.generate_password_hash(request.json["password"]).decode('utf=8')
        db.session.add(new_user)
        db.session.commit()
        print(new_user.id)
        session['user_id'] = new_user.id
        return new_user.to_dict(), 201
    except Exception as e:
        return { 'error': str(e) }, 406

# Check session
@app.get('/api/check-session')
def check_session():
    user = User.query.where(User.id == session['user_id']).first()
    if user:
        return user.to_dict(), 200
    else:
        return {}, 204

# Session login
@app.post('/api/login')
def login():
    print("attempted login")
    user = User.query.where(User.username == request.json.get('username')).first()
    if user and bcrypt.check_password_hash(user._hashed_password, request.json.get('password')):
        session['user_id'] = user.id
        return user.to_dict(), 201
    else:
        return {'error': 'Username or password was invalid'}, 401

# Session logout
@app.delete('/api/logout')
def logout():
    session.pop('user_id')
    return {}, 204

#################### USERS RECORDINGS #####################

# get all user recordings
@app.route('/api/user-recordings', methods=['GET'])
def get_user_recordings():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Not logged in"}, 401

    recordings = Recording.query.filter_by(user_id=user_id).all()
    return jsonify([recording.to_dict() for recording in recordings]), 200

# post recording
@app.post('/api/user-recordings')
def post_user_recordings():
    user_id = session.get('user_id')
    if not user_id:
        return {"error": "Not logged in"}, 401
    
    recording = Recording(
        name = request.json['name'],
        likes = 0,
        public = request.json['public'],
        user_id = user_id
    )
    db.session.add(recording)
    db.session.commit()
    for note in request.json['notes']:
        current_note = Note(
            key = note.get('key'),
            start_time = note.get('start_time'),
            end_time = note.get('end_time'),
            recording_id = recording.id
        )
        db.session.add(current_note)
        db.session.commit()
    return recording.to_dict(), 201

# delete recording
@app.delete('/api/recording/<int:id>')
def delete_recording(id):
    current_recording = Recording.query.where(Recording.id == id).first()
    if current_recording:
        db.session.delete(current_recording)
        db.session.commit()
        return {}, 204

# updating recording (----------USER & COMMUNITY RECORDINGS---------)
@app.patch('/api/patch-recording/<int:id>')
def patch_recording(id):
    current_recording = Recording.query.where(Recording.id == id).first()
    if current_recording:
        keys = request.json.keys()
        if keys:
            for key in keys:
                if key != id:
                    setattr(current_recording, key, request.json[key])
            db.session.add(current_recording)
            db.session.commit()
            return current_recording.to_dict(), 201
        
################# COMMUNITY RECORDINGS ####################

# get all recordings that is set to public (community recordings)
@app.get('/api/all-recordings')
def get_all_recordings():
    all_recordings = Recording.query.where(Recording.public == True).all()
    return [recording.to_dict() for recording in all_recordings], 201

######################## COMMENTS ##########################

# updating comment (comment/like)
@app.patch('/api/patch-comment/<int:id>')
def patch_comment(id):
    current_comment = Comment.query.where(Comment.id == id).first()
    if current_comment:
        keys = request.json.keys()
        if keys:
            for key in keys:
                if key != id:
                    setattr(current_comment, key, request.json[key])
            db.session.add(current_comment)
            db.session.commit()
            return current_comment.to_dict(), 201

# delete comment
@app.delete('/api/delete-comment/<int:id>')
def delete_comment(id):
    comment_to_delete = Comment.query.where(Comment.id == id).first()
    if comment_to_delete:
        db.session.delete(comment_to_delete)
        db.session.commit()
        return {}, 204

# post comment
@app.post('/api/comment')
def post_comment():
    user_id = session.get['user_id']
    if not user_id:
        return {"error": "Not logged in"}, 401
    
    comment = Comment(
        comment = request.json['comment'],
        likes = 0,
        recording_id = request.json['recording_id'],
        user_id = user_id
    )
    return comment.to_dict(), 201

if __name__ == '__main__':
    app.run(port=5555, debug=True)

