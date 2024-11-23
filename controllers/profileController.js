const Admin = require("../models/adminModel");

const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id); // Ambil admin berdasarkan ID dari token
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { username, phone, address } = req.body;

  try {
    // Ambil data admin berdasarkan ID yang sudah didekodekan dari token
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Pastikan email tidak diubah
    const updatedData = {
      username: username || admin.username, // Jika tidak ada perubahan, tetap gunakan nilai lama
      phone: phone || admin.phone,
      address: address || admin.address,
      email: admin.email, // Pastikan email tetap yang lama
    };

    // Update data admin
    const updatedAdmin = await Admin.updateById(req.admin.id, updatedData);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
