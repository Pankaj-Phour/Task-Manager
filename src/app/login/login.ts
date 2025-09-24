import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  @Output() userLoggedIn = new EventEmitter();

  isLogin = signal(true);
  formData = {
    email: '',
    password: ''
  };

  constructor(private router:Router){};

  handleSubmit() {
    if (this.isLogin()) {
      // Mock login - in real app, this would validate against backend
      const mockUser: any = {
        id: '1',
        email: this.formData.email || 'demo@example.com'
      };
      
      this.showToast('Successfully logged in!', 'success');
      localStorage.setItem('user',JSON.stringify(mockUser));
      this.router.navigate(['/dashboard']);
    } else {
      // Mock registration
      const newUser: any = {
        id: Date.now().toString(),
        email: this.formData.email
      };
      
      this.showToast('Account created successfully!', 'success');
      localStorage.setItem('user',JSON.stringify(newUser));
      this.router.navigate(['/dashboard']);
    }
  }

  toggleMode() {
    this.isLogin.set(!this.isLogin());
  }

  private showToast(message: string, type: 'success' | 'error') {
    // Simple toast implementation - in real app, use a proper toast service
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }
}
