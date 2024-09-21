import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // @ts-ignore
  formGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {

    const username = this.formGroup.get('username')!!.value;
    const password = this.formGroup.get('password')!!.value;
    this.userService.login(username, password).subscribe(user => {
      console.log(user);
    });
  }


}
