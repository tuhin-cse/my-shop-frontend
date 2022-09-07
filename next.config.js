module.exports = {
    reactStrictMode: false,
    trailingSlash: true,
    env: {
        imgbb_key: '3d201a8dd25f06e68b02208520e0e22f',
        backend_url: process.env.NODE_ENV === 'development' ?
            'http://localhost:4500/' :
            'http://localhost:4500/'
    }
}