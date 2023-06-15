const request = require("supertest");
const app = require("app");
const db = require("..db");
const {sqlForPartialUpdate} = require("/sql")

describe("Partial Update", ()=> {
    test("get partial update", async()=>{
        const dataToUpdate = {
            firstName: "Aliya", 
            age: 32
        }

        const jsToSql = {
            firstName: "first_name"
        };

        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(result).toEqual({
            setCols: `"first_name"=$1, "age" = $2`, 
            values: ["Aliya", 32],
        });
    });
});