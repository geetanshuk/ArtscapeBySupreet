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
        productDropdown.addEventListener('mouseenter', function() {
            productList.style.display = "block"; // Show the dropdown
        });
    
        productDropdown.addEventListener('mouseleave', function() {
            productList.style.display = "none"; // Hide the dropdown
        });
    
        productList.addEventListener('mouseenter', function() {
            productList.style.display = "block"; // Keep it open if hovering over the list
        });
    
        productList.addEventListener('mouseleave', function() {
            productList.style.display = "none"; // Hide it when mouse leaves the dropdown
        });
    });
});

function loadNav() {
    $("#navBar").prepend(`
    <nav class="navbar navbar-expand-lg custom-navbar">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                <ul class="navbar-nav">
                    <li class="nav-item me-4">
                        <a class="nav-link active" aria-current="page" href="landingPage.html">About</a>
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
                        Login
                    </button>
                </li>
            </ul>
        </div>
    </nav>
    `);
}
