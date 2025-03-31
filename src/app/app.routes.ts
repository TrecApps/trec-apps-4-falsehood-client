import { Routes } from '@angular/router';
import { SearchFalsehoodComponent } from './components/search-falsehood/search-falsehood.component';
import { LoginComponent } from '@tc/tc-ngx-general';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
    {path: "Logon", component: LoginComponent},
    {path: "Welcome", component: WelcomeComponent},
    {path: "falsehoods-search", component: SearchFalsehoodComponent }
];
