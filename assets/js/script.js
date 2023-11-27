getData("https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product");
async function getData(url) {
    let x = await fetch(url);
    let y = await x.json();
    $("#product-page").attr(
        {"data-product-id":y.id,"data-product-name": y.title,"data-product-price": y.price,"data-product-image-src": y.imageURL}
    );
    $("#product-page .product-image--wrapper").append(`<img src="${y.imageURL}" alt="${y.title}" />`);
    $("#product-page .product-title").append(`<span>${y.title}</span>`);
    $("#product-page .product-price").append(`$<span>${y.price.toFixed(2)}</span>`);
    $("#product-page .product-desc").append(`<p>${y.description}</p>`);
    let btnsHTML = '';
    for(var i in y.sizeOptions) {
        btnsHTML += `<button data-value="${y.sizeOptions[i].label.toLowerCase()}">${y.sizeOptions[i].label}</button>`;
    }
    $("#product-page .product-size  .size-btn").append(btnsHTML);
}
$(document).on("click", "#cart-prev--btn", function() {
    if(!$(this).hasClass('active')) {
        $(this).addClass('active');
    } else {
        $(this).removeClass('active');
    }
});
$(document).on("click", ".size-btn button", function() {
    if(!$(this).hasClass('selected')) {
        $('.size-btn button').removeClass();
        $(this).addClass('selected');
    }
});
$(document).ready(function() {
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    $('#addToCart').on("click", function() {
        let product = $(this).closest("#product-page");
        let productId = product.data('product-id');
        let productName = product.data('product-name');
        let productImgSrc = product.data('product-image-src');
        let producPrice = product.data('product-price');
        let selectedSize = product.find('.size-btn button.selected').data('value');
        if(typeof selectedSize == 'undefined') {
            alert("Select a size first!");
            return;
        } 
        // console.log(selectedSize);

        // Check if the item is already in the cart
        var existingItem = cartItems.find(function(item) {
            return item.productId === productId && item.size === selectedSize;
        });

        if (existingItem) {
            // If the item exists, increment the quantity
            existingItem.quantity++;
        } else {
            // Otherwise, create a new cart item
            var cartItem = {
                productId: productId,
                productName: productName,
                imgURL: productImgSrc,
                size: selectedSize,
                price: producPrice,
                quantity: 1
            };
            // Add the cart item to the array
            cartItems.push(cartItem);
        }

        // Save cart items to local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update the cart display
        displayCartItems();
        
        // Update the cart count
        displayCartCount();

        //Trigger cart prev
        setTimeout(function(){
            $('#cart-prev--btn').trigger("click");
        },500)
    });

    function displayCartItems() {
        // Clear the existing cart items
        $("#cart-items").empty();

        // Add each cart item to the cart display
        for (var i = 0; i < cartItems.length; i++) {
            var cartItem = cartItems[i];
            var cartItemImgSrc = cartItem.imgURL;
            var cartItemName = cartItem.productName;
            var cartItemPrice = cartItem.price;
            var cartItemQty = cartItem.quantity;
            var cartItemSize = cartItem.size;
            var cartItemElement = `<li>
                <div class="cart-prev--item">
                    <div class="">
                        <div class="cart-prev-img">
                            <img src="${cartItemImgSrc}" alt="${cartItemName}" />
                        </div>
                    </div>
                    <div class="cart-prev-info">
                        <p>${cartItemName}</p>
                        <p>
                            ${cartItemQty}x <b>$${cartItemPrice.toFixed(2)}</b>
                        </p>
                        <p>Size: ${cartItemSize.toUpperCase()}</p>
                    </div>
                </div>
            </li>`;
            $("#cart-items").append(cartItemElement);
        }
    }

    function displayCartCount() {
        // Calculate the total quantity of items in the cart
        var totalCount = 0;
        for (var i = 0; i < cartItems.length; i++) {
            totalCount += cartItems[i].quantity;
        }
        // Update the cart count display
        $("#cart-count").text(totalCount);
        $(".prev-cart--wrapper").attr("data-count", totalCount);
        if(totalCount > 0) {
            $(".prev-cart--wrapper .empty").hide();
        }
    }

    // Initial display of cart items and count
    displayCartItems();
    displayCartCount();
});