const login_query_set = {
    getUserByUsername: "SELECT * FROM users WHERE username = $1 and deleted = false;",
    createSession: "INSERT INTO sessions (user_id) VALUES ($1);",
    logoutOtherSessions: "UPDATE sessions SET logout_dt = NOW() WHERE logout_dt IS NULL"
}

module.exports = {
    login_query_set
}