import {Component, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HealthCheckService} from './core/services/health-check.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('banking-fronted');

  private healthCheck = inject(HealthCheckService);

  ngOnInit(): void {
    this.healthCheck.checkCustomerService().subscribe({
      next: (data) => console.log('Customer Service OK:', data),
      error: (err) => console.error('Customer Service Error:', err)
    });

    this.healthCheck.checkAccountService().subscribe({
      next: (data) => console.log('Account Service OK:', data),
      error: (err) => console.error('Account Service Error:', err)
    });
  }

}
