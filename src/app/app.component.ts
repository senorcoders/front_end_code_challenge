import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AssistanceService} from './services/assistance.service';
import { $ } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AssistanceService]
})
export class AppComponent {
  title = 'New Assistance Request';
  aForm: FormGroup;
  formErrors: any;
  errorMessages: any;
  services: any = [];
  formSubmitted: boolean = false;
  returnedStatus: any;
  readyToSubmit: any;
  constructor (private _assistanceService: AssistanceService){}
  ngOnInit(){

    // Store Form errors
    this.formErrors = {
      'firstName': '',
      'lastname': '',
      'email': '',
      'serviceType':'',
      'terms': ''
    }
    // Setup the main form
    this.aForm = new FormGroup({
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      serviceType: new FormControl('', Validators.required),
      message: new FormControl(''),
      terms: new FormControl('', Validators.requiredTrue)
    })

    // Below are the formControl error messages
    this.errorMessages = {
      'firstName': 'First name is required.',
      'lastName': 'Last name is required.',
      'email': 'Please provide a valid email address.',
      'serviceType': 'Choose a service from the dropdown.',
      'terms': 'You must accept the terms to continue'
    }

    this._assistanceService.getServices().subscribe((data) => {
      // Retrieve available services
      this.services = data['data'];
    })
    
    // Watch for changes on the form
    this.aForm.valueChanges.subscribe((data) => {
      this.returnedStatus = ""; // Reset returned info
      this.readyToSubmit = ''; // Reset empty submit message
      this.formSubmitted = false; // Since something changed allow user to resubmit form
      this.checkFormErrors(this.aForm);
    });
  }

  checkFormErrors(form_group): void {
    Object.keys(form_group.controls).forEach((key) => {
      let formItem = form_group.get(key);
      this.formErrors[key] = '';
      if (!formItem.valid && (formItem.touched || formItem.dirty)){
        this.formErrors[key] = this.errorMessages[key]; 
      }
    })
  }
  onSubmit(): void {
    if (this.aForm.valid){
      this.formSubmitted = true;
      let formInfo = this.aForm.value;
      let request = {
        "assistance_request": {
          "contact": {
            "first_name": formInfo.firstName,
            "last_name": formInfo.lastName,
            "email": formInfo.email
          },
          "service_type": formInfo.serviceType,
          "description": formInfo.message
        }
      }
      this._assistanceService.postAssistance(request).subscribe((data) => {
        this.returnedStatus = data.message
      },
      err => {
        this.returnedStatus = err.error.message
      })
    } else {
      this.readyToSubmit = "Please fill-in all required fields";
    }
  }
}


