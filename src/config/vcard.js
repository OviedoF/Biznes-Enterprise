let vCardsJS = require('vcards-js');
  
// This is your vCard instance, that
// represents a single contact file
let vCard = vCardsJS();
  
// Set contact properties
vCard.firstName = "James";
vCard.middleName = "Daniel";
vCard.lastName = "Smith";
vCard.organization = "GeeksforGeeks";
vCard.title = "Technical Writer";
vCard.email = "james@example.com";
vCard.cellPhone = "+1 (123) 456-789";
  
// Save contact to VCF file
vCard.saveToFile(`james.vcf`);