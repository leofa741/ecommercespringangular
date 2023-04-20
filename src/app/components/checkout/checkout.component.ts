import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalQuantity: number = 0;
  totalPrice: number = 0;
  orderTotal : number = 0;
  shipping : number = 0;

  constructor(
     private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

      }

      onSubmit() {
        console.log("Handling the submit button");
        console.log(this.checkoutFormGroup.get('customer')!.value);
        console.log(this.checkoutFormGroup.get('shippingAddress')!.value);
        console.log(this.checkoutFormGroup.get('billingAddress')!.value);
        console.log(this.checkoutFormGroup.get('creditCard')!.value);
        console.log("The email address is " + this.checkoutFormGroup.get('customer')!.value.email);

        console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')!.value.country);

       console.log("The billing address country is " + this.checkoutFormGroup.get('billingAddress')!.value.country);

          console.log("The credit card type is " + this.checkoutFormGroup.get('creditCard')!.value.cardType);


      }
      
      copyShippingAddressToBillingAddress(event: any) {
        if (event.target.checked) {
          this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        }
        else {
          this.checkoutFormGroup.controls['billingAddress'].reset();
        }
      }
      
}
