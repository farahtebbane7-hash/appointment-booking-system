import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',  // ← This should point to the HTML file
  styleUrls: ['./app.component.css']    // ← This should point to the CSS file
})
export class AppComponent {
  title = 'appointment-frontend';
}