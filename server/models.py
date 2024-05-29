from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import datetime

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    
    __tablename__ = 'users_table'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _hashed_password = db.Column(db.String)
    recordings = db.relationship('Recording', back_populates='user')
    comments = db.relationship('Comment', back_populates='user')
    
    serialize_rules = ['-recordings.comments', '-recordings.user', '-comments']
    
    def __repr__(self):
        return f'User(username={self.username})'
    
    # TODO Add validations
    # @validates('username')
    # def validate_user(self, key, value):
    #     updated_value = value.strip().replace(' ', '_')
    #     if updated_value.length() > 4:
    #         return updated_value

class Recording(db.Model, SerializerMixin):
    
    __tablename__ = 'recordings_table'
    # TODO Update MP3
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    mp3 = db.Column(db.String, nullable=False)
    likes = db.Column(db.Integer, default=0)
    public = db.Column(db.Boolean, default=False)
    time_created = db.Column(db.DateTime, default=datetime.datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users_table.id'))
    synth = []
    
    user = db.relationship('User', back_populates='recordings')
    comments = db.relationship('Comment', back_populates='recording')
    
    serialize_rules = ['-user.recordings', '-comments.recording']
    
    def __repr__(self):
        return f'Recording(id={self.id}, name={self.name}, mp3={self.mp3}, likes={self.likes}, public={self.public}, time_created={self.time_created}, user_id={self.user_id})'

class Comment(db.Model, SerializerMixin):
    
    __tablename__ = 'comments_table'
    
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String, nullable=False)
    likes = db.Column(db.Integer, default=0)
    time_created = db.Column(db.DateTime, default=datetime.datetime.now())
    recording_id = db.Column(db.Integer, db.ForeignKey('recordings_table.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users_table.id'))
    
    recording = db.relationship('Recording', back_populates='comments')
    user = db.relationship('User', back_populates='comments')
    
    serialize_rules = ['-recording.comments', '-user.comments']
    
    def __repr__(self):
        return f'Comment(id={self.id}, comment={self.comment}, likes={self.likes}, time_created={self.time_created}, recording_id={self.recording_id}, user_id={self.user_id})'