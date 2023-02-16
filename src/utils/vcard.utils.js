let vCardsJS = require('vcards-js');
const path = require('path');
const fs = require('fs-extra');

function VCardCreate(data) {
    // This is your vCard instance, that
    // represents a single contact file
    let vCard = vCardsJS();
    console.log(data);
      
    vCard.firstName = data.firstName;
    vCard.lastName = data.lastName;
    vCard.organization = data.organization;
    vCard.title = data.title;
    vCard.email = data.email;
    vCard.workPhone = data.workPhone;
    vCard.photo.attachFromUrl(data.urlPhoto);
    vCard.url = data.url;
    vCard.note = data.note;

    // Create VCF folder
    fs.ensureDirSync(path.join(__dirname, '..', 'public', 'vcf'));
    
    const urlFile = path.join(__dirname, '..', 'public', 'vcf', `${data.id}.vcf`);
    
    // Save contact to VCF file
    vCard.saveToFile(urlFile);
}

module.exports = VCardCreate;