const path = require('path');
require('dotenv').config();
const Enterprise = require(path.join(__dirname, '..', 'models', 'enterprise.model'));
const membership = require(path.join(__dirname, '..', 'models', 'membership.model'));
const nodemailer = require('nodemailer');
const MembershipEmails = require(path.join(__dirname, '..', 'emails', 'MembershipEmails.js'));
const ChangePasswordRequest = require(path.join(__dirname, '..', 'models', 'verifiers', 'changePasswordRequest.model'));
require('dotenv').config();

const agendaController = {};

const sendMembershipEmail = async (enterprise, daysMembership) => {
    const transporter = await nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            enterprise: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const messageHtml = MembershipEmails("https://res.cloudinary.com/syphhy/image/upload/v1674144822/image-removebg-preview_22_xfa4ss.png",
    process.env.FRONTEND_URL, 'Biznes', daysMembership, "A usted le quedan")

    await transporter.sendMail({
        from: `Biznes Empresa <${process.env.MAIL_USERNAME}>`,
        to: enterprise.email,
        subject: `Biznes - ${daysMembership} dias de membresia restantes!`,
        html: messageHtml
    })
};

agendaController.discountDays = async (req, res) => {
    try {

        const basicMembership = await membership.findOne({name: 'Básica'});

        const enterprises = await Enterprise.find({ "membership": { "$ne": basicMembership._id } });

        enterprises.forEach(async (enterprise) => {
            console.log(`${enterprise.name} tiene ${enterprise.daysMembership} días de membresía.`);

            const newDaysMembership = enterprise.daysMembership - 1;

            if(enterprise.daysMembership > 0) {
                await Enterprise.findByIdAndUpdate(enterprise._id, {
                    daysMembership: newDaysMembership
                })
            } else {
                await Enterprise.findByIdAndUpdate(enterprise._id, {
                    membership: [basicMembership._id]
                })
            }

            if(newDaysMembership === 30 || newDaysMembership === 15 || newDaysMembership === 7 || newDaysMembership === 3 || newDaysMembership === 1    ) {
                sendMembershipEmail(enterprise, newDaysMembership);
            }

        });

    } catch (error) {
        console.log(error);
    }
};

agendaController.deleteChangePasswordRequests = async (req, res) => {
    try {
        const requests = await ChangePasswordRequest.find({});

        requests.forEach(async (request) => {
            if(request.state !== 'in process') {
                await ChangePasswordRequest.findByIdAndDelete(request._id);
            }

            // Borramos las solicitudes que tengan más de 24 horas
            const now = new Date();
            const requestDate = new Date(request.createdAt);

            const difference = now.getTime() - requestDate.getTime();
            const differenceInHours = Math.round(difference / (1000 * 3600));

            if(differenceInHours >= 24) {
                await ChangePasswordRequest.findByIdAndDelete(request._id);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = agendaController;