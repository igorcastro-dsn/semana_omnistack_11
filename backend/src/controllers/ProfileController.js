const connection = require("../database/connection");

module.exports = {
    async listar(request, response) {
        const ong_id = request.header("ong");

        const incidents = await connection('incidents')
            .where('ong_id', ong_id)
            .select('*');

        return response.json(incidents);
    }
}