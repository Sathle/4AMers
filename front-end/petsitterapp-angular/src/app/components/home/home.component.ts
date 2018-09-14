import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  closeResult: string;

  private username: string;
  private password: string;
  private user: User;
  private invalidLogin: boolean;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private auth: AuthService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.invalidLogin = false;
  }

  login() {
    this.auth.login(this.username, this.password).subscribe(
      data => {
        this.user = data;
        if (this.user.id === 0) { // incorrect login information
          this.invalidLogin = true;
        } else {  // correct login information
          this.cookieService.deleteAll(); // do we need this?
          this.cookieService.set('username', this.user.username, 2); // will expire in 2 days
          // this.cookieService.set('password', this.user.password, 2);
          this.cookieService.set('firstname', this.user.firstName, 2);
          this.cookieService.set('lastname', this.user.lastName, 2);
          this.cookieService.set('email', this.user.email, 2);
          this.cookieService.set('bioDescription', this.user.bioDescription, 2);
          console.log(this.cookieService.getAll());
          this.invalidLogin = false;
        }
      }
    );
  }

  register() {

  }

  open(content) {
    console.log('in open(content) function');
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
