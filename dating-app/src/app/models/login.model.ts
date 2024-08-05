export class LoginModel {
  public UserName: string | undefined;
  public Password: string | undefined;
}

export class UserResponse {
  public userName: string | undefined;
  public token: string | undefined;
  public photoUrl: string | undefined;
  public knowAs : string | undefined;
  public gender : string | undefined;
}
