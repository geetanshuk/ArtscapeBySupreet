$(document).ready(function () {
    loadNav();

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
});

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
                                <a href="#" class="nav-link">Paintings</a>
                                <a href="#" class="nav-link">Clothing</a>
                                <a href="#" class="nav-link">Jewelry</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link me-4" href="geetanshuAbout.html">Contact</a>
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
                        Cart
                    </button>
                </li>
            </ul>
        </div>
    </nav>
    `);
}

function getCandy() {
	$.ajax({
        url: 'final.php/viewCandy',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
        // Check the structure of the response received
		if (response.data && Array.isArray(response.data)) {
			var tableCandy = $('#table-candy');
			tableCandy.empty(); // Clear existing table rows

			response.data.forEach(function(candy) {
				var item = $('<td><div class="candy-item"></div></td>');
				// Append image
				var img = $('<img>').addClass('candy-image').attr('src', candy.image_url).attr('alt', candy.name);
				item.append(img);

				// Append name
				var name = $('<div class="candy-name"></div>').text(candy.name);
				item.append(name);

				// Append description
				var description = $('<div class="candy-description"></div>').text(candy.description);
				item.append(description);

				// Append price
				var price = $('<div class="candy-price"></div>').text('$' + candy.price);
				item.append(price);

				// Append action button (optional)
				var button = $('<button class="cartButton">Add to Cart</button>');
				

				// Define the click event handler for the button
				button.on('click', function() {
					alert('Button clicked for ' + candy.name);
					// You can add more actions here, such as opening a modal, redirecting, etc.
				});

				item.append(button);

				// Append the constructed item to the menu container
				tableCandy.append(item);
							
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
