import { connection } from "../connection";
import postModel from "../model/post";


interface IPostRepository {
    createPost(post_model: postModel): Promise<postModel>
    createPostFile(params:{postid:string , uploadid:string , upload_url:string}): Promise<postModel>
    findAll(): Promise<postModel>
    queryPublicPost() : Promise<[]>
    findUserPost(userid : string): Promise<string>
    findOnePost(searchParams:{post_id:string}):Promise<postModel>
    update(post: postModel): Promise<number>
    deleteById(post_id : string , userid:string): Promise<string>
    deleteAll(): Promise<number>
}

class postRepository implements IPostRepository{
    findOnePost(searchParams: { post_id: string; }): Promise<postModel> {
        return new Promise((resovle ,rejects)=> {
            connection.query<any>(`SELECT
             uploadPosts.upload_url,
             uploadPosts.upload_id,
             users.username,
             users.userid,
             posts.content, 
             posts.created_at,
             userInfo.profile_url,
             posts.postid FROM posts 
             LEFT JOIN uploadPosts ON 
             posts.postid = uploadPosts.post_id 
             RIGHT JOIN users ON users.userid = posts.userid 
             LEFT JOIN userInfo ON userInfo.userid = users.userid
             WHERE 
             posts.postid = '${searchParams.post_id}' ;`, [], (err,res)=>{
                if(err) rejects(err)
                    else resovle(res)
            })
        })
    }
    queryPublicPost(): Promise<[]> {
            return new Promise((resolve,rejects)=>{
                const query = `SELECT 
                             users.userid,
                             users.username,
                             posts.postid,
                             posts.content,
                             posts.create_at,
                             uploadPosts.upload_url,
                             uploadPosts.upload_id,
                             posts.update_at,
                             userInfo.profile_url
                             FROM posts 
                             JOIN users ON posts.userid = users.userid
                             LEFT JOIN uploadPosts ON uploadPosts.post_id = posts.postid 
                             LEFT JOIN userInfo ON users.userid = userInfo.userid
                             order by posts.update_at desc
                             `
                connection.query<[]>(query, (err,res)=>{
                    if(err)
                        rejects(err)
                    else
                        resolve(res)
                })
            })
    }
    createPostFile(params:{postid:string , uploadid:string , upload_url:string}): Promise<postModel> {
        return new Promise((resolve, rejects)=> {
            connection.query<any>
            (`INSERT INTO uploadPosts (upload_id , post_id , upload_url) VALUES (?,?,?)`,
             [params.uploadid , params.postid 
            , params.upload_url], (err ,res)=>{
                if(err) rejects(err)
                else resolve(res)
             })
        })
    }
    createPost(post_model: postModel): Promise<postModel> {
        return new Promise((resolve, rejects)=>{
            connection.query<any>
            ("INSERT INTO posts (postid , userid, content) VALUES (?, ?, ? )",
            [post_model.postid, post_model.userid,post_model.content],
            (err,res)=>{
                if(err){
                    console.log("Error create post: ", err)
                    rejects(err)
                }else{
                    console.log("successfully create post");
                    resolve(post_model)
                }
            }
            )
        })
    }

    findAll(): Promise<postModel> {
        throw new Error("Method not implemented.");
    }
    findUserPost(userid:string): Promise<string> {
        return new Promise((resovle ,rejects)=>{
            const sql = `
            SELECT 
            users.username,
            users.userid,
            posts.postid,
            posts.content,
            posts.created_at,
            posts.updated_at,
            uploadPosts.upload_id,
            uploadPosts.upload_url,
            userInfo.profile_url
            FROM posts INNER
            JOIN users ON posts.userid = users.userid 
            LEFT JOIN uploadPosts ON uploadPosts.post_id = posts.postid
            LEFT JOIN userInfo ON userInfo.userid = users.userid 
            WHERE posts.userid = '${userid}' order by posts.created_at desc;`;
            connection.query<any>(sql ,[] , (err,res)=>{
                    if(err) rejects(err)
                    else 
                        resovle(res)
            })
        })
    }
    update(post: postModel): Promise<number> {
        throw new Error("Method not implemented.");
    }
    deleteById(post_id: string , userid:string): Promise<string> {
       return new Promise((resovle,rejects)=> {
            const sql = `DELETE FROM posts WHERE posts.userid = '${userid}' AND posts.postid = '${post_id}'`;
            connection.query<any>(sql ,(err,res)=>{
                    if(err) rejects(err)
                        else resovle(res)
            })
       })
    }
    deleteAll(): Promise<number> {
        throw new Error("Method not implemented.");
    }

}

export default new postRepository