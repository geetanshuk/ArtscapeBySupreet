let errorCounter = 0;

$(document).ready(function () {
    loadNav();
    loadModals();
    getPaintings();
    getCart();

	const sessionID = getCookie("sessionID");

    if (sessionID === null) {
        // Generate a new session ID if not found in cookies
        const newSessionID = generateSessionID(); // Generate a new session ID
        setCookie("sessionID", newSessionID, 1);  // Set the session cookie with a 1-day expiry
        console.log("New session ID generated:", newSessionID);
    } else {
        console.log("Session ID from cookie:", sessionID);
    }
	
	console.log("sessionId: ", getCookie("sessionID"));

    // Event listener for toggling dropdown
    document.getElementById('productDropdown').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        const productList = document.getElementById('productList');
        productList.style.display = (productList.style.display === "block") ? "none" : "block";
    });

    if (getCookie("sessionID") != null) {
        updateLoggedIn();
    }
});


function clearCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

function loadNav() {
    $("#navBar").prepend(`
    <nav class="navbar navbar-expand-lg custom-navbar sticky-navbar">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                <ul class="navbar-nav">
                    <li class="nav-item me-4">
                        <a class="nav-link active" aria-current="page" href="/">About</a>
                    </li>
                    <li class="nav-item">
                        <div class="dropdown">
                            <a class="nav-link me-4" href="#" id="productDropdown">Products <i class="fa fa-caret-down"></i></a>
                            <div class="dropdown-content" id="productList" style="display: none;">
                                <a href="/paintings" class="nav-link">Paintings</a>
                                <a href="#" class="nav-link">Clothing</a>
                                <a href="#" class="nav-link">Jewelry</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link me-4" href="contact.html">Contact</a>
                    </li>
                </ul>
            </div>
            <ul class="navbar-nav mb-2 mb-lg-0 justify-content-end" id="accountActionButtons">
                <li class="nav-item">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signUpModal">
                        Sign Up
                    </button>
                </li>
                <li class="nav-item">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                        Login
                    </button>
                </li>
                <li class="nav-item">
                    <a class="nav-link me-4" href="cart.html">Cart</a>
                </li>
            </ul>
        </div>
    </nav>
    `);
}

function loadModals() {
	$("#modals").prepend(`
	<div class="container-fluid">
		<div class="row">
			<!-- Sign Up Modal -->
			<div class="modal fade" id="signUpModal" tabindex="-1" aria-labelledby="signUpModal" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="signUpModalLabel">Sign Up</h1>
						</div>
						<div class="modal-body">
							<form id="signUpForm" method="GET" novalidate>
								<label for="signupEmail">Email:</label>
								<input type="text" id="signupEmail" name="signupEmail" class="text" pattern="^[a-zA-Z ]{1,20}$" required>
								<br>
								<br>
								<label for="signupUsername">Username:</label>
								<input type="text" id="signupUsername" name="signupUsername" class="text" pattern="^[a-zA-Z0-9_-]{3,16}$" required>
								<br>
								<br>
								<label for="signupPassword">Password:</label>
								<input type="password" id="signupPassword" name="signupPassword" class="text" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@!?\.]{8,}$" required>
								<button type="button" onclick="toggleSignupPasswordVisibility()">Show/Hide</button>
							</form>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<input type="button" class="btn btn-primary" id="signupSubmit" onclick="validateSignUp()" value="Sign Up">
              
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<!-- Login Modal -->
			<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModal" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="loginModalLabel">Login</h1>
						</div>
						<div class="modal-body">
							<form id="loginForm" method="GET">
								<label for="loginUsername">Username:</label>
								<input type="text" id="loginUsername" name="loginUsername" class="text" pattern="^[a-zA-Z0-9_-]{3,16}$" required>
								<br>
								<br>
								<label for="loginPassword">Password:</label>
								<input type="password" id="loginPassword" name="loginPassword" class="text" pattern="^(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$" required>
								<button type="button" onclick="toggleLoginPasswordVisibility()">Show/Hide</button>
							</form>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<input type="button" class="btn btn-primary" id="loginSubmit" onclick="validateLogin()" value="Login">
						</div>
					</div>
				</div>
			</div>
		</div>
        <div class="row">
			<!-- Error Modal -->
			<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModal" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="errorModalLabel">Too Many API Calls</h1>
						</div>
						<div class="modal-body">
							<p>Please wait 5 seconds before calling searching another stock or exchange.</p>
							<br>
							<p>We appolgize for this wait, it is not our fault</p>
						</div>
						<div class="modal-footer">
						</div>
					</div>
				</div>
			</div>
		</div>
        <div class="row">
            <!-- Logout Modal -->
            <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModal" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="logoutModalLabel">Do You Want To Logout?</h1>
                        </div>
                        <div class="modal-body">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <input type="button" class="btn btn-primary" id="logoutSubmit" onclick="getLogout()" data-bs-toggle="modal" data-bs-target="#logoutModal" value="Logout">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
	`);
}

function getPaintings() {
	$.ajax({
        url: '/api/paintings',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
        // Check the structure of the response received
		if (response.data && Array.isArray(response.data)) {
			var tablePainting = $('#table-paintings');
			tablePainting.empty(); // Clear existing table rows

			// Create a row for the paintings
			var row = $('<div class="row"></div>'); // Start a new row

			// Loop through the paintings
			response.data.forEach(function(painting, index) {
                // Create a column for each painting
                var col = $('<div class="col-sm-4 mb-3"></div>'); // Bootstrap column for each painting
            
                // Create a frame container for the image
                var frame = $('<div class="painting-frame" style="width: 100%; height: 250px; border: 1px solid #ccc; display: flex; justify-content: center; align-items: center; overflow: hidden;"></div>');
            
                // Create image element
                var img = $('<img>')
                    .attr('id', 'painting-image')
                    .attr('src', painting.image_url)  // Set the source of the image dynamically
                    .attr('alt', painting.name)       // Set the alt attribute
                    .css({
                        'max-width': '100%',  // Ensures image fits within the width of the frame
                        'max-height': '100%', // Ensures image fits within the height of the frame
                        'object-fit': 'contain' // This ensures the image will be centered without distortion
                        
                    });
            
                // Append the image to the frame
                
            
                // Create name and description for the painting
                var name = $('<div class="painting-name font-weight-bold mt-2"></div>').text(painting.name);
                var description = $('<div class="painting-description"></div>').text(painting.description);
            
                // Create price element
                var price = $('<div class="painting-price text-muted mt-2"></div>').text('$' + painting.price);
                var addToCartButton = $('<button id="cart">Add to Cart</button>');
                
                addToCartButton.on('click', function() {
					addToCart(painting);
					// You can add more actions here, such as opening a modal, redirecting, etc.
				});

                frame.append(img)
                    .append(name)
                    .append(price)
                    .append(addToCartButton);
                    
            
                // Append the frame, name, description, and price to the column
                col.append(frame)
                   .append(name)
                   //.append(description)
                   .append(price)
                   .append(addToCartButton);
            
                // Append the column to the row
                
                row.append(col);
                
            
                // Every 4th painting (index + 1 % 4 == 0) should create a new row
                if ((index + 1) % 3 === 0 || index === response.data.length - 1) {
                    // Add the row to the table
                    tablePainting.append(row);
                    
                    // Reset the row for the next set of paintings
                    row = $('<div class="row"></div>');
                }
            });
            
		} else {
			console.error('Invalid data format received:', response);
		}
	},
	error: function(xhr, status, error) {
		console.error('Error fetching data:', error);
	}
	});
}

// Toggle password visibility for signup form
function toggleSignupPasswordVisibility() {
    const passwordInput = $('#signupPassword');
    passwordInput.attr('type', passwordInput.attr('type') === 'password' ? 'text' : 'password');
}

// Toggle password visibility for login form
function toggleLoginPasswordVisibility() {
    const passwordInput = $('#loginPassword');
    passwordInput.attr('type', passwordInput.attr('type') === 'password' ? 'text' : 'password');
}

function validateSignUp() {
    const usernameInput = $('#signupUsername').val();
    const passwordInput = $('#signupPassword').val();
    const emailInput = $('#signupEmail').val();

    // Email regex (simple standard email format)
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTest.test(emailInput)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Username: letters and numbers, 1-20 chars
    const userTest = /^[a-zA-Z0-9]{1,20}$/;
    if (!userTest.test(usernameInput)) {
        alert('Username must contain only letters and numbers and be up to 20 characters.');
        return false;
    }

    // Password: min 8 chars, at least one uppercase, one lowercase, one digit; allows @!?.
    const passwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@!?\.]{8,}$/;
    if (!passwordTest.test(passwordInput)) {
        alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number. Allowed special characters are @, !, ?, and .');
        return false;
    }

    getSignUp();
    $('#signUpModal').modal('hide');
}

function getSignUp() {
    const email = $('#signupEmail').val();
    const username = $('#signupUsername').val();
    const password = $('#signupPassword').val();

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 0) {
            loginFromSignup(username, password);
        } else {
            alert('Username or email already exists.');
        }
    })
    .catch(error => {
        errorCounter++;
        const mainDiv = document.getElementById('main');
        mainDiv.innerHTML = errorCounter;
        mainDiv.insertAdjacentHTML('afterbegin', "Load Error " + new Date() + "<br>");
        console.error('Signup error:', error);
    });
}

function validateLogin() {
    const usernameInput = $('#loginUsername').val();
    const passwordInput = $('#loginPassword').val();

    const userTest = /^[a-zA-Z0-9]{1,20}$/;
    if (!userTest.test(usernameInput)) {
        alert('Username must contain only letters and numbers and be up to 20 characters.');
        return false;
    }

    // Password validation same as signup (assuming same rules)
    const passwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@!?\.]{8,}$/;
    if (!passwordTest.test(passwordInput)) {
        alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number. Allowed special characters are @, !, ?, and .');
        return false;
    }

    getLogin();
    $('#loginModal').modal('hide');
}

function loginFromSignup(user, pass) {
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 0) {
            console.log("Login succeeded.");
            setCookie("username", user, 1);
            setCookie("sessionID", data.session, 1);
            updateLoggedIn();
        } else {
            console.warn("User/Password not found.");
        }
    })
    .catch(error => {
        errorCounter++;
        const mainDiv = document.getElementById("main");
        mainDiv.innerHTML = errorCounter;
        mainDiv.insertAdjacentHTML('afterbegin', "Load Error " + new Date() + "<br>");
        console.error("Login error:", error);
    });
}

function getLogin() {
    const username = $('#loginUsername').val();
    const password = $('#loginPassword').val();

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 0) {
            setCookie("username", username, 1);
            setCookie("sessionID", data.session, 1);
            updateLoggedIn();
        } else {
            console.error("Login failed:", data);
            alert('Login failed. Please check your username and password.');
        }
    })
    .catch(error => {
        console.error("Login error:", error);
    });
}

function updateLoggedIn() {
    $("#accountActionButtons").html(`
        <li class="nav-item">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#logoutModal">
                Logout
            </button>
        </li>
        <li class="nav-item">
            <a class="nav-link me-4" href="/cart">Cart</a>
        </li>
    `);
    $("#logTitleSpan").text(getCookie("username"));
}

function getLogout() {
    const session = getCookie("sessionID");
    const user = getCookie("username");

    // Prepare data to send based on whether cookies exist or fallback to input fields
    const usernameToSend = session != null ? user : $('#logoutUsername').val();
    const sessionToSend = session != null ? session : $('#logoutSession').val();

    // Build URL with query parameters for GET request
    const url = new URL('/logout', window.location.origin);
    url.searchParams.append('username', usernameToSend);
    url.searchParams.append('session', sessionToSend);

    fetch(url.toString(), {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 0) {
            clearCookie("sessionID");
            clearCookie("username");
            updateLoggedOut();
        } else {
            console.warn("Logout error:", data);
        }
    })
    .catch(error => {
        errorCounter++;
        const mainDiv = document.getElementById("main");
        mainDiv.innerHTML = errorCounter;
        mainDiv.insertAdjacentHTML('afterbegin', "Load Error " + new Date() + "<br>");
        console.error("Logout error:", error);
    });
}

function updateLoggedOut() {
    $('#accountActionButtons').html(`
        <li class="nav-item me-2">
            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#signUpModal">
                Sign Up
            </button>
        </li>
        <li class="nav-item">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                Login
            </button>
        </li>
    `);

    $('#logTitleSpan').text("Please log in to use this feature.");
}

function addToCart(painting) {
    const username = getCookie('username');
    const sessionID = getCookie('sessionID');

    fetch('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            owner_id: username || sessionID,
            owner_type: username ? 'username' : 'session',
            image_url: painting.image_url,  // consistent key name
            name: painting.name,
            price: painting.price
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 0 || data.status === 1) {
            console.log('Item added successfully');
            alert('Item added to cart');
        } else {
            console.error('Failed to add item to cart');
        }
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
    });
}

function getCart() {
    const username = getCookie('username');
    const sessionID = getCookie('sessionID');

    let owner_id, owner_type;

    if (username) {
        owner_id = username;
        owner_type = 'username';
    } else if (sessionID) {
        owner_id = sessionID;
        owner_type = 'session';
    } else {
        console.error('No user or session ID found');
        return;
    }

    fetch(`/cart/view?owner_id=${encodeURIComponent(owner_id)}&owner_type=${encodeURIComponent(owner_type)}`)
    .then(response => response.json())
    .then(response => {
        if (response.status === 0 && Array.isArray(response.data)) {
            const tableBody = document.getElementById('table-cart');
            tableBody.innerHTML = '';  // Clear existing rows
            let subTotal = 0;

            response.data.forEach(cart => {
                const row = document.createElement('div');
                row.className = 'row g-0 mb-3 align-items-center';

                // Image column
                const colImage = document.createElement('div');
                colImage.className = 'col-sm-2';
                const img = document.createElement('img');
                img.src = cart.image_url;
                img.alt = cart.name;
                img.width = 150;
                img.height = 150;
                img.className = 'img-fluid rounded';
                colImage.appendChild(img);

                // Name & Quantity
                const colDescription = document.createElement('div');
                colDescription.className = 'col-sm-6 ps-3';
                const itemName = document.createElement('h6');
                itemName.textContent = cart.name;
                const quantity = document.createElement('p');
                quantity.textContent = `Quantity: ${cart.quantity}`;
                colDescription.appendChild(itemName);
                colDescription.appendChild(quantity);

                // Price
                const colPrice = document.createElement('div');
                colPrice.className = 'col-sm-2';
                const totalItemPrice = parseFloat(cart.price) * cart.quantity;
                colPrice.textContent = `$${totalItemPrice.toFixed(2)}`;

                row.appendChild(colImage);
                row.appendChild(colDescription);
                row.appendChild(colPrice);
                tableBody.appendChild(row);

                subTotal += totalItemPrice;

                const divider = document.createElement('hr');
                tableBody.appendChild(divider);
            });

            document.getElementById('cart-subtotal').textContent = subTotal.toFixed(2);
        } else {
            console.error('Invalid data format received:', response);
        }
    })
    .catch(error => {
        console.error('Error fetching cart:', error);
    });
}
