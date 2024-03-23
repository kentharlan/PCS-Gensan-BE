const bcrypt = require('bcryptjs')

const { Pg } = require('../Pg/Pg')
const { users_query_set: qs } = require('../Query/users-query-set')

const getUsers = async () => {
    let response = {
        result: null,
        error: null
    }
    try {
        const users = await Pg.query(qs.getUsers, []);
        response.result = users;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const getUserById = async ({id}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const users = await Pg.query(qs.getUserById, [id]);
        response.result = users;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const createUser = async ({data}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const {
            first_name,
            last_name,
            username,
            password,
            admin
        } = data

        const hashedPass = await bcrypt.hash(password, 10)

        const users = await Pg.query(qs.createUser, [
            first_name,
            last_name,
            username,
            password,
            admin
        ]);

        response.result = {
            message: "Successfully Created New User!",
            data: {
                username: users.username,
                admin: users.admin
            }
        };
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const updateUser = async ({data, id}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const {
            first_name,
            last_name,
            username,
            admin
        } = data

        const users = await Pg.query(qs.updateUser, [
            first_name,
            last_name,
            username,
            admin,
            id
        ]);

        response.result = users[0];
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const updatePassword = async ({data, id}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const { password } = data

        const hashedPass =  await bcrypt.hash(password, 10)

        await Pg.query(qs.updatePassword, [
            password,
            id
        ]);

        response.result = { message: "Password successfully changed." };
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const deleteUser = async ({id}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const users = await Pg.query(qs.deleteUser, [
            id
        ]);
        response.result = users;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updatePassword,
    deleteUser
}