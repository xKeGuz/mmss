interface IWorkspace {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  users: IUser[];
}
export interface IUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  second_last_name: string;
  full_name: string;
  last_login: string;
  role_id: string;
}
