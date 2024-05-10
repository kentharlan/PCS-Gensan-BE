const { Pg } = require('../Pg/Pg')
const { rates_query_set: qs } = require('../Query/rates-query-set')

const getRates = async () => {
    let response = {
        result: null,
        error: null
    }
    try {
        const rates = await Pg.query(qs.getRates, []);
        
        for (const rate of rates) {
            rate.garage = JSON.parse(rate.garage);
            rate.no_garage = JSON.parse(rate.no_garage);
        }

        response.result = rates;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const getRateById = async ({id}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const rate = await Pg.query(qs.getRateById, [id]);
        const res = rate[0]

        res.garage = JSON.parse(res.garage);
        res.no_garage = JSON.parse(res.no_garage);

        response.result = res;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const createRate = async ({data}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const {
            name,
            garage,
            no_garage,
            extra_towel,
            extra_pillow,
            extra_blanket,
            extra_single_bed,
            extra_double_bed,
            extra_person
        } = data

        const rate = await Pg.query(qs.createRate, [
            name,
            garage,
            no_garage,
            extra_towel,
            extra_pillow,
            extra_blanket,
            extra_single_bed,
            extra_double_bed,
            extra_person
        ]);

        const res = rate[0];
        response.result = res;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const updateRate = async ({data, id}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const {
            name,
            garage,
            no_garage,
            extra_towel,
            extra_pillow,
            extra_blanket,
            extra_single_bed,
            extra_double_bed,
            extra_person
        } = data

        const rate = await Pg.query(qs.updateRate, [
            name,
            garage,
            no_garage,
            extra_towel,
            extra_pillow,
            extra_blanket,
            extra_single_bed,
            extra_double_bed,
            extra_person,
            id
        ]);

        const res = rate[0];
        response.result = res;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const deleteRate = async ({id}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const rate = await Pg.query(qs.deleteRate, [
            id
        ]);

        res = rate[0]
        response.result = res;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}


module.exports = {
    getRates,
    getRateById,
    createRate,
    updateRate,
    deleteRate
}