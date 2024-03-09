const login_query_set = {
    getUserByUsername: "SELECT * FROM users WHERE username = $1"
}

module.exports = {
    login_query_set
}