const Product = require("../models/product.model");
const User = require("../models/user.model");

class CartController {
    // GET CART BY USER ID
    async getCartByUserId(req, res) {
        try {
            const response = await User.findById(req.params.id).populate("carts");
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }
    
    // ADD CART'S ITEM
    async addCartItem(req, res) {
        try {
            const { productId, quantity } = req.body;

            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const product = await Product.findById(productId)
            if (!product) {
                return res.status(404).json({ message: 'Product not found' })
            }
            
            const existingItem = user.carts.find(item => item.productId.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            }
            else {
                user.carts.push({
                    productId: productId,
                    productName: product.name,
                    price: product.price,
                    quantity: quantity,
                    images: product.images,
                })
            }

            await user.save();

            return res.status(200).json({ message: 'Product added to cart', carts: user.carts });
        } catch (error) {
            return res.status(400).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }

    // REMOVE CART'S ITEM
    async removeCartItem(req, res) {
        try {
            const { productId } = req.body;

            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.carts = user.carts.filter(item => item.productId.toString() !== productId);

            await user.save();

            return res.status(200).json({ message: 'Product removed from cart', carts: user.carts });
        } catch (error) {
            return res.status(400).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }
}

module.exports = new CartController()