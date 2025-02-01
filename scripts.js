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
                                <a href="paintings.html" class="nav-link">Paintings</a>
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
                var addToCart = $('<button id="cart"onclick="addToCart();">Add to Cart</button>');

                frame.append(img)
                    .append(name)
                    .append(price)
                    .append(addToCart);
            
                // Append the frame, name, description, and price to the column
                col.append(frame)
                   .append(name)
                   //.append(description)
                   .append(price)
                   .append(addToCart);
            
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
