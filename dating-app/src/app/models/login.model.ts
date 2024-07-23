export class LoginModel {
  public UserName: string | undefined;
  public Password: string | undefined;
}

export interface UserResponse {
  UserName: string;
  Token: string;
}
