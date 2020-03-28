const connection = require("../database/connection");

module.exports = {
    async listar(req, res) {
        const { page = 1 } = req.query;

        const [count] = await connection('incidents').count();

        const incidents = await connection("incidents")
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select('*');

        res.header("X-Total-Count", count["count(*)"])

        console.log(incidents)
        return res.json({incidents})
    },    
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.header("ong");

        const [id] = await connection("incidents").insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });
    },
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.header("ong");
        
        const incident = await connection("incidents")
            .where('id', id)
            .select('ong_id')
            .first();
        
            if (incident == undefined) {
                return response.status(404).json({error: 'Incident not found'})
            } else if (incident.ong_id !== ong_id) {
                return response.status(401).json({error: 'Operation not permitted'})
            }

            await connection("incidents").where('id', id).delete();

            return response.status(204).send();
    },    
};
