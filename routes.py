from flask import Flask, request, jsonify, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

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

class Cart(db.Model):
    __tablename__ = 'cart'

    owner_id = db.Column(db.String(255), nullable=False, primary_key=True)  # username or session ID
    owner_type = db.Column(db.String(50), nullable=False, primary_key=True)  # 'username' or 'session'
    name = db.Column(db.String(255), nullable=False, primary_key=True)  # item name, part of composite primary key
    image_url = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))  # Optional description
    price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, default=1)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    session = db.Column(db.String(255), nullable=True)
    expiration = db.Column(db.DateTime, nullable=True)

with app.app_context():
    db.create_all()

def GET_SQL(query, *params):
    if "from users" in query:
        if "where username=?" in query:
            return User.query.filter_by(username=params[0]).all()
        if "where username=? or email=?" in query:
            return User.query.filter((User.username == params[0]) | (User.email == params[1])).all()
    elif "from paintings" in query:
        return Paintings.query.all()
    elif "from cart" in query:
        if "where name=?" in query and "username=?" in query:
            return Cart.query.filter_by(name=params[0], username=params[1]).all()
        elif "where username=?" in query:
            return Cart.query.filter_by(username=params[0]).all()
    return []

def EXEC_SQL(query, *params):
    if "insert into users" in query:
        user = User(email=params[0], username=params[1], password=params[2])
        db.session.add(user)
        db.session.commit()
    elif "update users set session" in query:
        session_id, username = params
        user = User.query.filter_by(username=username).first()
        if user:
            user.session = session_id
            user.expiration = datetime.utcnow() + timedelta(minutes=30)
            db.session.commit()
    elif "insert into cart" in query:
        cart_item = Cart(username=params[0], image_url=params[1], name=params[2], price=params[3], quantity=params[4])
        db.session.add(cart_item)
        db.session.commit()
    elif "update cart set quantity" in query:
        name, username = params
        item = Cart.query.filter_by(name=name, username=username).first()
        if item:
            item.quantity += 1
            db.session.commit()
    elif "update cart set price" in query:
        name, username = params
        item = Cart.query.filter_by(name=name, username=username).first()
        if item:
            item.price = item.price * item.quantity
            db.session.commit()

@app.route('/')
def index():
    return render_template('about.html')

@app.route('/paintings', methods=['GET'])
def view_paintings():
    paintings = Paintings.query.all()
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

@app.route('/product/<product_name>', methods=['GET'])
def product_details(product_name):
    product = Cart.query.filter_by(name=product_name).first()  # You can use product_id instead if you have a unique identifier.

    if not product:
        return render_template('error.html', message="Product not found")

    # Render the product detail page, passing the product data to the template
    return render_template('product_details.html', product=product)



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
        if len(USER) == 1 and check_password_hash(USER[0].password, password):
            session_id = str(uuid.uuid4())
            EXEC_SQL("update users set session=?, expiration=NOW() + INTERVAL 30 MINUTE where username=?", session_id, username)
            return jsonify({"status": 0, "session": session_id, "message": f"User '{username}' logged in"})
        else:
            return jsonify({"status": 1, "message": "User/Password Not Found"})
    except Exception as e:
        return jsonify({"status": 1, "message": str(e)})

@app.route('/logout', methods=['GET'])
def logout():
    username = request.args.get('username')
    session = request.args.get('session')
    # You might want to invalidate the session here
    return jsonify(status=0)

@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    owner_id = data.get('owner_id')
    owner_type = data.get('owner_type')
    image_url = data.get('image_url')
    name = data.get('name')
    price = data.get('price')
    quantity = data.get('quantity', 1)  # Default to 1 if quantity is not provided

    if not owner_id or not owner_type or not image_url or not name or price is None:
        return jsonify({'status': 1, 'error': 'Missing required fields'}), 400

    # Check if the item already exists in the cart for the given owner_id and owner_type
    existing_item = Cart.query.filter_by(owner_id=owner_id, owner_type=owner_type, name=name).first()

    if existing_item:
        # If item exists, increase the quantity
        existing_item.quantity += quantity
        db.session.commit()
        return jsonify({'status': 0, 'message': 'Item quantity updated in cart'})
    else:
        # If item doesn't exist, create a new cart item
        new_item = Cart(
            owner_id=owner_id,
            owner_type=owner_type,
            image_url=image_url,
            name=name,
            price=price,
            quantity=quantity
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({'status': 0, 'message': 'Item added to cart'})


@app.route('/cart/view')
def view_cart():
    # Get query params
    owner_id = request.args.get('owner_id')
    owner_type = request.args.get('owner_type')

    # Debugging log for received parameters
    print(f"Received owner_id: {owner_id}, owner_type: {owner_type}")

    # Check if required parameters are missing
    if not owner_id or not owner_type:
        return jsonify({'status': 1, 'error': 'Missing owner_id or owner_type'}), 400

    try:
        # Fetch cart items from the database
        cart_items = Cart.query.filter_by(owner_id=owner_id, owner_type=owner_type).all()

        # If no items found, return a response indicating the cart is empty
        if not cart_items:
            return jsonify({'status': 0, 'data': [], 'message': 'Cart is empty'})

        # Serialize the cart items for the response
        data = []
        for item in cart_items:
            data.append({
                'owner_id': item.owner_id,
                'owner_type': item.owner_type,
                'image_url': item.image_url,  # Ensure these fields are correct
                'name': item.name,
                'price': str(item.price),  # Convert price to string if needed
                'quantity': item.quantity
            })

        # Return the cart items in the response
        return jsonify({'status': 0, 'data': data})

    except Exception as e:
        # Handle unexpected errors and log them
        print(f"Error while fetching cart items: {str(e)}")
        return jsonify({'status': 1, 'error': 'Server error'}), 500

@app.route('/cart', methods=['GET'])
def show_cart_page():
    return render_template('cart.html')

if __name__ == '__main__':
    app.run(debug=True)
