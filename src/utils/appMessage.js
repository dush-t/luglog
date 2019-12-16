const toastMessage = (description) => {
    return {
        message: {
            status: 'ERROR',
            level: 'CRITICAL',
            displayType: 'TOAST',
            title: '',
            description: `${description}`
        }
    }
}

const alertMessage = (title, description, status='ERROR') => {
    return {
        message: {
            status: `${status}`,
            level: 'CRITICAL',
            displayType: 'ALERT',
            title: `${title}`,
            description: `${description}`
        }
    }
}

module.exports = {
    toastMessage,
    alertMessage
}