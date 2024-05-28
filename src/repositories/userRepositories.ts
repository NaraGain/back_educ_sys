import userModel from "../model/user";
import { connection } from "../connection";
import userInfoModel from "../model/userInfo";
import { RowDataPacket } from "mysql2";






interface IUserRepository {
    createUser(user_model: userModel): Promise<userModel>;
    changeProfile(user_info: userInfoModel): Promise<userInfoModel>
    userProfile(username: string ) : Promise<userModel>;
    updateUserProfile(user_id: string , infoId:string , profile_url:string) : Promise<string>
    retrieveAll():Promise<userModel[]>
    retrieveByQuery(searchParams: {username:string,email:String,admin:Boolean}): Promise<userModel>;
    retrieveById(user_id : string): Promise<userModel | undefined>;
    update(user: userModel) : Promise<any>;
    delete(user_id : string): Promise<string>;
    deleteAll(): Promise<number>;
    queryUserFile(searchParams:{userid : string}): Promise<string>;
}


class userRepository implements IUserRepository {
    queryUserFile(searchParams: { userid: string; }): Promise<string> {
        return new Promise((resovle ,rejects)=>{
            const queryString = `select uploadPosts.upload_url, 
            posts.postid, userInfo.profile_url from posts 
            left join uploadPosts on 
            posts.postid = uploadPosts.post_id inner join 
             users on users.userid = posts.userid 
             inner join userInfo on userInfo.userid 
             = users.userid where users.userid = "${searchParams.userid}"; `
            connection.query<RowDataPacket[]>(queryString, [], (err ,res:any)=>{
                if(err) rejects(err)
                    else resovle(res)
            })
        })
    }
    userProfile(username: string): Promise<userModel> {
        return new Promise((resolve,rejects)=>{
            connection.query<any>(`SELECT 
                            users.userid, users.username,
                            users.firstname,users.lastname,
                            users.email,
                            userInfo.infoid,
                            userInfo.bio,
                            userInfo.profile_url FROM users LEFT JOIN userInfo ON
                            users.userid = userInfo.userid
                            WHERE users.username = ?
                            `,[username], (err ,res)=> {
                                if(err) rejects(err)
                                    else resolve(res)
                            })
        })
    }
    updateUserProfile(user_id: string , infoId:string , profile_url:string): Promise<string> {
        return new Promise((resolve ,rejects)=> {
            connection.query<any>(`update userInfo 
                                 set profile_url 
                                 = '${profile_url}'
                                 where userInfo.userid 
                                 = '${user_id}'
                                 and userInfo.infoid = '${infoId}';`,
                                  [],
                                (err ,res)=>{
                                    if(err) rejects(err)
                                        else resolve(res)
                                }
                                )
        })
    }
    changeProfile(user_info: userInfoModel): Promise<userInfoModel> {
            return new Promise((resolve,rejects)=>{
                 connection.query<any>
                 ("INSERT INTO userInfo (infoid , userid , profile_url, bio ,address, phone) VALUES (?,?,?,?,?,?)" 
                  , [user_info.infoid , 
                    user_info.userid , user_info.profile_url 
                    ,user_info.bio ,user_info.address, 
                    user_info.phone], (err, res)=>{
                    if(err) rejects(err)
                        else resolve(res)})

                })
    }
    retrieveByQuery(searchParams:
         { username?: string, email?: String, admin?: Boolean, }):
     Promise<userModel> {
        let query:string = 'SELECT * FROM users';
        let condition : string = " ";
        if(searchParams?.username)
            condition += `username = "${searchParams?.username}" `
        
        if(searchParams?.email)
            condition += `email = "${searchParams?.email}" `      
        if(condition.length)
            query +=  ` WHERE ` + condition

        return new Promise((resolve , rejects)=> {
            connection.query<any>(query ,(err ,res)=>{
                    if(err) rejects(err);
                    else
                        resolve(res)
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
            connection.query<any>
            ("INSERT INTO users (userid,firstname, lastname, username, email, password)"
            +" VALUES (?,?, ?, ?, ?, ?)",
            [user_model.userid,user_model.firstname,
                 user_model.lastname, user_model.username,
                  user_model.email, user_model.password],(err ,res)=>{
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
   
    retrieveById(user_id: string): Promise<userModel> {
        return new Promise((resovle ,rejects)=>{
            connection.query<userModel[]>
            (`SELECT * FROM users WHERE userid = ?`,
            [user_id], (err,res)=>{
                if(err) rejects(err)
                else resovle(res?.[0])
            }
            )
        })
    }


    update(user: userModel): Promise<any> {
            return new Promise((resovle ,rejects)=>{
                const query = `UPDATE users SET users.username = ?, 
                users.firstname = ?, users.lastname = ?, users.email = ?
                 WHERE users.userid = "${user.userid}" ;`
                connection.query<RowDataPacket[]>(
                    query,
                    [user.username,user.firstname,user.lastname ,user.email] ,
                        (err ,res:any)=>{
                            if(err) rejects(err)
                            else resovle(res)
                        }
                )
            })
            connection.end()
    }
    delete(user_id: string): Promise<string> {
        return new Promise((resolve, rejects)=>{
            connection.query<any>(`
            DELETE FROM users WHERE users.userid =  ?
            `, [
                user_id
            ], (err,res)=>{
                if(err) rejects(err)
                else resolve(res)
            })
        })
    }
    deleteAll(): Promise<number> {
        return new Promise((resolve ,rejects)=>{
            connection.query<any>(`DELETE FROM users`, (err ,res)=>{
                if(err) rejects(err)
                else resolve(res)
            })
        })
    }

}


export default new userRepository