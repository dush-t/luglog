const adminAccess = async (req, res, next) => {
    try {
        if (req.user._id.equals(process.env.adminID)) {
            next();
        }
    } catch (e) {
        res.status(403).send({ error: "Only the admin is allowed to access this route."})
    }
}

module.exports = adminAccess;