from flask import Flask, request, jsonify, session, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from datetime import timedelta, datetime
import json
import os
import uuid
import requests
import eventlet
eventlet.monkey_patch()


app = Flask(__name__)

app.config.update(
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_SECURE=True,
    PERMANENT_SESSION_LIFETIME=timedelta(days=5)
)

CORS(app, 
     supports_credentials=True, 
     origins=["https://pointsell.onrender.com", "http://localhost:5173"],
     allow_headers=["*"], 
     methods=["GET", "POST", "OPTIONS"])



Google_Client_Id = '521401976640-a5pvvid5j8odcrvk0cbulg3ng1tf9r4e.apps.googleusercontent.com'
my_gmail = 'puturidzeana0210@gmail.com'

my_password = os.environ.get('Gmail_password')  
app.secret_key = os.environ.get('Gmail_password')


image_folders = 'images'
if not os.path.exists(image_folders):
    os.makedirs(image_folders)
app.config['UPLOAD_FOLDER'] = image_folders


All_user = "users.json"
All_product = "product.json"
All_post = "posts.json"
All_orders = 'orders.json'
All_message = 'Message'
All_candidats = 'job_candidats.json'


socketio = SocketIO(app, cors_allowed_origins=["https://pointsell.onrender.com", "http://localhost:5173"], manage_session=True)

online_users = {}

@socketio.on('connect')
def handle_connect():
    user_email = session.get('email')
    if user_email:
        online_users[request.sid] = user_email
        join_room(user_email)
        print(f"User {user_email} connected with SID {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    user_email = online_users.pop(request.sid, None)
    if user_email:
        leave_room(user_email)


@socketio.on('video-offer')
def handle_video_offer(data):
    target_email = data['to']
    emit('video-offer', {
        'from': session.get('email'),
        'offer': data['offer'],
        'callerData': data.get('callerData')
    }, to=target_email)


@socketio.on('video-answer')
def handle_video_answer(data):
    target_email = data['to']
    emit('video-answer', {
        'from': session.get('email'),
        'answer': data['answer']
    }, to=target_email)


@socketio.on('new-ice-candidate')
def handle_new_ice_candidate(data):
    target_email = data['to']
    emit('new-ice-candidate', {
        'from': session.get('email'),
        'candidate': data['candidate']
    }, to=target_email)


@socketio.on('end-call')
def handle_end_call(data):
    target_email = data['to']
    emit('call-ended', to=target_email)


# მომხმარებლების ინფორმაციის წაკითხვა
def check_users():
    if not os.path.exists(All_user):
        return []
    with open(All_user, "r", encoding="utf-8") as file:
        return json.load(file)


# კანდიდატების წაკითხვის ფუნქცია
def read_cands():
    if not os.path.exists(All_candidats):
        return []
    with open(All_candidats, "r", encoding="utf-8") as file:
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


# კანდიდატების შენახვა
def save_cands(lst):
    with open(All_candidats, "w", encoding="utf-8") as file:
        json.dump(lst, file, indent=4, ensure_ascii=False)


# მესიჯები
def messages(file_name, message):
    address = f'{All_message}/{file_name}'
    
    content = []
    if os.path.exists(address):
        with open(address, 'r', encoding='utf-8') as file:
            try:
                content = json.load(file)
            except:
                content = []

    content.append(message)
    with open(address, 'w', encoding='utf-8') as file:
        json.dump(content, file, indent=4, ensure_ascii=False)


# პოსტების შენახვა
def save_posts(posts):
    with open(All_post, "w", encoding="utf-8") as file:
        json.dump(posts, file, indent=4, ensure_ascii=False)


# პროდუქტის შენახვა
def save_products(product):
    with open(All_product, 'w', encoding='utf-8') as file:
        json.dump(product, file, indent=4, ensure_ascii=False)


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
@app.get('/images/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# პროდუქტების წაკითხვის გამოძახება
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
    
    current_time = str(datetime.utcnow() + timedelta(hours=4))
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
    table = int(data.get('table') or 0)
    

    total_sum = round(((subtotal + change + tax) - discount), 2)
    user = next((u for u in users if u['email'] == session['email']), None)

    if user:
        user_money = float(user.get('money', 0))
        if user_money >= total_sum:
            cart_items = user['curent_cart']['cart']
            cart_items_id = [item['Id'] for item in cart_items]
            product_times = [float(p.get('time', 0)) for p in all_products if p['Id'] in cart_items_id]
            sum_time = round(sum(product_times), 2)

        # შეკვეთებში დამატება
            new_order = {
                "order" : order_number,
                "cart" : user['curent_cart']['cart'],
                "pay": total_sum,
                "isReady": False,
                "time": current_time,
                "type": 'online' if not table else 'table',
                "name": name,
                "address": address,
                "table": table,
                "ready_time": sum_time
            }
            orders(new_order)


        # მომხმარებლის მონაცემების განახლება
            user['money'] = float(user['money']) - total_sum
            user['spent'] = float(user.get('spent', 0)) + total_sum
            
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
                "message": f"Your order has been successfully processed, and a payment of ${total_sum} has been debited. \n Curent Balance is ${round(user['money'], 2)}",
                "read": False
            })
            save_users(users) 

            # მეილზე გაგზავნა
            text=f'Your order successfully ordered! \n \n Pay: {round(total_sum, 2)}$ \n Balance: {round(user['money'], 2)}$ \n Order number: {order_number}'

            # send_email(user['email'], text)

            return jsonify({'success': 'Payment successful'}), 200
        
        else:
            return jsonify({'error': 'Insufficient balance'}), 400
    else:
        return jsonify({'error': 'user not found'}), 404
    

# რეგისტრაცია
@app.post("/register")
def register():
    current_time = str(datetime.utcnow() + timedelta(hours=4))

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
        "registration_date": current_time.split()[0],
        "profileUrl": "https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg",
        "notification": [
            {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": "Registration is successful!",
                "read": False
            }
        ],
        "friends": [],
        "friend_request": [],
        "visit": [current_time.split()[0]],
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
        "orders": [],
        "block": False,
        "date": None,
        "active": False
    }

    users.append(new_user)
    save_users(users)
    # send_email(email, "Registration Successful!")
    return jsonify({"message": "Registration Successful"}), 201


# შესვლა
@app.post('/login')
def login():
    data = request.get_json()
    current_time = str(datetime.utcnow() + timedelta(hours=4))

    if not data:
        return jsonify({'error': 'no data'}), 400
    
    email = data.get("email")
    password = data.get("password")
    users = check_users() 
    user = next((user for user in users if user['email'] == email and user['password'] == password), None)

    print(user)
    
    if user and not user['block']:
        session['email'] = email
        session['is_login'] = True
        user["active"] = True
        
        if current_time.split()[0] not in user['visit']:
            user['visit'].append(current_time.split()[0])
            user['money'] += 100 if user['position'] == 'Customer' else 300 if user['position'] == 'Worker' else 500
            user['notification'].insert(0, {
                'date': current_time.split()[0],
                'time': current_time.split()[1],
                "read": False,
                'message': f'Daily Gift! You have been credited with ${100 if user['position'] == 'Customer' else 300 if user['position'] == 'Worker' else 500}'
            }),
        save_users(users)

        return jsonify({'message': 'Login successful!'}), 200
    
    elif user and user['block']:
        return jsonify({'error': 'Your account has been blocked'}), 404
    
    return jsonify({'error': 'Invalid'}), 401


# შესვლა Google-ით
@app.post('/google_login')
def google_login():
    current_time = str(datetime.utcnow() + timedelta(hours=4))
    
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
            return jsonify({"error": "Email not found"}), 400

        users = check_users()
        user = next((u for u in users if u['email'] == email), None)

        if not user:
            user = {
                "email": email,
                "name": user_info.get('name') or "User",
                "profileUrl": user_info.get('picture') or "",
                "password": str(uuid.uuid4()),
                "registration_date": current_time.split()[0],
                "position": "Customer" if email != my_gmail else 'Manager',
                "money": 1000 if email != my_gmail else 10000,
                "notification": [{
                    "date": current_time.split()[0], 
                    "time": current_time.split()[1], 
                    "message": "Welcome!", 
                    "read": False
                }],
                "visit": [current_time.split()[0]],
                "friends": [],
                "friend_request": [],
                "curent_cart": {
                    "order": None, 
                    "cart": [], 
                    "sum": {"subtotal": 0}
                    },
                "orders": [],
                "block": False,
                "date": None,
                "active": True
            }
            users.append(user)
        
        elif user.get('block'):
            return jsonify({'error': 'Account is blocked'}), 403

        else:
            user['active'] = True
            if current_time.split()[0] not in user.get('visit', []):
                bonus = 100 if user['position'] == 'Customer' else 300 if user['position'] == 'Worker' else 500
                user['money'] += bonus
                user['visit'].append(current_time.split()[0])
                user['notification'].insert(0, {
                    "date": current_time.split()[0], 
                    "time": current_time.split()[1], 
                    "message": f"Daily Bonus ${bonus}!", 
                    "read": False
                })
            
        save_users(users)
        session.clear() 
        session['email'] = email
        session.permanent = True
        
        return jsonify({"message": "Login successful"}), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


# ვერიფიკაცია
@app.post('/verification')
def verification():
    if 'email' not in session:
        return jsonify({"error": 'Please log in'}), 401
    
    data = request.get_json()
    email = data.get('email')
    isCorrect = data.get('isCorrect')

    users = check_users()
    user = next((u for u in users if u['email'] == email), None)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get('block'):
        return jsonify({"error": 'User is already blocked'}), 403

    if isCorrect:
        user['count'] = 0 
        save_users(users)
        return jsonify({'message': 'verify!'}), 200
    else:
        user['count'] = user.get('count', 0) + 1
        
        if user['count'] >= 3 and email != my_gmail:
            user['block'] = True
            save_users(users)
            return jsonify({'error': 'User blocked due to too many attempts'}), 403
        
        save_users(users)
        return jsonify({"error": 'Wrong answer'}), 400
    

# პაროლის შეცვლა
@app.post('/change_password')
def change_password():
    current_time = str(datetime.utcnow() + timedelta(hours=4))
    data = request.get_json()
    email = data["email"]
    password = data['password']
    users = check_users()

    if email:
        user = next((u for u in users if u['email'] == email), None)

        if user:
            user['password'] = password
            user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": "Password Change Successfully",
                "read": False
            })
            save_users(users)
            # send_email(user['email'], "Password Change Successfully! Thank you for choosing our restaurant!")
            return jsonify({'message': 'sucsessful!'}), 200
        
        else:
            return jsonify({'error': 'User not found'}), 404


    return jsonify({'error': 'empty value / no content'}), 204


# მომხმარებლის მონაცემების შეცვლა
@app.post('/change_user_info')
def change_user_info():
    current_time = str(datetime.utcnow() + timedelta(hours=4))
    data = request.get_json()
    email = data['email']
    address = data['address']
    phone = data['phone']
    name = data['name']
    date = data['date']

    users = check_users()
    user = next((u for u in users if u['email'] == email), None)

    if user:
        user['name'] = name
        user['address'] = address
        user['phone'] = phone
        user['date'] = date
        user['notification'].insert(0, {
            "date": current_time.split()[0],
            "time": current_time.split()[1],
            "message": "Information Update Successfully!",
            "read": False
        })
        save_users(users)
        
        return jsonify({'message': 'sucsessfully'}), 200
    
    return jsonify({'error': 'not found'}), 404


# ჩემი ინფორმაცია / მენეჯერის
@app.get('/managers_info') 
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
            image_url = f"https://pointsell-4.onrender.com/images/{new_filename}"

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

    if user:
        return jsonify(user)
    
    return jsonify({'error': 'Not found'}), 400


# მეგობრების დამატება / წაშლა
@app.post('/friends_delete_or_add')
def friends_delete_or_add():
    current_time = str(datetime.utcnow() + timedelta(hours=4))

    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    data = request.get_json()
    friend_email = data['email']

    users = check_users()
    current_user = next((u for u in users if u['email'] == session['email']), None)
    friend = next((u for u in users if u['email'] == friend_email))

    if current_user and friend:
        if friend_email in current_user['friends']:
            current_user['friends'].remove(friend_email)
            friend['friends'].remove(current_user['email'])
            current_user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f'You Delete {friend_email} from your friend list',
                "read": False
            })
            friend['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f'You {current_user['email']} removed from their friends list',
                "read": False
            })
        elif current_user['email'] in friend['friend_request']:
            current_user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f'You Delete {friend_email} from your request list',
                "read": False
            })
            friend['friend_request'].remove(current_user['email'])

        else:
            friend['friend_request'].append(session['email'])
            friend['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f'{current_user['email']} send you friend request',
                "read": False
            })
            current_user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f'You send Friend Request {friend_email}',
                "read": False
            })
        save_users(users)

        return jsonify({'message': 'add successfully'}), 200
    
    return jsonify({'error': 'user is not found'}), 404


# მეგობრობის მოთხოვნის დასტური / უარყოფა 
@app.post('/delete_or_confirm')
def delete_or_confirm():
    current_time = str(datetime.utcnow() + timedelta(hours=4))

    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    else:
        data = request.get_json()
        operation_type = data['type']
        friend_email = data['email']

        all_user = check_users()
        friend = next((u for u in all_user if u['email'] == friend_email), None)
        user = next((u for u in all_user if u['email'] == session['email']), None)

        if friend and user:
            if operation_type == 'delete':
                if friend_email in user.get('friend_request', []):
                    user['friend_request'].remove(friend_email)
                    
                    friend['notification'].insert(0, {
                        'date': current_time.split()[0],
                        "time": current_time.split()[1],
                        "message": f"{session['email']} did not confirm your friend request",
                        "read": False
                    })

            elif operation_type == 'add':
                friend_requests = user.get('friend_request', [])
    
                if friend_email in friend_requests:
                    user['friend_request'].remove(friend_email)
    
                if friend_email not in user['friends']:
                    user['friends'].append(friend_email)

                if session['email'] not in friend['friends']:
                    friend['friends'].append(session['email'])
                            
                chat_file_name = f"{'_'.join(sorted([user['email'], friend_email]))}.json"

                if not os.path.exists(All_message):
                    os.makedirs(All_message)

                address = os.path.join(All_message, chat_file_name)
                if not os.path.exists(address):
                    with open(address, 'w', encoding='utf-8') as file:
                        json.dump([], file, indent=4) 

            else:
                return jsonify({'error': 'operation type is not found'}), 404
            save_users(all_user)
        else:
            return jsonify({'error': 'user is not found'}), 404


# ნებისმიერის მესიჯების წაკითხვა
def read_messages(file_path):
    try:
        if not os.path.exists(file_path):
            return []
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except Exception as e:
        return []


# ნებისმიერი მესიჯების წაკითხვა
@app.post('/read_user_messages')
def read_user_messages():
    if 'email' not in session:
        return jsonify({'error': 'User is not logged in'}), 401
    
    data = request.get_json()
    friend_email = data.get('email')
    
    if not friend_email:
        return jsonify({'error': 'Friend email is required'}), 400

    chat_name = '_'.join(sorted([friend_email, session['email']]))
    file_path = os.path.join(All_message, f"{chat_name}.json")

    messages_data = read_messages(file_path)
    return jsonify(messages_data), 200


# მესიჯების გაგზავნა
@app.post('/send_new_message')
def send_new_message():
    current_time = str(datetime.utcnow() + timedelta(hours=4))

    if 'email' not in session:
        return jsonify({'error': 'user is logged'}), 401 
    
    data = request.get_json()
    message = data['message']
    friend_email = data['email']
    sender_email = session['email']

    file_name = '_'.join(sorted([friend_email, sender_email]))
    file_path = os.path.join(All_message, f"{file_name}.json")

    new_message = {
        "sender": session['email'],
        "message": message,
        "image": None,
        "date": current_time,
        "read": False
    }

    try:
        messages = []
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as file:
                messages = json.load(file)

        messages.append(new_message)
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(messages, file, indent=4, ensure_ascii=False)
        return jsonify(new_message), 200
    
    except Exception as e:
        return jsonify({'error': e}), 500


# მესიჯების წაშლა
@app.post('/delete_message')
def delete_message():
    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    data = request.get_json()
    friend_email = data['email']
    dlt_message = data['message']
    msg_time = data['date']

    file_name = '_'.join(sorted([session['email'], friend_email]))
    file_path = os.path.join(All_message, f"{file_name}.json")
    result = read_messages(file_path)

    if result:
        message = [m for m in result if not (m['message'] == dlt_message and str(m['date']) == str(msg_time))]
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(message, file, indent=4)
        return jsonify({'message': 'operation successful!'}), 200
    else:
        return jsonify({'error': 'message is not found'}), 404
    

# შეტყობინების წაკითხვა
def read_notification(typeRead):
    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    all_users = check_users()
    user = next((u for u in all_users if u['email'] == session['email']), None)

    if not user:
        return jsonify({'error': 'user not found'}), 404

    notifications = user.get('notification')
    if typeRead == '1':
        if len(notifications) > 0 and not notifications[0].get('read'):
            notifications[0]['read'] = True

            save_users(all_users)
            return jsonify({'message': 'sucsessful!'}), 200
        
        elif len(notifications) == 0:
            return jsonify({'message': 'sucsessful!'}), 200
        
    elif typeRead == 'all':
        if len(notifications) > 0:
            for item in notifications:
                if not item['read']:
                    item['read'] = True
            save_users(all_users)
            return jsonify({'message': 'sucsessful!'}), 200
    
        elif len(notifications) == 0:
            return jsonify({'message': 'sucsessful!'}), 200
        
        
    return jsonify({'error': 'not found'}), 404


# ბოლო მესიჯი
@app.post('/last_notification')
def last_notification():
    return read_notification('1')


# ყველა შეტყობინების ნახვა
@app.post('/all_notification')
def all_notification():
    return read_notification('all')


# პროდუქტის შეფასება
@app.post('/vote')
def vote():
    if 'email' not in session:
        return jsonify({"error": 'user logged'}), 401
    
    data = request.get_json()
    star = int(data['star'])
    product = data['product']
    email = data['email']

    all_product = check_products()
    voted_product = next((p for p in all_product if p['Id'] == product), None)

    if voted_product:
        user = next((u for u in voted_product['vote'] if u['email'] == email), None)
        if user:
            user['star'] = star
        else:
            voted_product['vote'].append({
                "email": email,
                "star": star
            })

        total_stars = sum(v['star'] for v in voted_product['vote'])
        vote_count = len(voted_product['vote'])
        voted_product['star'] = round(total_stars / vote_count, 1)

        
        save_products(all_product)
        return jsonify({"message": "Success"}), 200
    else:
        return jsonify({'error': "product is not found"}), 404
    

# პროდუქტის წაშლა
@app.post('/delete_product')
def delete_product():
    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    data = request.get_json()
    product_id = data.get('id')
    all_product = check_products()

    product = next((p for p in all_product if p['Id'] == product_id), None)

    if product:
        all_product.remove(product)
        save_products(all_product)
        return jsonify({'message': 'sucsessful!'}), 200
    return jsonify({'error': 'product not found'}), 404


# პროდუქტის დამატება
@app.post('/add_product')
def add_product():
    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    data = request.form

    image_file = request.files.get('product_image') 
    name = data.get('product_name')
    price = data.get('product_price')
    discount = data.get('product_discount') or 0
    category = data.get('product_category')
    description = data.get('product_description')
    info = data.get('product_info')
    time = data.get('product_time') 

    image_url = ""

    if image_file:
        extension = image_file.filename.split('.')[-1] 
        new_filename = f"{uuid.uuid4()}.{extension}" 
        
        path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        image_file.save(path)
        
        image_url = f"https://pointsell-4.onrender.com/images/{new_filename}"


    new_product = {
        "Id" : str(uuid.uuid4()).split('-')[0][1:-1],
        'price': price,
        "discount" : discount,
        "product_name" : name,
        "product_image" : image_url,
        "type": category,
        "product_description": description,
        "info": info,
        "star": 5,
        "vote": 1,
        "time": time,
    }

    products = check_products()
    products.insert(0, new_product)
    save_products(products)

    return jsonify({'message': 'successful!'}), 200


# მომხმარებლის წაშლა
@app.post('/delete_user')
def delete_user() :
    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    data = request.get_json()
    user_email = data.get('user_email')
    all_user = check_users()

    user = next((p for p in all_user if p['email'] == user_email), None)

    if user:
        all_user.remove(user)
        save_users(all_user)
        return jsonify({'message': 'sucsessful!'}), 200
    return jsonify({'error': 'product not found'}), 404


# მომხმარებლის დაბლოკვა
@app.post('/block_user')
def block_user():
    if 'email' not in session:
        return jsonify({'error': 'user is not logged'}), 401
    
    data = request.get_json()
    email = data.get('email')

    users = check_users()
    user = next((u for u in users if u['email'] == email), None)

    if user:
        user['block'] = not user['block']

        save_users(users)
        return jsonify({'message': 'sucsessful!'}), 200
    
    return jsonify({'error': 'user not found'}), 404


# პაროლის აღდგენა საიტიდან
@app.post('/reset_password')
def reset_password():
    if 'reset_email' not in session or 'verify_code' not in session:
        return jsonify({'error': 'Session expired'}), 400
    
    data = request.get_json()
    users = check_users()
    input_code = data.get('code')
    
    reset_email = session['reset_email']
    user = next((u for u in users if u['email'] == reset_email), None)

    if user:
        if user.get('block'):
            return jsonify({'error': 'Account is blocked!'}), 403

        if str(input_code) == str(session['verify_code']):
            current_count = user.get('count', 0) + 1
            user['count'] = current_count
            save_users(users)
        
        else:
            current_count = user.get('count', 0) + 1
            user['count'] = current_count
            
            if current_count >= 3 and user['email'] != my_gmail:
                user['block'] = True
                save_users(users)
                return jsonify({'error': 'Too many attempts. Blocked!'}), 403
            
            save_users(users)
            return jsonify({'error': f'Wrong code. {3 - current_count} attempts left'}), 400

    return jsonify({'error': 'User not found'}), 404


# საიტიდან გამოსვლა
@app.post('/log_out')
def log_out():
    if 'email' not in session:
        return jsonify({'error': 'user is logged'}), 401
    
    users = check_users()    
    user = next((u for u in users if u['email'] == session['email']), None)
    if user:
        user['active'] = False
        session['is_login'] = False
        user = None
        save_users(users)
        session.clear()
        return jsonify({'message': 'log out successful!'}), 200

    return jsonify({'error': 'user is not found'}), 404


# პროფილის სურათის განახლება / ატვირთვა 
@app.post('/change_profile')
def change_profile():
    if 'email' not in session:
        return jsonify({'error', 'user not found'}), 404
    
    current_time = str(datetime.utcnow() + timedelta(hours=4))

    image_file = request.files.get('image')
    image_url = None

    email = session['email']
    all_user = check_users()
    user = next((u for u in all_user if u['email'] == email), None)

    if image_file and image_file.filename != '':
        extension = image_file.filename.split('.')[-1] 
        new_filename = f"{uuid.uuid4()}.{extension}" 
        path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        image_file.save(path)
        image_url = f"https://pointsell-4.onrender.com/images/{new_filename}"
        
        if user:
            user['profileUrl'] = image_url
            user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f"Your profile has been successfully updated.",
                "read": False
            })
            save_users(all_user)
            return jsonify({"message": "change profile successfully"}), 200
        
        else:
            return jsonify({"error": 'user not found'}), 404
    else:
        return jsonify({'error': 'image not found'}), 404
    

# ჩატში სურათის გაგზავნა
@app.post('/send_image')
def send_image():
    if 'email' not in session:
        return jsonify({'error': 'user is not found'}), 404
    
    current_time = str(datetime.utcnow() + timedelta(hours=4))

    email = session['email']
    email_2 = request.form.get('email_2')
    image = request.files.get('image')


    if not image:
        return jsonify({'error': 'No image uploaded'}), 400

    extension = image.filename.split('.')[-1] 
    new_filename = f"{uuid.uuid4()}.{extension}" 
    path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
    image.save(path)
    image_url = f"https://pointsell-4.onrender.com/images/{new_filename}"

    file_name = "_".join(sorted([email, email_2]))
    file_path = os.path.join(All_message, f"{file_name}.json")

    new_message = {
        "sender": email,
        "message": None,
        "image": image_url,
        "date": current_time,
        "read": False
    }

    try:
        history = []
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as file:
                try:
                    history = json.load(file)
                except:
                    history = []

        history.append(new_message)

        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(history, file, indent=4, ensure_ascii=False)
            
        return jsonify({'message': 'successfully', 'data': new_message}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# სამსახურის დაწყება (განცხადების დაწერა)
@app.post('/start_work')
def start_work():
    current_time = str(datetime.utcnow() + timedelta(hours=4))

    data = request.get_json()
    email = data.get('email')
    text = data.get('text')
    
    if not email:
        return jsonify({"error": 'user not found'}), 401


    all_user = check_users()
    user = next((u for u in all_user if u['email'] == email), None)
    manager = next((u for u in all_user if u['position'] == 'Manager'))
    
    if user and text:
        new_cand = {
            "user": user['email'],
            "time": current_time,
            "text": text
        }

        user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f"You have successfully completed the application. We will review your application and notify you of the response.",
                "read": False
        })

        manager['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f"{email} filled out an application to start work. check it!",
                "read": False
        })

        cand_list = []
        with open(All_candidats, "r", encoding="utf-8") as file:
            lst = json.load(file)
            cand_list = lst if type(lst) == list else []

        cand_list.append(new_cand)

        save_users(all_user)
        with open(All_candidats, "w", encoding="utf-8") as file:
            json.dump(cand_list, file, indent=4, ensure_ascii=False)

        return jsonify({"message": 'work'}), 200
    else:
        return jsonify({"error": 'not found'}), 404


# დასტური დასაქმებაზე / უარყოფა
@app.post('/answer')
def answer():
    current_time = str(datetime.utcnow() + timedelta(hours=4))

    if 'email' not in session:
        return jsonify({'error': 'user is not found'}), 401
    
    data = request.get_json()
    answer = data['answer']
    email = data['email']
    all_user = check_users()
    user = next((u for u in all_user if u['email'] == email), None)

    all_cands = read_cands()
    application = [a for a in all_cands if a['user'] == email]

    if user and len(application) > 0:
        if answer:
            user['position'] = 'Worker'
            user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f"Congratulations, you have been hired",
                "read": False
            })
        else:
            user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f"Unfortunately, you didn't pass the interview. Try again another time",
                "read": False
            })
            
        save = list(filter(lambda a: a['user'] != email, all_cands))
        save_cands(save)

        save_users(all_user)
        return jsonify({'message': 'save '}), 200
    
    else:
        return jsonify({'error': 'user not found'}), 404


# სამსახურიდან გაგდება
@app.post('/fired')
def fired():
    current_time = str(datetime.utcnow() + timedelta(hours=4))

    if 'email' not in session:
        return jsonify({'error' : 'user not found'}), 401
    
    data = request.get_json()
    email = data['email']

    all_user = check_users()
    user = next((u for u in all_user if u['email'] == email), None)

    if user:
        user['position'] = 'Customer'
        user['notification'].insert(0, {
                "date": current_time.split()[0],
                "time": current_time.split()[1],
                "message": f"You have been fired. Good luck!",
                "read": False
            })
        save_users(all_user)
        return jsonify({"message": 'change'}), 200
    
    else:
        return jsonify({'error': 'user not found'}), 404


# კანდიდატების წაკითხვა
@app.get('/candidats')
def candidats():
    if 'email' not in session:
        return jsonify({'error': 'user not found'}), 404
    
    with open(All_candidats, "r", encoding="utf-8") as file:
        info = json.load(file)
        return jsonify(info)


@app.get("/")
def home():
    all_users = check_users()
    all_product = check_products()

    return jsonify([all_users, all_product, All_orders, All_candidats])


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)