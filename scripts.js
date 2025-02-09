$(document).ready(function () {
    loadNav();
    loadModals();
    getPaintings();
    getCart();

    // Event listener for toggling dropdown
    document.getElementById('productDropdown').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        const productList = document.getElementById('productList');
        
        // Toggle the visibility of the product list
        if (productList.style.display === "block") {
            productList.style.display = "none";
        } else {
            productList.style.display = "block";
        }
    });

    if (getCookie("sessionID") != null) {
        updateLoggedIn();
    }
});

function clearCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
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
                        <a class="nav-link active" aria-current="page" href="about.html">About</a>
                    </li>
                    <li class="nav-item">
                        <div class="dropdown">
                            <a class="nav-link me-4" href="#" id="productDropdown">Products <i class="fa fa-caret-down"></i></a>
                            <div class="dropdown-content" id="productList" style="display: none;">
                                <a href="paintings.html" class="nav-link">Paintings</a>
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
            <ul class="navbar-nav mb-2 mb-lg-0 justify-content-right" id="accountActionButtons">
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
        url: 'final.php/viewPaintings',
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

function toggleSignupPasswordVisibility() {
	var passwordInput = $('#signupPassword');
	if (passwordInput.attr('type') === 'password') {
		passwordInput.attr('type', 'text');
	  } else {
		passwordInput.attr('type', 'password');
	  }
}


function getSignUp() {
	a = $.ajax({
		url: 'final.php/signUp',
		type: "GET",
		contentType: 'application/json',
		data: {
			email: $('#signupEmail').val(),
			username: $('#signupUsername').val(),
			password: $('#signupPassword').val()
		}
    }).done(function (data) {
		if (data.status == 0) {
			loginFromSignup($('#signupUsername').val(), $('#signupPassword').val());
		} else {
			// Display signup error
			// log it
			alert('Username or email exists')
		}
	}).fail(function (error) {
		errorCounter++;
		$("#main").html(errorCounter);
		//console.log("error", error.statusText);
		$("#main").prepend("load Error " + new Date() + "<br>");
	});
}

function validateSignUp() {
	// Get the form and its input fields
	var form = $('#signUpForm');
	var usernameInput = $('#signupUsername').val();
	var passwordInput = $('#signupPassword').val();
	var emailInput = $('#signupEmail').val();
  
	let emailTest = /^[a-zA-Z ]{1,20}$/;
	if (!emailTest.test(emailInput)) {
			alert('Email must be up to 20 characters long and can only contain letters and spaces')
			return false;
	}

	let userTest = /^[a-zA-Z ]{1,20}$/;
	if (!userTest.test(usernameInput)) {
			alert('Username must contain only letters and numbers')
			return false;
	}

	let passwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@!?\.]{8,}$/;
	//^[a-zA-Z0-9@!?\.]{8,}$
	if (!passwordTest.test(passwordInput)) {
			alert('Password must be at least 8 characters long and can only contain letters (both lowercase and uppercase), numbers, @, !, ?, or .')
			return false;
	}
	getSignUp();
	$('#signUpModal').modal('hide');
}

function toggleSignupPasswordVisibility() {
	var passwordInput = $('#signupPassword');
	if (passwordInput.attr('type') === 'password') {
		passwordInput.attr('type', 'text');
	  } else {
		passwordInput.attr('type', 'password');
	  }
}

function toggleLoginPasswordVisibility() {
	var passwordInput = $('#loginPassword');
	if (passwordInput.attr('type') === 'password') {
		passwordInput.attr('type', 'text');
	  } else {
		passwordInput.attr('type', 'password');
	  }
}

function validateLogin() {
	// Get the form and its input fields
	var form = $('#loginForm');
	var usernameInput = $('#loginUsername').val();
	var passwordInput = $('#loginPassword').val();
  
	let userTest = /^[a-zA-Z ]{1,20}$/;
	if (!userTest.test(usernameInput)) {
			alert('Username must contain only letters and numbers')
			return false;
	}

	let passwordTest = /^[a-zA-Z ]{1,20}$/;
	if (!passwordTest.test(passwordInput)) {
			alert('Password must be at least 8 characters long and can only contain letters (both lowercase and uppercase), numbers, @, !, ?, or .')
			return false;
	}
	getLogin();
	$('#loginModal').modal('hide');
}

function loginFromSignup(user, pass) {
	a = $.ajax({
		url: 'final.php/login',
		type: "GET",
		contentType: 'application/json',
		data: {
			username: user,
			password: pass
		}
	}).done(function (data) {
		if (data.status == 0) {
			console.log("Login worked");
			setCookie("username", $('#signupUsername').val(), 1);
			setCookie("sessionID", data.session, 1);
			updateLoggedIn();
		} else {
			//console.log("User/Password not found");
		}
	}).fail(function (error) {
		errorCounter++;
		$("#main").html(errorCounter);
		//console.log("error", error.statusText);
		$("#main").prepend("load Error " + new Date() + "<br>");
	});
}

function getLogin() {
	a = $.ajax({
		url: 'final.php/login',
		type: "GET",
		contentType: 'application/json',
		data: {
			username: $('#loginUsername').val(),
			password: $('#loginPassword').val()
		}
	}).done(function (data) {
		if (data.status == 0) {
			//console.log("Login worked");
			setCookie("username", $('#loginUsername').val(), 1);
			setCookie("sessionID", data.session, 1);
			updateLoggedIn();
		} else {
			//console.log("It didnt work");
			//console.log(data);
		}
	}).fail(function (error) {
		//console.log(error.message);
	});
}

function updateLoggedIn() {
	$("#accountActionButtons").html(`
		<li class="nav-item">
		<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#logoutModal">
		  Logout
		</button>
	  </li>
	`);
	$("#logTitleSpan").text(getCookie("username"));
}

function getLogout() {
	if (getCookie("sessionID") != null) {
		var session = getCookie("sessionID");
		var user = getCookie("username");
		a = $.ajax({
			url: 'final.php/logout',
			type: "GET",
			contentType: 'application/json',
			data: {
				username: user,
				session: session
			}
		}).done(function (data) {
			if (data.status == 0) {
				clearCookie("sessionID");
				clearCookie("username");
				updateLoggedOut();
			} else {
				//console.log("Logout error");
				//console.log(data);
			}
		}).fail(function (error) {
			errorCounter++;
			$("#main").html(errorCounter);
			//console.log("error", error.statusText);
			$("#main").prepend("load Error " + new Date() + "<br>");
		});
	} else {
		a = $.ajax({
			url: 'final.php/logout',
			type: "GET",
			contentType: 'application/json',
			data: {
				username: $('#logoutUsername').val(),
				session: $('#logoutSession').val()
			}
		}).done(function (data) {
			if (data.status == 0) {
				clearCookie("sessionID");
				clearCookie("username");
				updateLoggedOut();
			} else {
				// Display signup error
				// log it
			}
		}).fail(function (error) {
			errorCounter++;
			$("#main").html(errorCounter);
			//console.log("error", error.statusText);
			$("#main").prepend("load Error " + new Date() + "<br>");
		});
	}
}

function updateLoggedOut() {
	$("#accountActionButtons").html(`
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
	`);
	$("#logTitleSpan").text("Please login to use this feature");
}

function addToCart(painting) {
    const username = getCookie('username');
    const sessionID = getCookie('sessionID');
    console.log(painting);
	$.ajax({
		url: 'final.php/cart',
		method: 'POST',
		dataType: 'json',
		data: {
			image: painting.image_url,
			name: painting.name,
			price: painting.price,
		}
		}).done(function (data) {
			if (data.status === 0 || data.status === 1) {
				console.log('Item added successfully');
				alert('Item added to cart');
			} else {
				console.error('Failed to add item to cart');
			}
		}).fail(function (error) {
			console.log("error", error.statusText);
		});
}

function getCart() {
    var username = getCookie('username');
    if (!username) {
        console.error('Username is undefined or empty');
        return;
    }
	$.ajax({
        url: 'final.php/viewCart',
        method: 'GET',
        dataType: 'json',
        data: {
            username: username
        }
	}).done(function (response) {
        // Check the structure of the response received
		if (response.status == 0 && response.data && Array.isArray(response.data)) {
			var tableBody = $('#table-cart');
			tableBody.empty(); // Clear existing table rows
			var subTotal = 0;
		
			response.data.forEach(function(cart) {
				// Create a table row
				var row = $('<div class = row g-0></div>');
		
				// Column for image
				var colImage = $('<div class = col-sm-2></div>');
				var img = $('<img>')
					.addClass('sc-product-image img-fluid')
					.attr('src', cart.image)
					.attr('alt', cart.name)
					.attr('width', '250')
					.attr('height', '250')
				colImage.append(img).append('<br><br>');
		
				// Column for item name and description in a single column
				var colDescription = $('<div class="col-sm-3"></div>');
				var itemName = $('<div></div>').text(cart.name).css('font-weight', 'bold');
				var colQuantity = $('<div></div>').text('quantity: ' + cart.quantity);
				colDescription.append(itemName).append(colQuantity);

		
				// Column for item price
				var colPrice = $('<div class="col-sm-1"></div>').text('$' + cart.price);
				subTotal += parseFloat(cart.price);

				// Append columns to the row
				row.append(colImage);
				row.append(colDescription);
				row.append(colPrice);

				// Append the row to the table body
				tableBody.append(row);
				tableBody.append('______________________________________________________________________________________________');
				tableBody.append('<br><br>')
			});
			tableBody.append('<br>');
			$('#cart-subtotal').text(subTotal.toFixed(2));
		} else {
			console.log("logging response: " + response.data);
			console.error('Invalid data format received:', response);
		}
	}).fail( function(error) {
			console.error('Error fetching data:', error);
	});
}



