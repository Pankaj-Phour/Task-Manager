import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  console.log("Inside the guard");
  
  if(localStorage.getItem('user')){
    let user = JSON.parse(localStorage.getItem('user'));
    if(user && user.token){
      return true;
    }
    else{
      router.navigate(['/login'])
      return false;
    }
  }
  else{
    router.navigate(['/login'])
    return false;
  }
};
