const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            email: adminEmail
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            return;
        }

        // Hash admin password
        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD || "Admin@123",
            10
        );

        // Create admin
        const admin = await User.create({
            name: process.env.ADMIN_NAME || "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "Admin"
        });

        console.log(`Admin created successfully: ${admin.email}`);

    } catch (error) {
        console.error("Admin seeder error:", error.message);
    }
};

module.exports = seedAdmin;
