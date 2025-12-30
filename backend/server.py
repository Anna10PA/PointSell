from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
import json
import os
from email.message import EmailMessage
import ssl
import smtplib
from datetime import datetime
import uuid
import requests



app = Flask(__name__)
app.secret_key = os.environ.get('Gmail_password')

CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])


Google_Client_Id = '553005797004-r8f7ri794npsv1kjab782t79p42vg6g3.apps.googleusercontent.com'


post_folders = 'posts'
if not os.path.exists(post_folders):
    os.makedirs(post_folders)
app.config['UPLOAD_FOLDER'] = post_folders


All_user = "users.json"
All_product = "product.json"
All_post = "posts.json"
All_orders = 'orders.json'


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


# შეკვეთების წამოღება
@app.get('/orders')
def get_orders():
    if not os.path.exists(All_orders):
        return []
    with open(All_orders, "r", encoding="utf-8") as file:
        return json.load(file)


# ყველა მომხმარებლის ინფორმაციის წამოღება
@app.get('/get_all_user')
def get_all_user():
    return jsonify(check_users())


# მომხმარებლის დამატება
def save_users(users):
    with open(All_user, "w", encoding="utf-8") as file:
        json.dump(users, file, indent=4, ensure_ascii=False)


# პოსტების შენახვა
def save_posts(posts):
    with open(All_post, "w", encoding="utf-8") as file:
        json.dump(posts, file, indent=4, ensure_ascii=False)


# შეკვეთებში დამატება
def orders(order):
    order_list = []
    if os.path.exists(All_orders):
        with open(All_orders, 'r', encoding='utf-8') as file:
            try:
                order_list = json.load(file)
            except:
                order_list = []

    order_list.insert(0, order)

    with open(All_orders, 'w', encoding='utf-8') as file:
        json.dump(order_list, file, indent=4, ensure_ascii=False)


# კომენტარის დამატება
@app.post('/add_comment')
def add_comment():
    data = request.get_json()
    post_id = data.get('post_id')
    comment_text = data.get('text')

    user_email = data.get('user_email')

    if not comment_text:
        return jsonify({"error": "Comment it empty"}), 400

    posts = check_posts()

    for post in posts:
        if post['id'] == post_id:
            new_comment = {
                "id": str(uuid.uuid4()),
                "user_email": user_email,
                "comment": comment_text,
                "date": str(datetime.now()).split()[0]
            }
            
            post['comments'].append(new_comment)
            save_posts(posts)
            return jsonify(new_comment), 201

    return jsonify({"error": "Post not found"}), 404


# კომენტარის წაშლა
@app.post('/delete_comment')
def delete_comment():
    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401

    data = request.get_json()
    comment_id = data.get('comment_id')
    post_id = data.get('post_id')

    posts = check_posts()

    for post in posts:
        if str(post['id']) == str(post_id):
            post['comments'] = [c for c in post['comments'] if c.get('id') != comment_id]
            break
    save_posts(posts)
    return jsonify({'message': 'Deleted'}), 200


# მოწონება
@app.post('/like')
def like():
    data = request.get_json()
    post_id = data.get('post_id')

    user_email = data.get('email')

    status = False
    posts = check_posts()
    for post in posts:
        if post['id'] == post_id:
            liker = user_email
            
            if 'like' not in post:
                post['like'] = []

            if user_email in post['like'] :
                post['like'].remove(user_email)
                status = True

            else:
                post['like'].append(liker)
                status = False

            save_posts(posts)
            return jsonify({
                "likes_count": len(post['like']),
                "status": status
            }), 200
        

    return jsonify({"error": "Post not found"}), 404


# ნახვები
@app.post('/view')
def view():
    data = request.get_json()
    post_id = data.get('post_id')
    user_email = data.get('email')

    posts = check_posts()

    for post in posts:
        if post['id'] == post_id:
            
            if 'view' not in post:
                post['view'] = []

            if user_email not in post['view']:
                post['view'].append(user_email)

            save_posts(posts)
            return jsonify({
                "view": len(post['view']),
            }), 200
        
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


# პროდუქტის კალათაში დამატება 
@app.post('/user_cart')
def cart():
    if 'email' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    users = check_users() 
    user = next((i for i in users if i['email'] == session['email']), None)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    product_id = data.get('product_id')
    
    add_count = int(data.get('product_count')) if data.get('product_count') else 1

    found = False
    
    if 'curent_cart' not in user :
        user['curent_cart'] = {"order": None, "cart": []}
    
    if 'cart' not in user['curent_cart']:
        user['curent_cart']['cart'] = []

    for product in user['curent_cart'].get('cart'):
        if product['Id'] == product_id:
            product['count'] += add_count 
            found = True
            break

    if not found:
        user['curent_cart']['cart'].insert(0, {
            "Id": product_id,
            "count": add_count
        })

    if not user['curent_cart']['order']:
        user['curent_cart']['order'] = str(uuid.uuid4()).split('-')[0]

    save_users(users)
    return jsonify(user['curent_cart']), 200


# კალათის შიგნით კიდევ დამატება
@app.post('/update_cart')
def add_in_cart():
    if 'email' not in session:
        return jsonify({'error': 'user is not login'}), 401
    
    data = request.get_json()
    product_id = data.get('id')
    new_value = data.get('count')

    users = check_users()
    user = next((u for u in users if u['email'] == session['email']), None)

    if user:
        for product in user['curent_cart']['cart']:
            if product['Id'] == product_id:
                product['count'] = new_value
                save_users(users)
                return jsonify({'message': 'sucsessful!'}), 200
    else:
        return jsonify({'error': 'not found'}), 404


# კალათიდან წაშლა
@app.post('/delete_from_cart')
def delete_from_cart():
    if 'email' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    data = request.get_json()
    product_id = data.get('id')

    users = check_users()
    user = next((u for u in users if u['email'] == session['email']), None)

    if user and 'curent_cart' in user:
        user['curent_cart']['cart'] = [p for p in user['curent_cart']['cart'] if p['Id'] != product_id]
        save_users(users)
        return jsonify({"message": "Sucsessful!"}), 200

    return jsonify({"error": "Not found"}), 404


# კალათის მთლიანად გასუფთავება
@app.post('/clean_cart')
def clean_cart():
    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    users = check_users()
    user = next((u for u in users if u['email'] == session['email']), None)

    if user:
        user['curent_cart'] = {
            'order': None,
            'cart': []
        }
        save_users(users)
        return jsonify({'message': "save sucsessful!"}), 200
    
    return jsonify({'error': 'not found'}), 404


# გადასახდელი თანხის მონაცემების დამატება json ფაილში
@app.post('/pay_sum')
def pay_sum():
    if "email" not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    data = request.get_json()
    current_user_email = session['email']

    users = check_users()
    current_user = next((u for u in users if u['email'] == current_user_email), None)

    if current_user:
        current_user['curent_cart']['sum'] = {
            'subtotal': data.get('subtotal'),
            'change': data.get('change'),
            'discount': data.get('discount'),
            'tax': 0
        }
        save_users(users)
        return jsonify({'message': 'Successfull!'}), 200
    
    return jsonify({'error': 'User not found'}), 404


# გადახდა
@app.post('/pay')
def pay():    
    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    current_time = str(datetime.now())
    data = request.get_json()
    users = check_users()
    all_products = check_products()

    # წამოღება რექუესთის საშუალებით
    order_number = data.get('order_number')
    subtotal = float(data.get('subtotal') or 0)
    change = float(data.get('change') or 0)
    discount = float(data.get('discount') or 0)
    tax = float(data.get('tax') or 0)

    phone = data.get('phone')
    address = data.get('address')
    name = data.get('name')

    total_sum = round(((subtotal + change + tax) - discount), 2)
    user = next((u for u in users if u['email'] == session['email']), None)

    if user:
        if user['money'] >= total_sum:
            cart_items = user['curent_cart']['cart']
            cart_items_id = [item['Id'] for item in cart_items]
            product_times = [p['time'] for p in all_products if p['Id'] in cart_items_id]
            sum_time = round(sum(product_times), 2)

        # შეკვეთებში დამატება
            new_order = {
                "order" : order_number,
                "cart" : user['curent_cart']['cart'],
                "pay": total_sum,
                "isReady": False,
                "time": current_time,
                "type": 'online',
                "name": name,
                "address": address,
                "table": None,
                "ready_time": sum_time
            }
            orders(new_order)


        # მომხმარებლის მონაცემების განახლება
            user['money'] -= total_sum
            user['orders'].append(order_number)
            user['curent_cart'] = {
                "order": None,
                "cart": [],
                "sum": {
                    "discount": 0,
                    "tax": 0,
                    "change": 0,
                    "subtotal": 0
                }
            }
            user['address'] = address
            user['phone'] = phone
            user['name'] = name
            user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f"Your order has been successfully processed, and a payment of ${round(user['money'], 2)} has been debited.",
                "read": False
            })
            user['spent'] += total_sum
            save_users(users) 

            # მეილზე გაგზავნა
            text=f'Your order sucsesfully ordered! \n \n Pay: {round(total_sum, 2)}$ \n Balance: {round(user['money'], 2)}$ \n Order number: {order_number}'

            send_email(user['email'], text)

            return jsonify({'success': 'Payment successful'}), 200
        
        else:
            return jsonify({'error': 'Insufficient balance'}), 400
    else:
        return jsonify({'error': 'user not found'}), 404
    

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
        "position": "Customer" if email != my_gmail else "Manager",
        "email": email,
        "password": password,
        "profileUrl": "https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg",
        "notification": [
            {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": "Registration is successful!",
                "read": False
            }
        ],
        "curent_cart": {
            "order": None,
            "cart": [],
            "sum": {
                "discount": None,
                "tax": None,
                "change": None,
                "subtotal": None
            }
        },
        "money": 1000 if email != my_gmail else 10000,
        "spent" : 0,
        "address": None,
        "orders": []
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


# შესვლა Google-ით
@app.post('/google_login')
def google_login():
    data = request.get_json()
    token = data.get('token') 
    
    try:
        response = requests.get('https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {token}'})
        
        if response.status_code != 200:
            return jsonify({"error": "Invalid Google Token"}), 400
            
        user_info = response.json()
        email = user_info.get('email')
        
        if not email:
            return jsonify({"error": "Email not found in Google account"}), 400

        users = check_users()
        user = next((u for u in users if u['email'] == email), None)

        if not user:
            user = {
                "email": email,
                "name": user_info.get('name') or user_info.get('given_name') or user_info.get('User'),
                "profileUrl": user_info.get('picture') or "https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg",
                "password": str(uuid.uuid4()),
                "position": "Customer",
                "money": 1000,
                "notification": [
                    {
                        "date": "2025-12-14",
                        "time": "14:10:58",
                        "message": "Hello User!",
                        "read": False
                    }
                ],
                "friends": [],
                "curent_cart": {
                    "order": None,
                    "cart": [],
                    "sum": {
                        "discount": None,
                        "tax": None,
                        "change": None,
                        "subtotal": None
                    }
                },
                "orders": [],
                "address": None,
                "spent": 0,
                "phone": None,
            }
            
            users.append(user)
            save_users(users)
            
        session['email'] = email
        session['is_login'] = True
        return jsonify({"message": "Login successful"}), 200
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Server error during Google Login"}), 500


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
            "view": [],
            "comments": [],
            "like": [],
            "time": str(datetime.now()).split()[1].split('.')[0],
            "date": str(datetime.now()).split()[0]
        }

        posts.insert(0, new_post)
        save_posts(posts)
        return jsonify(new_post), 201
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


# პოსტების წაშლა
@app.post('/delete_post')
def delete_post():
    if 'email' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    data = request.get_json()
    post_id = data.get('id')

    all_posts = check_posts()

    post_check = next((post for post in all_posts if post['id'] == post_id), None)

    if post_check:
        all_posts.remove(post_check)

        try:
            with open(All_post, 'w', encoding='utf-8') as file:
                json.dump(all_posts, file, ensure_ascii=False, indent=4)

            return jsonify({'message': 'sucsessful!'}), 200
        
        except Exception as error:
            print(error)
            return jsonify({'error': str(error)}) , 401
    else:
        return jsonify({'error': 'Post not found'}), 404


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