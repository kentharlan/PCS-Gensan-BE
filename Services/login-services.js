const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { Pg } = require('../Pg/Pg')
const { login_query_set: qs } = require('../Query/login-query-set')

const login = async ({ data }) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const {
            username,
            password
        } = data

        const user = await Pg.query(qs.getUserByUsername, [username]);
        
        if (user.length < 1) {
            return response.error = { statusCode: 404, message: "No user found"}
        }

        const verifyPassword = await bcrypt.compare(password, user[0].password)

        if (!verifyPassword) {
            return response.error = { statusCode: 400, message: "Wrong Password"}
        }

        const User = user[0]

        const userData = {
            name: `${User.first_name} ${User.last_name}`,
        }

        const token = await jwt.sign(userData, process.env.JWT)

        response.result = {
            message: "Login Successful",
            admin: User.admin, 
            id: User.id,
            token
        };
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

module.exports = {
    login
}