import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <!-- Logo & Brand -->
          <a routerLink="/" class="group flex items-center gap-3 transition-all hover:scale-105">
            <div class="relative">
              <div class="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
              <div class="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all">
                <!-- Option 1: Ticket Icon (Recommended for BookMySeat) -->
                <svg class="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
                
                <!-- Option 2: Theater Seats (seats icon) - Uncomment to use
                <svg class="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 9h3v11H4c-1.1 0-2-.9-2-2v-7c0-1.1.9-2 2-2zm14 0h3c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2h-3v-11zM9 9h6v11H9V9zm0-2V4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v3H9z"/>
                </svg>
                -->
                
                <!-- Option 3: Original Video Camera - Uncomment to use
                <svg class="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
                -->
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-none">
                BookMySeat
              </span>
              <span class="text-[10px] text-muted-foreground font-medium tracking-wide">
                CINEMA EXPERIENCE
              </span>
            </div>
          </a>

          <!-- Navigation -->
          <nav class="flex items-center gap-2">
            <a 
              routerLink="/movies" 
              routerLinkActive="bg-primary/10 text-primary border-primary/20"
              [routerLinkActiveOptions]="{exact: false}"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border border-transparent hover:bg-primary/5 hover:border-primary/10 transition-all font-medium text-sm group">
              <svg class="w-4 h-4 text-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              <span>Movies</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {}