import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router:Router){}

  goToGenerate():void{
    console.log('Going to Generate Page');
    this.router.navigate(['/generate'])
  }
  goToVerify():void{
    const code  =  prompt('Enter Verification code: ');
    if(code && code.trim()){
      this.router.navigate(['/verify', code.trim()]);
    }
    console.log('Going to verify page');
  }
}
