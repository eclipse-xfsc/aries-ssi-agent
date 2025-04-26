import { map } from 'rxjs';

export const exrtactResponseData = () => map(({ data }) => data);
