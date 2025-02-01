$(document).ready(function () {
    loadNav();
    getPaintings();

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

    $("#table-paintings").on('click', function() {
        getPaintings();  // Calls the function when the button is clicked
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

			response.data.forEach(function(painting) {
				var item = $('<td><div class="painting-item"></div></td>');
				// Append image
				var img = document.createElement('img');
                img.setAttribute('id', 'painting-image');
                img.setAttribute('src', painting.image_url);  // Set the source of the image dynamically
                img.setAttribute('alt', painting.name);       // Set the alt attribute

                img.style.width = '250px';  // Resize the image to 200px width
                img.style.height = 'auto';

                // Append the image to the painting item container
                $(item).find('.painting-item').append(img);

                // Add an event listener for the image (just a basic example)
                img.addEventListener('click', function() {
                    alert('Image clicked: ' + painting.name);
                });


				// Append name
				var name = $('<div class="painting-name"></div>').text(painting.name);
				item.append(name);

				// Append description
				var description = $('<div class="painting-description"></div>').text(painting.description);
				item.append(description);

				// Append price
				var price = $('<div class="painting-price"></div>').text('$' + painting.price);
				item.append(price);

				// Append action button (optional)
				var button = $('<button class="cartButton">Add to Cart</button>');
				

				// Define the click event handler for the button
				button.on('click', function() {
					alert('Button clicked for ' + painting.name);
					// You can add more actions here, such as opening a modal, redirecting, etc.
				});

				item.append(button);

				// Append the constructed item to the menu container
				tablePainting.append(item);
							
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
