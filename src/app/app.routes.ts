import { Routes } from '@angular/router';
import { App } from './app';
import { Book } from './book/book';
import { BookDetail } from './book-detail/book-detail';
import { Home } from './home/home';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Login } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'books',
    component: Book,
  },
  {
    path: 'books/:id',
    component: BookDetail,
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'contact',
    component: Contact,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
];
