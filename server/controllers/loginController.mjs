import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.mjs';
import Society from '../models/Society.mjs';

const JWT_SECRET = "your_jwt_secret_key"; // Replace with a secure key

export const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let user;
        if (role === "Admin") {
            user = await Admin.findOne({ email });
        } else if (role === "Society") {
            user = await Society.findOne({ email });
        } else {
            return res.status(400).json({ message: "Invalid role specified." });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { id: user._id, role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
};