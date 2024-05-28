import { connection } from "../connection";
import commentPosts from "../model/comments";


interface IcommentRepository {
    createComment(comments:commentPosts): Promise<commentPosts>
    findOne(): Promise<commentPosts>
    findCoommentByPostId(searchParams:{postid:string}): Promise<string>
    findById(comment_id : string):Promise<string>
    update(comment_id: commentPosts):Promise<commentPosts>
    deleteById(comment_id:string):Promise<string>
    
}


class commentRepository implements IcommentRepository {
    findCoommentByPostId(searchParams: { postid: string; }): Promise<string> {
        return new Promise((resolve ,rejects)=> {
            const sql = `SELECT commentPosts.commentid, commentPosts.comment , 
            commentPosts.created_at,users.username ,users.userid,
            userInfo.profile_url
            FROM commentPosts 
            INNER JOIN users on users.userid = commentPosts.userid 
            LEFT JOIN userInfo ON userInfo.userid = users.userid
            WHERE commentPosts.postid = '${searchParams.postid}' `
            connection.query<any>(sql, [],(err,res)=>{
                if(err) rejects(err)
                    else resolve(res)
            })
        })
    }
    createComment(comments: commentPosts): Promise<commentPosts> {
        return new Promise((resovle ,rejects)=>{
            connection.query<any>(`
            INSERT INTO commentPosts (commentid , userid , postid , comment) VALUES (?,?,?,?)`,
            [comments.commentid, comments.userid, comments.postid, comments.comment],(err,res)=>{
                if(err) rejects(err)
                    else resovle(res)
            })
        })
    }
    findOne(): Promise<commentPosts> {
        throw new Error("Method not implemented.");
    }
    findById(comment_id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    update(comment_id: commentPosts): Promise<commentPosts> {
        throw new Error("Method not implemented.");
    }
    deleteById(comment_id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

}


export default new commentRepository