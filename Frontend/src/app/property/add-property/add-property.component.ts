import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {
  @ViewChild('Form') addPropertyForm: NgForm;
  constructor(private router: Router) { }

  ngOnInit() {
    //this.addPropertyForm.controls['Name'].setValue('Default Value');

    setTimeout(() => {
      this.addPropertyForm.controls['Name'].setValue('Default Value');
    }, 1000);
  }

  onBack(){
    this.router.navigate(['/']);
  }

  onSubmit(){
    console.log(this.addPropertyForm);
  }
}
