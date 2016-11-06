import {UserInterface} from '../user/user.interface';
export interface TallyListInterface {
  overallCount: number;
  offset: number;
  limit: number;
  entries: UserInterface[];
}
