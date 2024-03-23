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

        const verifyPassword = password == user[0].password// await bcrypt.compare(password, user[0].password)

        if (!verifyPassword) {
            return response.error = { statusCode: 400, message: "Wrong Password"}
        }

        await Pg.query(qs.logoutOtherSessions);
        const User = user[0]
        await Pg.query(qs.createSession, [User.id]);

        const userData = {
            name: `${User.first_name} ${User.last_name}`,
        }

        const token = jwt.sign(userData, process.env.JWT)

        response.result = {
            message: "Login Successful",
            admin: User.admin, 
            id: User.id,
            token
        };
    } catch (error) {
        response.error = { statusCode: 500, message: error.message};
    } finally {
        return response;
    }
}

const logout = async () => {
    let response = {
        result: null,
        error: null
    }
    try {
        await Pg.query(qs.logoutOtherSessions); 
        response.result = "Logout Successfully."
    } catch (error) {
        response.error = { statusCode: 500, message: error.message};
    } finally {
        return response;
    }
}

module.exports = {
    login,
    logout
}