const getValueOrFallback = (value, fallbackValue) => {
    if (typeof(value) === 'boolean') {
        return value
    }

    if (!value) {
        return fallbackValue
    }

    return value
}

module.exports = {
    getValueOrFallback
}