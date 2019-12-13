const versionCheck = async (req, res, next) => {
    const appVersion = parseFloat(req.header('X-Version'))
    console.log(appVersion);
    if (parseFloat(appVersion) < parseFloat(process.env.MIN_ALLOWED_VERSION)) {
        console.log('Version check faced');
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
    console.log('Middleware passed');
    next();
}

module.exports = versionCheck;