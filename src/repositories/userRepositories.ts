import userModel from "../model/user";
import { connection } from "../connection";





interface IUserRepository {
    createUser(user_model: userModel): Promise<userModel>;
    retrieveAll():Promise<userModel[]>
    retrieveByQuery(searchParams: {username:string,email:String , password:String , admin:Boolean}): Promise<userModel[]>;
    retrieveByType(searchParams : {Type:string, data:string}): Promise<userModel>
    retrieveById(user_id : number): Promise<number>;
    update(user: userModel) : Promise<number>;
    delete(user_id : number): Promise<number>;
    deleteAll(): Promise<number>;
}


class userRepository implements IUserRepository {
   
    retrieveByType(searchParams: { Type?:string, data?:string }): Promise<userModel> {
        return new Promise((resovle ,rejects)=>{
            let query:string = `SELECT * 
            FROM users where ${searchParams.Type} = "${searchParams.data}"`
            connection.query<any>(query ,(err,res)=>{
                if(err)rejects(err)
                else
                    resovle(res)
            })
        })
    }
    retrieveAll(): Promise<userModel[]> {
        return new Promise((resolve,rejects)=>{
            let query:string = 'SELECT * FROM users';
            connection.query<userModel[]>(query, (err,res)=>{
                if(err) rejects(err)
                else
                    resolve(res)
            })
        })

    }


    

    createUser(user_model: userModel): Promise<userModel> {
        return new Promise((resovle,rejects) =>{
            // const random = randomUUID();
            // user_model.userid = random;
            connection.query<any>("INSERT INTO users (userid,firstname, lastname, username, email, password) VALUES (?,?, ?, ?, ?, ?)",
            [user_model.userid,user_model.firstname, user_model.lastname, user_model.username, user_model.email, user_model.password],(err ,res)=>{
                if(err){
                    console.log("Error inserting user:", err);
                    rejects(err);
                }else{
                    console.log("successfully inserted user");
                    resovle(user_model);
                }
            });
        });
    }
    retrieveByQuery(searchParams: {username:string, email: String; password: String; admin: Boolean; }): Promise<userModel[]> {
        let query:string = 'SELECT * FROM users';
        let condition : string = "";
        if(searchParams?.username)
            condition += "username"

        return new Promise((resolve , rejects)=> {
            connection.query<userModel[]>(query ,(err ,res)=>{
                    if(err) rejects(err);
                    else
                        resolve(res)
            })
        })
        // throw new Error("Method not implemented.");
    }

   

    retrieveById(user_id: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    update(user: userModel): Promise<number> {
        throw new Error("Method not implemented.");
    }
    delete(user_id: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    deleteAll(): Promise<number> {
        throw new Error("Method not implemented.");
    }

}


export default new userRepository