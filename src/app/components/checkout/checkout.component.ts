import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { Formvalidators } from 'src/app/validators/formvalidators';

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

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries : Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
 


  constructor(
     private formBuilder: FormBuilder,
     private shopFormService: ShopFormService,
     private cartService: CartService  ) 
     { }

  ngOnInit(): void {

    this.reviewCartDetails();
    

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2),Formvalidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),Formvalidators.notOnlyWhitespace]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),Formvalidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),Formvalidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),Formvalidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),Formvalidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),Formvalidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required,Formvalidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required,Formvalidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),Formvalidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required, Validators.minLength(2)]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),Formvalidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'),Formvalidators.notOnlyWhitespace]),
        securityCode:   new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}'),Formvalidators.notOnlyWhitespace]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      } );

    // populate credit card years

    this.shopFormService.getCreditCardYears().subscribe(
      

      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      });

      // populate countries

      this.shopFormService.getCountries().subscribe(
        data => {
          console.log("Retrieved countries: " + JSON.stringify(data));
          this.countries = data;
        }
       
      );


  }
  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
    // compute cart total price and quantity
    this.cartService.computeCartTotals();

    this.orderTotal = this.totalPrice;
    this.shipping = 0;

    

  }

      onSubmit() {
        console.log("Handling the submit button");
       
        if (this.checkoutFormGroup.invalid) {
          this.checkoutFormGroup.markAllAsTouched();
        }



      }

      get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
      get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
      get email() { return this.checkoutFormGroup.get('customer.email'); }

      get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
      get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
      get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
      get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
      get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

      get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
      get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
      get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
      get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
      get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

      get creditCardCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
      get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
      get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
      get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

      





      
      copyShippingAddressToBillingAddress(event: any) {

     this.billingAddressStates = this.shippingAddressStates;

        if (event.target.checked) {
          this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        }
        else {
          this.checkoutFormGroup.controls['billingAddress'].reset();

          this.billingAddressStates = [];
        }
      }

      handleMonthsAndYears() {
        const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')!;

        const currentYear: number = new Date().getFullYear();
        const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

        // if the current year equals the selected year, then start with the current month
        let startMonth: number;

        if (currentYear === selectedYear) {
          startMonth = new Date().getMonth() + 1;
        }
        else {
          startMonth = 1;
        }

        this.shopFormService.getCreditCardMonths(startMonth).subscribe(
          data => {
            console.log("Retrieved credit card months: " + JSON.stringify(data));
            this.creditCardMonths = data;
          }
        );
      }

      getStates(formGroupName: string) {

        const formGroup = this.checkoutFormGroup.get(formGroupName) as FormGroup;

        const countryCode = formGroup.value.country.code;
        const countryName = formGroup.value.country.name;

        console.log(`${formGroupName} country code: ${countryCode}`);
        console.log(`${formGroupName} country name: ${countryName}`);

        this.shopFormService.getStates(countryCode).subscribe(
          data => {
            if (formGroupName === 'shippingAddress') {
              this.shippingAddressStates = data;
            }
            else {
              this.billingAddressStates = data;
            }

            // select first item by default
            formGroup.get('state')!.setValue(data[0]);
          }
        );
      }



    




      
      
}
