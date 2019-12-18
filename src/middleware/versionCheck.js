const versionCheck = async (req, res, next) => {
    const appVersion = parseFloat(req.header('X-Version'))
    if (parseFloat(appVersion) < parseFloat(process.env.MIN_ALLOWED_VERSION)) {
        return res.status(403).send({
            message: {
                status: 'ERROR',
                level: 'CRITICAL',
                displayType: 'ALERT',
                title: 'Update app',
                description: 'Your app is out of date. Please update it to continue.'
            }
        })
    }
    next();
}

module.exports = versionCheck;