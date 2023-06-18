const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {jobsSchema} = require("../schemas/jobsSchema.json")

class Jobs {

    static async create({ id, title, salary, equity }) {
        const duplicateCheck = await db.query(
            `SELECT id
            FROM jobs
            WHERE id = $1,
            [id]`
        )

        if (duplicateCheck.rows[0])
        throw new BadRequestError(`Duplicate Company: ${id}`);

    
        const result = await db.query(
            `INSERT INTO jobs
            (id, title, salary, equity)
            VALUES ($1, $2, $3, $4) 
            RETURNING id, title, salary, equity, 
            [
                id, title, salary, equity
            ]`
        );

        const jobs = result.rows[0];

        return jobs;
    }

    static async findAll(searchFilters = {}){
        let query = `SELECT id, title, salary, equity FROM companies`;

        let whereExpressions = [];
        let queryValues = [];

        const { title, minSalary, hasEquity }  = searchFilters;

        if(title){
            queryValues.push(`%${title}%`);
            whereExpressions.push(`name ILIKE $${queryValues.length}`);
        }

        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
        }

        query+= " ORDER BY name";
        const jobsRes = await db.query(query, queryValues);
        return jobsRes.rows;
      
    }


}

module.exports = Jobs;
