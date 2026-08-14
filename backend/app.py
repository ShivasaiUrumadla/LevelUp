from flask import Flask, jsonify,request
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from datetime import datetime
from flask_cors import CORS
load_dotenv()
from datetime import date
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token,jwt_required,get_jwt_identity

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "shiva"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

from flask_cors import CORS

CORS(
    app,
    origins=[
        r"http://localhost:\d+",
        r"http://127\.0\.0\.1:\d+",
        r"https://.*\.vercel\.app"
    ],
    supports_credentials=True
)
jwt = JWTManager(app)

db = SQLAlchemy(app)


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    target = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(30), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"),nullable=False)

class Progress(db.Model):
    __tablename__="progress"

    id=db.Column(db.Integer,primary_key=True)
    progress=db.Column(db.Integer, nullable=False)
    task_id=db.Column(db.Integer,db.ForeignKey("tasks.id"),nullable=False)
    date = db.Column(db.Date, default=date.today)
    


class User(db.Model):
    __tablename__="user"

    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(20),nullable=False)
    email=db.Column(db.String(100),nullable=False)
    password_hash=db.Column(db.String(225),nullable=False)
    created_at =db.Column(db.DateTime,default=datetime.utcnow)


with app.app_context():
    db.create_all()

@app.route("/signup",methods=["POST"])
def sign_up():
    data=request.get_json()
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({
            "message":"email already exists"
        }),401
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({
            "message":"username already exists"
        })
    newuser=User(username=data["username"],email=data["email"],password_hash=generate_password_hash(data["password"]))
    try:
        db.session.add(newuser)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Error creating account at baackend. Please try again."
        }), 500
    token=create_access_token(identity=str(newuser.id))
    return jsonify({
        "message":"successfully created",
        "token":token
    }),201




@app.route("/login",methods=["POST"])
def login():
    data=request.get_json()
    user=User.query.filter_by(email=data["email"]).first()
    if not user:
       return jsonify({
               "message": "invalid credentials"
           }),401 
    if not check_password_hash(user.password_hash,data["password"]):
        return jsonify({
                       "message": "invalid credentials"
                   }),401 
    token=create_access_token(identity=str(user.id))
    return jsonify({
        "message":"login successfull",
        "token":token

    }),200





@app.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id=get_jwt_identity()
    tasks = Task.query.filter_by(user_id=int(user_id))
    print(tasks)
    result = []

    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "target": task.target,
            "unit": task.unit,
            "created_at": task.created_at,
            "user":task.user_id
        })

    return jsonify(result)


@app.route("/progress", methods=["GET"])
@jwt_required()
def get_progress():
    user_id = int(get_jwt_identity())
    today = date.today()

    # Total progress for each task
    totals = (
    db.session.query(
        Task.id.label("task_id"),
        Task.created_at,
        Task.target,
        db.func.coalesce(
            db.func.sum(Progress.progress), 0
        ).label("total_progress")
    )
    .outerjoin(Progress, Progress.task_id == Task.id)
    .filter(Task.user_id == user_id)
    .group_by(Task.id, Task.created_at, Task.target)
    .all()
    )

    # Today's progress rows
    progress = (
        Progress.query
        .join(Task, Progress.task_id == Task.id)
        .filter(
            Task.user_id == user_id,
            Progress.date == today
        )
        .all()
    )

    balance_result = {}
    today_result = {}

    # Calculate balance
    for p in totals:
        days = (today - p.created_at.date()).days + 1
        expected = days * p.target
        balance = p.total_progress - expected
        balance_result[p.task_id] = balance

    # Today's progress
    for p in progress:
        today_result[p.task_id] = p.progress

    result = {
        "today_progress": today_result,
        "balance": balance_result
    }

    print(result, "from backend")

    return jsonify(result), 200



@app.route("/setprogress",methods=["POST"])
@jwt_required()
def set_progress():
    print("---------------")
    data=request.get_json()
    print("Incoming:", data)
    task_id=data["task_id"]
    new_progress=data["progress"]
    progress=Progress.query.filter_by(
        task_id=task_id,
        date=date.today()
    ).first()
    print("Found:", progress)
    if progress:
        progress.progress = new_progress
    else:
        progress = Progress(
            task_id=task_id,
            date=date.today(),
            progress=new_progress
        )
        db.session.add(progress)

    db.session.commit()
    return jsonify({
        "message": "progress added"
    }), 200


@app.route("/settask",methods=["POST"])
@jwt_required()
def set_task():
    data=request.get_json()
    print(data)
    title=data["title"]
    target=data["target"]
    unit=data["unit"]

    task=Task(title=title,target=target,unit=unit,user_id=get_jwt_identity())
    db.session.add(task)
    db.session.commit()
    return jsonify({
            "id": task.id,
            "title": task.title,
            "target": task.target,
            "unit": task.unit,
            "created_at": task.created_at
}), 201

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = int(get_jwt_identity())

    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return {"error": "Task not found"}, 404

    Progress.query.filter_by(task_id=task_id).delete()
    db.session.delete(task)
    db.session.commit()

    return {"message": "Task deleted"}, 200
if __name__ == "__main__":
    app.run(debug=True)