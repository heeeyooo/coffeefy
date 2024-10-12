// Get cart from localStorage
export let cart = JSON.parse(localStorage.getItem("cart")) || [
    {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: "1",
    },
    {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 5,
        deliveryOptionId: "2",
    },
];

export function removeFromCart(productId) {
    let newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });
    cart = newCart;
    // Save cart after removing an item from cart
    localStorage.setItem("cart", JSON.stringify(cart));
}
