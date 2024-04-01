const users_query_set = {
    getUsers: "SELECT id, first_name, last_name, username, password, admin FROM users WHERE deleted = false ORDER BY id",
    getUserById: "SELECT id, first_name, last_name, username, password, admin  FROM users WHERE id = $1",
    createUser: "INSERT INTO users (first_name, last_name, username, password, admin) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    updateUser: "UPDATE users SET first_name = $1, last_name = $2, username = $3, admin = $4 WHERE id = $5 RETURNING *",
    updatePassword: "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
    deleteUser: "UPDATE users SET deleted = true WHERE id = $1 RETURNING *"
}

module.exports = {
    users_query_set
}
