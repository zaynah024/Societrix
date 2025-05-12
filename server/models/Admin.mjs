import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: null,
    },
});

const Admin = mongoose.model('Admin', AdminSchema);

// Seed admin user if not exists
(async () => {
    const adminEmail = "admin@societrix.com";
    const adminPassword = "admin123"; // Default password
    const adminName = "Super Admin";

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await Admin.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
        });
        console.log("Admin user seeded successfully.");
    }
})();

export default Admin;