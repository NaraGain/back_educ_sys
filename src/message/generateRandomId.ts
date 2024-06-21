interface IgenerateRandomId {
    RamdomId(): Promise<string>
}


export const generateIdRandomId = (length:number) => {
    const characters:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*%$^_+@!-';
    const charLength = characters.length;
    const idLength = length;
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
}


