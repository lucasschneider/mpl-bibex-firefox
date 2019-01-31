// If this is the patron edit frame
if (/cgi-bin\/koha\/members\/memberentry\.pl/.test(window.location)) {
  var inputs = document.querySelectorAll('input[type=text]'),
    cities = [document.getElementById('city'), document.getElementById('B_city'),
        document.getElementById('altcontactaddress3')],
    firstName = document.getElementById('firstname'),
    cardNum = document.getElementById('cardnumber'),
    userId = document.getElementById('userid');

  /**
   * Makes all text inout fields upper case except email fileds which are made
   * lower case
   */
  HTMLInputElement.prototype.correctTextCase = function () {
    if (/^email|emailpro|B_email$/.test(this.id)) {
      this.value = this.value.toLowerCase().replace(/\s{2,}/g, ' ').trim();
    } else {
      this.value = this.value.toUpperCase().replace(/\s{2,}/g, ' ').trim();
    }
  }

  /**
   * Creates shortcut "mad" for "MADISON WI" in the city/state text fields,
   * removes commas, abbreviates "Wisconsin" to "WI", trims whitespace, and
   * Appends " WI" to the city/state field if a two letter state code is not
   * present
   */
  HTMLInputElement.prototype.parseCityState = function () {
    // Create shortcut "mad" for "MADISON WI"
    if (/^mad$/i.test(this.value)) {
      this.value = "MADISON WI";
    }

    // Remove commas, abbrviate Wisconsin, trim whitespace
    this.value = this.value.replace(/,/, '').replace(/wisconsin/i,'WI')
        .replace(/\s{2,}/g, ' ').trim();

    // Append WI to the state if it is not provided
    if (!/ [A-Z]{2}$/.test(this.value) && this.value !== '') {
      this.value += " WI";
    }
  }

  /**
   *
   */
  HTMLInputElement.prototype.parseName = function () {
    var surname = document.getElementById('surname'),
      initials = document.getElementById('initials'),
      names,
      len;
    // Strip commas from string
    this.value = this.value.replace(/,/g, '');
    // Move suffix "JR" or "SR" to end of last name
    if (/ (S|J)R$/i.test(this.value)) {
      var suffix = this.value.substr(this.value.length-3, this.value.length);
      this.value = this.value.substr(0, this.value.length-3);
      surname.value += "," + suffix.toUpperCase();
    }
    if (!/^[ 	]+/.test(this.value) && initials) {
      names = this.value.split(' ');
      len = names.length;
      if (len > 1 && names[1] && /[A-Za-z]/.test(names[1][0]) && initials.value === "") {
        initials.value = names[1][0].toUpperCase();
      }
    }

    return false;
  }

  for (let input of inputs) {
    input.correctTextCase();
    input.addEventListener('blur', HTMLInputElement.prototype.correctTextCase);
  }

  for (let city of cities) {
    city.parseCityState();
    city.addEventListener('blur', HTMLInputElement.prototype.parseCityState);
  }

  if (firstName) {
    firstName.parseName();
    firstName.addEventListener('blur', HTMLInputElement.prototype.parseName);
  }

  /*** AUTOFILL OPAC LOGIN ***/
  if (cardNum != null) {
    cardNum.onblur = function() {
      if (this != null) {
  	  cardNum = this.value;
        if (cardNum.length === 14 && cardNum.substr(0,5) === "29078") {
          if (userId != null) {
            userId.value = cardNum;
          }
        }
  	  }
    }
  }

}