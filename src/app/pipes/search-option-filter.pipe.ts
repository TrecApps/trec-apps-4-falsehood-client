import { Pipe, PipeTransform } from '@angular/core';
import { TcUser } from '@tc/tc-ngx-general';

export interface SearchStatusOption {
  status: string;
  displayStatus: string;
  requiresAuth: boolean;
}

@Pipe({
  name: 'searchOptionFilter'
})
export class SearchOptionFilterPipe implements PipeTransform {

  transform(ssos: SearchStatusOption[], user:TcUser | undefined): SearchStatusOption[] {

    return ssos.filter((sso: SearchStatusOption) => {
      if(!sso.requiresAuth || (user && user.credibilityRating)) return true;
      return false;
    });
    
  }

}
