from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from email.message import EmailMessage
import ssl
import smtplib
from datetime import datetime

app = Flask(__name__)
CORS(app)


All_user = "users.json"
All_product = "product.json"

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

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
        smtp.login(my_gmail, my_password)
        smtp.sendmail(my_gmail, user_email, em.as_string())


# მომხმარებლების ინფორმაციის წაკითხვა
def check_users():
    if not os.path.exists(All_user):
        return []
    with open(All_user, "r", encoding="utf-8") as file:
        return json.load(file)


# მომხმარებლის ჩაწერა / დამატება
def save_users(users):
    with open(All_user, "w", encoding="utf-8") as file:
        json.dump(users, file, indent=4, ensure_ascii=False)


# პროდუცტქების წაკითხვა
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

    
    # task 001
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    email = data.get("email")
    password = data.get("password")
    
    users = check_users()

    # task 002
    if any(u["email"] == email for u in users):
        return jsonify({"error": "User already exists"}), 409

    new_user = {
        "name": None,
        "lastname": None,
        "age": None,
        "position": "Customer" if email != "futureana735@gmail.com" else "Manager",
        "email": email,
        "password": password,
        "gender": None,
        "phone": None,
        "profileUrl": "https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg",
        "review": [],
        "history": [],
        "friends": [],
        "favorite": [],
        "notification": {
            current_time.split()[0] : [
                {
                    current_time.split('.')[0].split()[1]: ["Registration is successful! Now you can order food or get a job!"]
                }
            ]
        },
        "curent_cart": [],
        "money": 1000 if email != 'futureana735@gmail.com' else 10000
    }

    users.append(new_user)
    save_users(users)

    try:
        send_email(email, "Registration Successful! Thanks for choosing our restaurant!")
    except Exception as e:
        print("Email sending failed:", e)

    return jsonify({"message": "Registration Successful"}) , 201


# შესვლა
@app.post('/login')
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'not send information'}), 400
    
    email = data.get("email")
    password = data.get("password")
    
    users = check_users() 
    
    user = next((u for u in users if u['email'] == email and u['password'] == password), None)
    
    if user:
        return jsonify({'message': 'Login successful!'}), 200
    else:
        return jsonify({'error': 'Email or password is not correct'}), 401
    
    
@app.get("/")
def home():
    return "Flask is working for my Luck (((: "


if __name__ == '__main__':
    app.run(debug=True)
