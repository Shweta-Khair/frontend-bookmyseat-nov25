import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t mt-12">
      <div class="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <p>&copy; 2025 BookMySeat. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {}