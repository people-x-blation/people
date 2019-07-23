import pg from 'pg'
let instance
class Singleton {
    constructor(){
	if (instance) return instance;

	instance = new pg.Pool({
	    host : process.env.DB_HOST,
	    user : process.env.DB_USER, 
	    password: process.env.DB_PW,
	    database: process.env.DATABASE, 
		port: process.env.PORT
	})
	return instance;
    }
}
export default Singleton