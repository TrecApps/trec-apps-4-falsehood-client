import { Routes } from '@angular/router';
import { SearchFalsehoodComponent } from './components/search-falsehood/search-falsehood.component';
import { LoginComponent } from '@tc/tc-ngx-general';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FalsehoodSubmitComponent } from './components/falsehood-submit/falsehood-submit.component';
import { FactcheckComponent } from './components/factcheck/factcheck.component';
import { FactcheckSearchComponent } from './components/factcheck-search/factcheck-search.component';

export const routes: Routes = [
    {path: "Logon", component: LoginComponent},
    {path: "Welcome", component: WelcomeComponent},
    {path: "falsehoods-search", component: SearchFalsehoodComponent },
    {path: "falsehood-submit", component: FalsehoodSubmitComponent},
    {path: "factcheck", component: FactcheckComponent},
    {path: "factchecks-search", component: FactcheckSearchComponent},
    {path: "", redirectTo: "Welcome", pathMatch: 'full'}
];
