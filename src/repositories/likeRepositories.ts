import { connection } from "../connection";
import likePosts from "../model/likePost";
import { RowDataPacket } from "mysql2";

interface ILikeRepository {
    createLike(like_post : likePosts) : Promise<likePosts>
    findLikeById(searchParams:{field:string, index:string}) : Promise<[]>
    findUserLikePost(searchParams:{userid:string , postid:string}): Promise<string>
    unlikePost(searchParams:{userid:string, postid:string}) : Promise<string>
    countPostLike(searchParams:{postid : string}): Promise<string>
    queryAllUserLikePost(searchParams:{postid:string}): Promise<string>
    checkUserLikePost(searchParams:{userid:string , postid:string}): Promise<string>
}

class likePostRepository implements ILikeRepository {
    checkUserLikePost(searchParams: { userid: string; postid: string; }): Promise<string> {
        return new Promise((resolve,rejects)=>{
            const query =  `SELECT * FROM likePosts WHERE postid = '${searchParams.postid}' AND userid = '${searchParams.userid}'`;
            connection.query<RowDataPacket[]>(query, [], (err,res:any)=>{
                if(err) rejects(err)
                    else resolve(res)
            })
        })
    }
    queryAllUserLikePost(searchParams: { postid: string; }): Promise<string> {
        return new Promise((resolve,rejects)=>{
            const query = `
            select userInfo.profile_url, users.userid, likePosts.likeid, likePosts.userid ,users.username,
            likePosts.created_at,
           likePosts.postid from likePosts
           inner join users on users.userid 
           = likePosts.userid inner join userInfo 
          on userInfo.userid = users.userid 
          where likePosts.postid = "${searchParams.postid}" order by likePosts.updated_at desc;
            `
            connection.query<RowDataPacket[]>(query, [], (err,res:any)=>{
                if(err) rejects(err)
                    else resolve(res)
            })
        })
    }
    findUserLikePost(searchParams:{userid: string, postid: string}): Promise<string> {
        return new Promise((resolve ,rejects)=> {
            const sql  = `SELECT * FROM likePosts WHERE 
            likePosts.userid = "${searchParams.userid}" AND postid="${searchParams.postid}"`;
            connection.query<RowDataPacket[]>(sql,[],(err,res:any)=>{
                if(err) rejects(err)
                    else resolve(res)
            })
        })
    }
    countPostLike(searchParams: { postid: string; }): Promise<string> {
        return new Promise((resolve ,rejects)=>{
            const sql = `SELECT COUNT(*) AS totalLikes 
                        FROM likePosts 
                        WHERE postid = "${searchParams.postid}";`
            connection.query<RowDataPacket[]>(sql ,[searchParams.postid],(err,res:any)=>{
                    if(err) rejects(err)
                        else resolve(res)
            })
        })
    }

    unlikePost(searchParams: { userid: string, postid:string }): Promise<string> {
        return new Promise((resolve , rejects)=> {
            const sql = `delete from likePosts where 
            userid = '${searchParams.userid}'
             AND postid = '${searchParams.postid}';`
            connection.query<any>(sql ,[] , (err,res:any)=> {
                if(err) rejects(err)
                    else resolve(res?.affectedRows)
            })
        })
    }
    createLike(like_post: likePosts): Promise<likePosts> {
        return new Promise((resolve ,rejects)=>{
            const sql = `INSERT INTO likePosts (likeid , userid , postid) VALUES (?,?,?)`
            connection.query(sql , 
                [like_post.likeid, like_post.userid, like_post.postid],
                 (err,res:any)=>{
                if(err) rejects(err)
                    else resolve(res?.affectedRows)
            })
        })
    }
    findLikeById(searchParams: { field: string, index:string}): Promise<[]> {
        return new Promise((resolve ,rejects)=> {
            let sql:string = `SELECT * FROM likePosts ` 
            let condition:string = " "
            if(searchParams?.field == 'userid'){
                condition += `userid = "${searchParams.index}"`
            }

            if(searchParams.field == 'likeid'){
                condition += `likeid = "${searchParams.index}"`
            }

            if(condition.length){
                sql += `WHERE` + condition
            }

          
           
            connection.query<any>(sql, (err,res)=>{
                if(err) rejects(err)
                    else resolve(res)
            })
        })
    }

}

export default new likePostRepository