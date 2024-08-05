import { UserResponse } from "./login.model";

export class UserParams{
    public gender :string ;
    public minAge : number = 18;
    public maxAge : number =120;
    public pageNumber : number = 1;
    public pageSize : number = 5; 
    public orderBy : string = "";

    constructor( user : UserResponse ) {
        this.gender = user.gender === 'female' ? 'male' : 'female';
    }
}