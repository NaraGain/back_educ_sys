interface IgenerateRandomId {
    RamdomId(): Promise<string>
}




class generateIdRandomId implements IgenerateRandomId {
    RamdomId(): Promise<string> {
        return new Promise((resovle ,reject)=>{
            const characters:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charLength = characters.length;
            const idLength = 10;
            let randomId = '';
            for (let i = 0; i < idLength; i++) {
                if (i % 2 === 0) {
          // Add a random character from the characters string
                    randomId += characters.charAt(Math.floor(Math.random() * charLength));
                 } else {
          // Add a random digit from 0 to 9
                   randomId += Math.floor(Math.random() * 10);
             }
        }
        return randomId
        })
    }
   
}


export default new generateIdRandomId