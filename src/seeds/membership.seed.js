const path = require('path');
const Membership = require(path.join('..', 'models', 'membership.model'));
const {v4} = require('uuid');
const fs = require('fs-extra');
require('dotenv').config();
const {basic, pro, vip} = require(path.join(__dirname, 'membershipPermissions'));

const principalMemberships = [{
    name: 'Básica',
    description: 'Membresía básica',
    price: 0,
    days: 0,
    priceWithOffer: 0,
    image: 'https://res.cloudinary.com/syphhy/image/upload/v1672427097/image-removebg-preview_18_yffpzs.png',
    permissions: basic,
    discount: 0
}, {
    name: 'BIznes Pro',
    description: 'Membresía Biznes Pro',
    price: 5990,
    days: 30,
    priceWithOffer: 0,
    image: 'https://res.cloudinary.com/syphhy/image/upload/v1672425779/image-removebg-preview_17_f6qfjh.png',
    permissions: pro,
    discount: 5
}, {
    name: 'Biznes VIP',
    description: 'Membresía Biznes VIP',
    price: 7990,
    days: 30,
    priceWithOffer: 0,
    image: 'https://res.cloudinary.com/syphhy/image/upload/v1672425779/image-removebg-preview_17_f6qfjh.png',
    permissions: vip,
    discount: 10
}]

const createMemberships = async () => {
    try {
        const count = await Membership.estimatedDocumentCount();

        if(count === 0){
            principalMemberships.forEach(async (membership) => {


            const membershipCreated = new Membership({
                name: membership.name,
                description: membership.description,
                price: membership.price,
                days: membership.days,
                priceWithOffer: membership.priceWithOffer,
                image: membership.image,
                permissions: membership.permissions,
                discount: membership.discount
            });

            await membershipCreated.save();

            console.log(membershipCreated.description + ' created.');
        })
        } else {

            Membership.find()
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = createMemberships;