import { Author } from './author';

export class User extends Author {
  email: string;
  constructor(email?: string) {
    super();
    this.email = email || '';
  }
}
