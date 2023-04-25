export class Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;

    constructor(theStreet: string, theCity: string, theState: string, theCountry: string, theZipCode: string) {
        this.street = theStreet;
        this.city = theCity;
        this.state = theState;
        this.country = theCountry;
        this.zipCode = theZipCode;
    }
}
