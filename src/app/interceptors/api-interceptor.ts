import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
   let cloned;
  let router = inject(Router);
  let headers;
  if(localStorage.getItem('user')){
     headers = new HttpHeaders({
      'Authorization':'Bearer ' + JSON.parse(localStorage.getItem('user')).token
    })
  }
  if(req.url.match('signin') || req.url.match('auth')){
    cloned = req;
  }
  else{
    cloned = req.clone({headers})
  }
  // const self = this;
  return next(cloned).pipe(
    catchError(error =>{
      if(error && error.status == 401){
        router.navigate(['/login']);
        localStorage.clear();
      }
      return throwError(()=> error)
    })
  )
};
