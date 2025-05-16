from flask import Flask, request, jsonify, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

app = Flask(__name__)

# Database URI
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('sql_alchemy')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Paintings(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_url = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# Dummy in-memory storage to simulate DB functions
# Replace these with actual DB queries
users = []
paintings = []
cart = []

# Dummy GET_SQL and EXEC_SQL for example purposes
def GET_SQL(query, *params):
    if "from users" in query:
        if "where username=?" in query:
            return [u for u in users if u['username'] == params[0]]
        if "where username=? or email=?" in query:
            return [u for u in users if u['username'] == params[0] or u['email'] == params[1]]
    elif "from paintings" in query:
        return paintings
    elif "from cart" in query:
        return cart
    return []

def EXEC_SQL(query, *params):
    if "insert into users" in query:
        users.append({"email": params[0], "username": params[1], "password": params[2], "session": None})
    elif "update users set session" in query:
        for u in users:
            if u['username'] == params[1]:
                u['session'] = params[0]
    elif "insert into cart" in query:
        cart.append({"image_url": params[0], "name": params[1], "price": params[2], "quantity": params[3]})
    elif "update cart set quantity" in query:
        for item in cart:
            if item['name'] == params[0]:
                item['quantity'] += 1
    elif "update cart set price" in query:
        for item in cart:
            if item['name'] == params[0]:
                item['price'] = item['price'] * item['quantity']

@app.route('/')
def index():
    return render_template('about.html')

@app.route('/paintings', methods=['GET'])
def view_paintings():
    # Fetch all paintings from your DB
    paintings = Paintings.query.all()  # This returns a list of dicts
    
    # Render the template, passing paintings data to it
    return render_template('paintings.html', paintings=paintings)

@app.route('/api/paintings', methods=['GET'])
def api_get_paintings():
    paintings = Paintings.query.all()
    paintings_list = []
    for p in paintings:
        paintings_list.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "image_url": url_for('static', filename='images/' + p.image_url)
        })
    return jsonify({"status": 0, "data": paintings_list})


@app.route('/signup', methods=['POST'])
def sign_up():
    try:
        data = request.get_json()
        email = data['email']
        username = data['username']
        password = data['password']

        EXIST = GET_SQL("select * from users where username=? or email=?", username, email)
        if len(EXIST) > 0:
            return jsonify({"status": 1, "message": "Username or email exists"})

        hashed = generate_password_hash(password)
        EXEC_SQL("insert into users (email,username,password) values (?,?,?)", email, username, hashed)
        return jsonify({"status": 0, "message": f"User {username} Inserted"})
    except Exception as e:
        return jsonify({"status": 1, "message": str(e)})

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']

        USER = GET_SQL("select * from users where username=?", username)
        if len(USER) == 1 and check_password_hash(USER[0]['password'], password):
            session_id = str(uuid.uuid4())
            EXEC_SQL("update users set session=?, expiration= NOW() + INTERVAL 30 MINUTE where username=?", session_id, username)
            return jsonify({"status": 0, "session": session_id, "message": f"User '{username}' logged in"})
        else:
            return jsonify({"status": 1, "message": "User/Password Not Found"})
    except Exception as e:
        return jsonify({"status": 1, "message": str(e)})

@app.route('/cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        image = data['image']
        name = data['name']
        price = data['price']

        EXIST = GET_SQL("SELECT * FROM cart WHERE name = ?", name)
        if len(EXIST) > 0:
            EXEC_SQL("update cart set quantity = quantity + 1 where name = ?", name)
            EXEC_SQL("update cart set price = price * quantity where name = ?", name)
            return jsonify({"status": 1, "message": "Item inserted"})
        else:
            EXEC_SQL("insert into cart (image_url, name, price, quantity) values (?,?,?,?)", image, name, price, 1)
            return jsonify({"status": 0, "message": "User Inserted"})
    except Exception as e:
        return jsonify({"status": 1, "message": str(e)})

@app.route('/cart', methods=['GET'])
def view_cart():
    try:
        data = GET_SQL("select * from cart")
        return render_template(cart.html)
    except Exception as e:
        return jsonify({"status": 1, "message": str(e)})

if __name__ == '__main__':
    app.run(debug=True)