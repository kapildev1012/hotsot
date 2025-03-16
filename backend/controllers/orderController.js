import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = "http://localhost:5173";

// Placing an Order (Stripe Payment)
const placeOrder = async(req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: "Delivery Charge" },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error processing order" });
    }
};

// Placing an Order (Cash on Delivery)
const placeOrderCod = async(req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// Fetch all orders for admin (Newest first)
const listOrders = async(req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Fetch user-specific orders (Newest first)
const userOrders = async(req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

// Update order status
const updateStatus = async(req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating order status" });
    }
};

// Verify order after payment
const verifyOrder = async(req, res) => {
    try {
        const { orderId, success } = req.body;

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment Verified" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error verifying order" });
    }
};

export { placeOrder, placeOrderCod, listOrders, userOrders, updateStatus, verifyOrder };