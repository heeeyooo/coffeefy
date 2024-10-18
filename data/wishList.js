export let wishList =
    JSON.parse(localStorage.getItem("wishList")) ||
    [
        // {
        //     id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        //     image: "images/products/Americano.png",
        //     name: "Americano",
        //     priceCents: 1090,
        // },
        // {
        //     id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        //     image: "images/products/Corretto.png",
        //     name: "Corretto",
        //     priceCents: 2095,
        // },
    ];

export function removeFromWish(productId) {
    let newWish = [];

    wishList.forEach((wish) => {
        if (wish.id !== productId) {
            newWish.push(wish);
        }
    });
    wishList = newWish;
    localStorage.setItem("wishList", JSON.stringify(wishList));
}
