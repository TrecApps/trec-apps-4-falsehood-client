import { Routes } from '@angular/router';
import { SearchFalsehoodComponent } from './components/search-falsehood/search-falsehood.component';
import { LoginComponent } from '@tc/tc-ngx-general';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FalsehoodSubmitComponent } from './components/falsehood-submit/falsehood-submit.component';

export const routes: Routes = [
    {path: "Logon", component: LoginComponent},
    {path: "Welcome", component: WelcomeComponent},
    {path: "falsehoods-search", component: SearchFalsehoodComponent },
    {path: "falsehood-submit", component: FalsehoodSubmitComponent}
];
