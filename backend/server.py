from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
import json
import os
from email.message import EmailMessage
import ssl
import smtplib
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = os.environ.get('Gmail_password')

CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"])

post_folders = 'posts'
if not os.path.exists(post_folders):
    os.makedirs(post_folders)
app.config['UPLOAD_FOLDER'] = post_folders


All_user = "users.json"
All_product = "product.json"
All_post = "posts.json"


my_gmail = 'futureana735@gmail.com'
my_password = os.environ.get('Gmail_password')  


# მეილზე გაგზავნის ფუნქცია
def send_email(user_email, text):
    subject = "PointSell"
    em = EmailMessage()
    em['From'] = my_gmail
    em['To'] = user_email
    em['Subject'] = subject
    em.set_content(text)
    context = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
            smtp.login(my_gmail, my_password)
            smtp.sendmail(my_gmail, user_email, em.as_string())
    except Exception as e:
        print("Email failed:", e)


# მომხმარებლების ინფორმაციის წაკითხვა
def check_users():
    if not os.path.exists(All_user):
        return []
    with open(All_user, "r", encoding="utf-8") as file:
        return json.load(file)


# მომხმარებლის დამატება
def save_users(users):
    with open(All_user, "w", encoding="utf-8") as file:
        json.dump(users, file, indent=4, ensure_ascii=False)


# პოსტების შენახვა
def save_posts(posts):
    with open(All_post, "w", encoding="utf-8") as file:
        json.dump(posts, file, indent=4, ensure_ascii=False)


# კომენტარის დამატება
@app.post('/add_comment')
def add_comment():
    data = request.get_json()
    post_id = data.get('post_id')
    comment_text = data.get('text')

    user_email = data.get('email')
    user_name = data.get('user_name') 
    user_img = data.get('user_img')

    if not comment_text:
        return jsonify({"error": "Comment it empty"}), 400

    posts = check_posts()

    for post in posts:
        if post['id'] == post_id:
            new_comment = {
                "user_name":  user_name or user_email,
                "comment": comment_text,
                "user_img": user_img,
                "date": str(datetime.now()).split()[0]
            }
            
            post['comments'].insert(0, new_comment)
            save_posts(posts)
            return jsonify(new_comment), 201

    return jsonify({"error": "Post not found"}), 404


# სურათების გამოჩენა
@app.get('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# პროდუქტების წაკითხვა
@app.get('/product20list')
def check_products():
    if not os.path.exists(All_product):
        return []
    with open(All_product, 'r', encoding='utf-8') as file:
        return json.load(file)


# რეგისტრაცია
@app.post("/register")
def register():
    current_time = str(datetime.now())
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    email = data.get("email")
    password = data.get("password")
    users = check_users()

    if any(u["email"] == email for u in users):
        return jsonify({"error": "User already exists"}), 409

    new_user = {
        "name": None,
        "lastname": None,
        "age": None,
        "position": "Customer" if email != my_gmail else "Manager",
        "email": email,
        "password": password,
        "profileUrl": "https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg",
        "notification": [
            {
                "date": current_time.split()[0],
                "message": "Registration is successful!",
                "read": False
            }
        ],
        "money": 1000 if email != my_gmail else 10000
    }

    users.append(new_user)
    save_users(users)
    send_email(email, "Registration Successful!")
    return jsonify({"message": "Registration Successful"}), 201


# შესვლა
@app.post('/login')
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'no data'}), 400
    
    email = data.get("email")
    password = data.get("password")
    users = check_users() 
    user = next((user for user in users if user['email'] == email and user['password'] == password), None)
    
    if user:
        session['email'] = email
        session['is_login'] = True
        return jsonify({'message': 'Login successful!'}), 200
    return jsonify({'error': 'Invalid'}), 401


# ჩემი ინფორმაცია / მენეჯერის
@app.get('/menegers_info') 
def meneger_info():
    users = check_users()

    meneger = next((user for user in users if user['email'] == my_gmail), None)
    if meneger:
        return jsonify(meneger), 200
    else:
        return jsonify({"error": "Manager not found"}), 404
    

# პოსტების დამატება
@app.post('/post_post')
def post_posts():
    try:
        text = request.form.get('text')
        image_file = request.files.get('image')
        
        image_url = None
        if image_file and image_file.filename != '':
            extension = image_file.filename.split('.')[-1] 
            new_filename = f"{uuid.uuid4()}.{extension}" 
            path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
            image_file.save(path)
            image_url = f"http://127.0.0.1:5000/uploads/{new_filename}"

        posts = check_posts()
        new_post = {
            "id": str(uuid.uuid4())[:8],
            "title": text,
            "post": image_url,
            "View": ["pointSell"],
            "comments": [],
            "like": [],
            "time": str(datetime.now()).split()[1].split('.')[0],
            "date": str(datetime.now()).split()[0]
        }

        posts.insert(0, new_post)
        save_posts(posts)
        return jsonify(new_post), 201
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


# პოსტების წამოღება
@app.get('/check_posts')
def check_posts():
    if not os.path.exists(All_post):
        return []
    with open(All_post, "r", encoding="utf-8") as file:
        return json.load(file)


# ამჟამინდელი მომხმარებელი
@app.get('/get_current_user')
def current_user():
    if 'email' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    users = check_users()
    user = next((u for u in users if u['email'] == session['email']), None)
    return jsonify(user) if user else (jsonify({'error': 'Not found'}), 404)



@app.get("/")
def home():
    return "Flask is working for my luck! (((:"

if __name__ == '__main__':
    app.run(debug=True)