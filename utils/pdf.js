const PDFdocument = require('pdfkit');
const fs = require('fs');
const durationDate = require('./durationDate');

/*
here is a first version for generating a lease agreement contract in pdf format,
probably could be cleaner, but it works 
*/


const pdfGenerator = async (infos) => {
    const doc = new PDFdocument({
        font: 'Helvetica',
        size: 'A4',
        margins: {
            top: 10,
            bottom: 10,
            left: 5,
            right: 10
        }
    })


    ///////////first Page

    doc.image('./files/logo.png', {
        fit: [80, 80]
    })

    doc.moveDown(5)
    doc
        .fontSize(30)
        .text('CONTRAT DE BAIL', {
            align: 'center',
            bold: true
        })
    doc
        .fontSize(30)
        .text('LEASE AGREEMENT', {
            align: 'center',
            bold: true
        })

    let buildingName = "undefined"
    if (infos.building && infos.building.name)
        buildingName = infos.building.name


    let roomName = "undefined"
    if (infos.roomNumber)
        roomName = infos.roomNumber

    doc
        .fontSize(25)
        .text(`${buildingName} (${roomName})`, {
            align: 'center',
            bold: true
        })
    doc
        .fontSize(15)
        .text('Nous sommes ravis de vous accueillir', { align: 'center' })
        .text('We are very much looking forward to welcome you', { align: 'center' })


    // columns set up
    const colLeftPos = 80;
    const colTop = 400;
    const colWidth = 250;
    const colRightPos = colWidth;



    let owners;

    if (infos.building.company && infos.building.owners.length === 1) {
        owners = infos.building.company.name + ' & ' + infos.building.owners[0].fullname;
    } else if (infos.building.owners && infos.building.owners.length > 1) {
        owners = infos.building.owners[1].fullname + ' & ' + infos.building.owners[0].fullname;
    } else if (infos.building.owners) {
        owners = infos.building.owners[0].fullname
    } else {
        owners = "undefined"
    }


    let ownersAddressPart1 = 'undefined';
    if (infos.building.company && infos.building.company.addressStreet && infos.building.company.addressNumber)
        ownersAddressPart1 = infos.building.company.addressStreet + ' ' + infos.building.company.addressNumber;
    if (infos.building.owners && infos.building.owners.length > 1)
        ownersAddressPart1 = infos.building.addressStreet + ' ' + infos.building.addressNumber;
    if (infos.building.owners) {
        ownersAddressPart1 = 'Test street, 1';
    }

    let ownersAddressPart2 = 'undefined';
    if (infos.building.company && infos.building.company.addressPostCode && infos.building.company.addressCity && infos.building.company.addressCountry)
        ownersAddressPart2 = infos.building.company.addressPostCode + ' ' + infos.building.company.addressCity.toUpperCase() + ', ' + infos.building.company.addressCountry.toUpperCase();
    if (infos.building.owners && infos.building.owners.length > 1)
        ownersAddressPart2 = infos.building.addressPostalCode + ' ' + infos.building.addressCity.toUpperCase() + ', ' + infos.building.addressCountry.toUpperCase();
    if (infos.building.owners) {
        ownersAddressPart2 =  "10101 TestLand";
    }
    
    doc
        .fontSize(12)
        //////left column
        .text('Parties concernées : ', colLeftPos, colTop, { width: colWidth, align: 'left' })
        .text('Parts : ', colLeftPos, (colTop + 20), { width: colWidth, align: 'left' })
        .text('Le / La / Les Propriétaire(s)/ Bailleurs(s)', colLeftPos, (colTop + 60), { width: colWidth, align: 'left' })
        .text('Landlord(s)', colLeftPos, (colTop + 80), { width: colWidth, align: 'left' })
        .fillColor('#0070FF').fontSize(15)
        .text(`${owners}`, colLeftPos, (colTop + 100), { width: colWidth, align: 'left' })
    doc
        .fillColor('black').fontSize(12)
        .text(`${ownersAddressPart1}`, colLeftPos, (colTop + 140), { width: colWidth, align: 'left' })
        .text(`${ownersAddressPart2}`, colLeftPos, (colTop + 160), { width: colWidth, align: 'left' })



    let tenant = 'undefined';
    if (infos.tenants[0] && infos.tenants[0].fullname) tenant = infos.tenants[0].fullname;

    let tenantAddressPart1 = 'undefined';
    if (infos.tenants[0] && infos.tenants[0].addressStreet && infos.tenants[0].addressNumber)
        tenantAddressPart1 = infos.tenants[0].addressStreet + " " + infos.tenants[0].addressNumber

    let tenantAddressPart2 = "undefined";
    if (infos.tenants[0] && infos.tenants[0].addressPostalCode && infos.tenants[0].addressCity && infos.tenants[0].addressCountry)
        tenantAddressPart2 = infos.tenants[0].addressPostalCode + " " + infos.tenants[0].addressCity.toUpperCase() + ", " + infos.tenants[0].addressCountry.toUpperCase()




    /////right column
    doc
        .fillColor('black').fontSize(12)
        .text('Le/ La / Les Preneur(s)', colRightPos, (colTop + 60), { width: colWidth, align: 'right' })
        .text('Tenant(s)', colRightPos, (colTop + 80), { width: colWidth, align: 'right' })
        .fillColor('#0070FF').fontSize(15)
        .text(`${tenant}`, colRightPos, (colTop + 100), { width: colWidth, align: 'right' })
        .fillColor('black').fontSize(12)
        .text(`${tenantAddressPart1}`, colRightPos, (colTop + 140), { width: colWidth, align: 'right' })
        .text(`${tenantAddressPart2}`, colRightPos, (colTop + 160), { width: colWidth, align: 'right' })



    ////footer 

    let companyName = "undefined"
    if (infos.building.company && infos.building.company.name)
        companyName = infos.building.company.name


    let companyTva = 'undefined'
    if (infos.building.company && infos.building.company.tva)
        companyTva = infos.building.company.tva

    let contactEmail = "undefined";
    if (infos.building.company && infos.building.company.email)
        contactEmail = infos.building.company.email
    if (infos.building.owners && infos.building.owners.length > 1)
        contactEmail = infos.building.owners[0].email + "/" + infos.building.owners[1]


    const footer = (page) => {
        if (infos.building.company && infos.building.owners.length === 1) {
            doc
                .moveDown(10)
                .fillColor('#898989').fontSize(9)
                .text(`${companyName} - ${ownersAddressPart1}, ${ownersAddressPart2} - ${contactEmail}`, 95, 800, { align: 'center', width: "400" })
                .text(`BCE & N° TVA Intracommunautaire : ${companyTva} – Page ${page}/8`, 95, 812, { align: 'center', width: "400" })
        } else if (infos.building.owners && infos.building.owners.length > 1) {
            owners = infos.building.owners[1].fullname + ' & ' + infos.building.owners[0].fullname;
            ownersPhoneNumbers = infos.building.owners[0].phoneNumber + "/" + infos.building.owners[1].phoneNumber
            doc
                .moveDown(10)
                .fillColor('#898989').fontSize(9)
                .text(`${owners}  - ${ownersPhoneNumbers}  – Page ${page}/8 `, 95, 800, { align: 'center', width: "400" })

        } else if (infos.building.owners) {
            owners = infos.building.owners[0].fullname ;
            ownersPhoneNumbers = infos.building.owners[0].phoneNumber;
            doc
                .moveDown(10)
                .fillColor('#898989').fontSize(9)
                .text(`${owners}  - ${ownersPhoneNumbers}  – Page ${page}/8 `, 95, 800, { align: 'center', width: "400" })
        }
    }



    footer(1)

    ////////////// PAGE 2 
    doc
        .addPage()
        .image('./files/logo.png', {
            fit: [80, 80]
        })


        /// bail part 
        //----------- Left Column ------------------------------------------
        .fontSize(20)
        .text("POINTS-CLÉS / KEY POINTS", 25, 90, { bold: true })
        .fontSize(13)
        .text("Le Bail / The Lease", 25, 120)

    let data = [
        { label: "Date de démarrage / Start date" },
        { label: "Date de fin/ End date" },
        { label: "Soit une durée de (en mois)/ Duration (in months)" },
        { label: "Nom de référence de la propriété / Property name" },
        { label: "Chambre / Room" },
        { label: "Adresse / Address" },
        { label: "Code postal et ville / Post code and city" },
        { label: "Pays / Country" }

    ];

    const start = 150;
    const increment = 15;


    for (let i = 0; i < data.length; i++) {
        const { label } = data[i];
        const y = start + (increment * i)

        doc
            .fillColor('#898989').fontSize(10)
            .text("* " + label, 30, y, { align: "left" });
    }

    //----------- Right Column ------------------------------------------

    let startDate = "undefined"
    if (infos.tenants[0] && infos.tenants[0].contractStart)
        dateObj = new Date(infos.tenants[0].contractStart)
    options = { day: '2-digit', month: 'short', year: 'numeric' };
    startDate = dateObj.toLocaleDateString('en-GB', options);

    let endDate = "undefined"
    if (infos.tenants[0] && infos.tenants[0].contractEnd)
        dateObj = new Date(infos.tenants[0].contractEnd)
    endDate = dateObj.toLocaleDateString('en-GB', options)

    const duration = durationDate(startDate, endDate)

    let propertyName = "undefined"
    if (infos.building && infos.building.name)
        propertyName = infos.building.name

    const roomNumber = infos.roomNumber

    let buildingAddressPt1 = "undefined"
    if (infos.building && infos.building.addressCity && infos.building.addressNumber)
        buildingAddressPt1 = infos.building.addressStreet + ", " + infos.building.addressNumber

    let buildingAddressPt2 = "undefined"
    if (infos.building && infos.building.addressPostalCode && infos.building.addressCity)
        buildingAddressPt2 = infos.building.addressPostalCode + ' ' + infos.building.addressCity.toUpperCase()

    let buildingAddressPt3 = "undefined"
    if (infos.building && infos.building.addressCountry)
        buildingAddressPt3 = infos.building.addressCountry.toUpperCase()

    doc
        .fillColor("#0070FF")
        .fontSize(10)
        .text(`${startDate}`, 0, 150, { align: "right" })
        .text(`${endDate}`, 0, 165, { align: "right" })
        .text(`${duration}`, 0, 180, { align: "right" })
        .text(`${propertyName}`, 0, 195, { align: "right" })
        .text(`${roomNumber}`, 0, 210, { align: "right" })
        .text(`${buildingAddressPt1}`, 0, 225, { align: "right" })
        .text(`${buildingAddressPt2}`, 0, 240, { align: "right" })
        .text(`${buildingAddressPt3}`, 0, 255, { align: "right" })



    ///Financial Agreement
    //----------- Left Column ----------------------------------------------------------
    doc
        .fillColor('black').fontSize(13)
        .text("Les Conditions Financières / Financial Agreement", 25, 290)


    data = [
        { label: "Prix du loyer (€/mois) / Price (€/month)" },
        { label: "Prix des charges forfaitaires (€/mois) / Utilities charges (€/month)" },
        { label: "Charges incluses / Utilities included" },
        { label: "Charges excluses (responsabilité du preneur) / Utilities excluded (to be paid by the tenant" },
        { label: "Date de révision du loyer / Lease price review date" },
        { label: "Prix de la révision du loyer / Updated price" },
        { label: "Date du paiement du loyer / Payment date" },
        { label: "Mode de réglement / Means of payment" },
        { label: "Compte en banque pour les règlements / Bank account" },
        { label: "Dénomination du virement mensuel / Payment namung convention" }
    ]

    const start2 = 320;
    const increment2 = 15


    for (let i = 0; i < data.length; i++) {
        const { label } = data[i];
        const y = start2 + (increment2 * i)

        doc
            .fillColor('#898989').fontSize(10)
            .text("* " + label, 30, y, { align: "left" });
    }

    //----------- Right Column ----------------------------------------------------------


    let leasePrice = "undefined"
    if (infos.rent)
        leasePrice = infos.rent

    let charges = "undefined"
    if (infos.charges)
        charges = infos.charges

    let includedCharges = "undefined"
    if (infos.typeOfIncCharges) {
        includedCharges = infos.typeOfIncCharges.map((charge) => charge.type).join(", ");
    }

    let excludedCharges = "undefined"
    if (infos.typeOfExcCharges) {
        excludedCharges = infos.typeOfExcCharges.map((charge) => charge.type).join(", ")
    }


    let leasePriceReviewDate = "undefined";
    if (infos && infos.rentReview) {
        let dateObj = new Date(infos.rentReview);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        leasePriceReviewDate = dateObj.toLocaleDateString('fr-FR', options)
    }

    let bankAccount = "undefined";
    if (infos.building && infos.building.iban && infos.building.bic)
        bankAccount = "IBAN :" + infos.building.iban.toUpperCase() + "/ BIC :" + infos.building.bic.toUpperCase()

    let paymentNamingConvention = "undefined"
    if (infos.building && infos.building.name && infos.roomNumber && infos.tenants[0] && infos.tenants[0].fullname)
        paymentNamingConvention = infos.building.name + `(${infos.roomNumber})` + ' - ' + infos.tenants[0].fullname

    doc
        .fillColor("#0070FF")
        .fontSize(10)
        .text(`${leasePrice} €`, 0, 320, { align: "right" })
        .text(`${charges} €`, 0, 335, { align: "right" })
        .text(`${includedCharges}`, 0, 350, { align: "right" })
        .text(`${excludedCharges}`, 0, 365, { align: "right" })
        .text(`${leasePriceReviewDate}`, 0, 380, { align: "right" })
        .text('Indexation légale', 0, 395, { align: 'right' })
        .text('Le premier jour de chaque mois', 0, 410, { align: 'right' })
        .text('Virement bancaire ', 0, 425, { align: "right" })
        .text(`${bankAccount}`, 0, 440, { align: "right" })
        .text(`Mois - ${paymentNamingConvention}`, 0, 455, { align: "right" })


    ///Les Compteurs / Code(s)
    //----------- Left Column ----------------------------------------------------------
    doc
        .fillColor('black').fontSize(13)
        .text("Les compteurs / Code(s)", 25, 490)

    data = [
        { label: "Compteur Électrique / Electric meter" },
        { label: "Compteur Eau / Water meter" },
        { label: "Compteur Gaz / Gaz meter" },
        { label: "Code(s)" }
    ]

    const start3 = 520;
    const increment3 = 15


    for (let i = 0; i < data.length; i++) {
        const { label } = data[i];
        const y = start3 + (increment3 * i)

        doc
            .fillColor('#898989').fontSize(10)
            .text("* " + label, 30, y, { align: "left" });
    }

    //----------- right Column ----------------------------------------------------------

    let electricMeter = "N/A"
    if (infos.building.electricity)
        electricMeter = infos.building.electricity

    let waterMeter = "N/A"
    if (infos.building.water)
        waterMeter = infos.building.water

    let gazMeter = "N/A"
    if (infos.building.gaz)
        gazMeter = infos.building.gaz

    let doorCode = "N/A"
    if (infos.building.doorCode)
        doorCode = infos.building.doorCode


    doc
        .fillColor("#0070FF")
        .fontSize(10)
        .text(`${electricMeter}`, 0, 520, { align: "right" })
        .text(`${waterMeter}`, 0, 535, { align: "right" })
        .text(`${gazMeter}`, 0, 550, { align: "right" })
        .text(`${doorCode}`, 0, 565, { align: "right" })


    ///Le / La / Les Propriétaire(s) / Bailleur(s) / Gestionnaire(s) / owners
    //----------- Left Column ----------------------------------------------------------
    doc
        .fillColor('black').fontSize(13)
        .text("Le / La / Les Propriétaire(s) / Bailleur(s) / Gestionnaire(s) / Landlords", 25, 590)

    data = [
        { label: "Propriétaire(s) et Bailleur(s) / Owners" },
        { label: "Gestionnaire(s) / Landlors" },
        { label: "E-mail" },
        { label: "Téléphone / Phone" }
    ]

    const start4 = 620;
    const increment4 = 15


    for (let i = 0; i < data.length; i++) {
        const { label } = data[i];
        const y = start4 + (increment4 * i)

        doc
            .fillColor('#898989').fontSize(10)
            .text("* " + label, 30, y, { align: "left" });
    }

    //----------- Right Column ----------------------------------------------------------

    let landlords = "undefined"
    if (infos.building.managers && infos.building.managers[0] && infos.building.managers[1])
        landlords = infos.building.managers[0].fullname + " / " + infos.building.managers[1].fullname

    let landlorsPhoneNumber = "undefined"
    if (infos.building.managers && infos.building.managers[0] && infos.building.managers[1] && infos.building.managers[0].phoneNumber && infos.building.managers[1].phoneNumber)
        landlorsPhoneNumber = infos.building.managers[0].phoneNumber + " / " + infos.building.managers[1].phoneNumber



    doc
        .fillColor("#0070FF")
        .fontSize(10)
        .text(`${owners}`, 0, 620, { align: "right" })
        .text(`${landlords}`, 0, 635, { align: "right" })
        .text(`${contactEmail}`, 0, 650, { align: "right" })
        .text(`${landlorsPhoneNumber}`, 0, 665, { align: "right" })



    footer(2)


    ////////////// PAGE 3 
    doc
        .addPage()
        .image('./files/logo.png', {
            fit: [80, 80]
        })
    ///Le / La / Les Preneur(s) / Tenant(s)
    //----------- Left Column ----------------------------------------------------------
    doc
        .fillColor('black').fontSize(13)
        .text("Le / La / Les Preneur(s) / Tenant(s)", 25, 90)

    data = [
        { label: "Le preneur / Tenant" },
        { label: "Date de naissance / Birthdate" },
        { label: "N. d'identité / ID #" },
        { label: "Date d'arrivée / Arrival date" },
        { label: "Habitation / Room" },
        { label: "Garantie locative / Deposit" },
        { label: "E-mail" },
        { label: "Téléphone / Phone" }
    ]

    const start5 = 110;
    const increment5 = 15


    for (let i = 0; i < data.length; i++) {
        const { label } = data[i];
        const y = start5 + (increment5 * i)

        doc
            .fillColor('#898989').fontSize(10)
            .text("* " + label, 30, y, { align: "left" });
    }
    //----------- Right Column ----------------------------------------------------------

    let tenantBirthdate = "undefined"
    if (infos.tenants[0] && infos.tenants[0].birthdate)
        dateObj = new Date(infos.tenants[0].birthdate)
    tenantBirthdate = dateObj.toLocaleDateString('fr-FR', options)

    let tenantIdentityNumber = "undefined"
    if (infos.tenants[0] && infos.tenants[0].idNumber)
        tenantIdentityNumber = infos.tenants[0].idNumber

    let arrivalDate = "undefined"
    if (infos.tenants[0] && infos.tenants[0].arrival)
        dateObj = new Date(infos.tenants[0].arrival)
    arrivalDate = dateObj.toLocaleDateString('fr-FR', options)

    let deposit = "undefined"
    if (infos.tenants[0] && infos.tenants[0].deposit)
        deposit = infos.tenants[0].deposit

    let tenantEmail = "undefined"
    if (infos.tenants[0] && infos.tenants[0].email)
        tenantEmail = infos.tenants[0].email


    let tenantPhone = "undefined"
    if (infos.tenants[0] && infos.tenants[0].phoneNumber)
        tenantPhone = infos.tenants[0].phoneNumber
    doc
        .fillColor("#0070FF")
        .fontSize(10)
        .text(`${tenant}`, 0, 110, { align: 'right' })
        .text(`${tenantBirthdate}`, 0, 125, { align: 'right' })
        .text(`${tenantIdentityNumber}`, 0, 140, { align: 'right' })
        .text(`${arrivalDate}`, 0, 155, { align: "right" })
        .text(`${roomName}`, 0, 170, { align: 'right' })
        .text(`${deposit} €`, 0, 185, { align: 'right' })
        .text(`${tenantEmail}`, 0, 200, { align: 'right' })
        .text(`${tenantPhone}`, 0, 215, { align: "right" })


    footer(3)



    ////////////// PAGE 4

    doc
        .addPage()
        .image('./files/logo.png', {
            fit: [80, 80]
        })

    ///termes utilisés 
    //----------- Left Column ----------------------------------------------------------
    doc
        .fillColor('black').fontSize(20)
        .text("DÉFINITION DES TERMES UTILISÉS / COMMONS TERMS", 25, 90)
        .fontSize(13)
        .text("Termes Utilisés / Commons Terms", 25, 120)

    data = [
        { label: `"Le Bailleur" / "Landlord` },
        { label: `"Le Prenneur / "Tenant"` },
        { label: `"N/A"` }

    ]
    const start6 = 150;
    const increment6 = 15


    for (let i = 0; i < data.length; i++) {
        const { label } = data[i];
        const y = start6 + (increment6 * i)

        doc
            .fillColor('#898989').fontSize(10)
            .text("* " + label, 30, y, { align: "left" });
    }
    //----------- Right Column ----------------------------------------------------------

    doc
        .fillColor("#0070FF")
        .fontSize(10)
        .text(`${owners}`, 0, 150, { align: "right" })
        .text(`${tenant}`, 0, 165, { align: "right" })
        .text(`Non Applicable`, 0, 180, { align: "right" })


    ///Conditions particulières
    let specificsConditions = "N/A"
    if (infos.tenants[0] && infos.tenants[0].specialConditions)
        specificsConditions = infos.specialConditions
    doc
        .fillColor('black').fontSize(20)
        .text("CONDITIONS PARTICULIÉRES/SPECIFICS CONDITIONS", 25, 230)
        .fillColor("#0070FF")
        .fontSize(10)
        .text(`${specificsConditions}`, 25, 270, { align: "left", width: "450" })


    ///Bon pour accord

    const currentDate = new Date();
    const dateOfTheDay = currentDate.toLocaleDateString('fr-FR', options);

    doc
        .fillColor('black').fontSize(20)
        .text("BON POUR ACCORD / GOOD FOR AGREEMENT", 25, 410)
        .fontSize(10)
        .text("La signature des présentes emporte acceptation des Conditions Générales.", 25, 440)
        .text('The signing of these presents acceptance of the General Conditions.', 25, 455)
        .text(`"Fait à Bruxelles, en deux (2) exemplaires originaux." / "Created in Brussels, in two (2) original copies."`, 25, 490)
        .text(`${dateOfTheDay}`, 25, 520, { oblique: "true" })
        .fontSize(15)
        .text(`${owners}`, 80, 590)
        .text(`${tenant}`, 380, 590)
        .fontSize(10)
        .text('(signature)', 150, 610)
        .text('(signature)', 400, 610)


    footer(4)

    ////////////// PAGE 5

    doc
        .addPage()
        .image('./files/logo.png', {
            fit: [80, 80]
        })

        ///CONDITIONS GÉNÉRALES / GENERAL CONDITIONS
        .fillColor('black').fontSize(20)
        .text("CONDITIONS GÉNÉRALES / GENERAL CONDITIONS", 25, 90)

    //----------- Left Column ----------------------------------------------------------

    const leftOptions = { width: 250, align: "left" }
    doc
        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 1 - ", 10, 130, { leftOptions, continued: true })
        .fillColor("black").text("DESCRIPTION & ÉTAT")
        .fillColor('#898989').fontSize(10)
        .text(`Le bailleur donne en location au preneur une chambre dans le bien repris dans la partie "Points-Clés" de ce document, en page 2. `, 10, 150, leftOptions)
        .text(`Le preneur indique qu’il a visité attentivement le bien et qu’il n’en réclame pas plus ample description. Il est déclaré que le bien est délivré en bon état d’entretien, de sécurité, de salubrité et d’habitabilité. Il sera dressé au début du bail un état des lieux détaillé des parties privatives et communes qui sera annexé au présent contrat et signé par les deux parties.`, 10, 190, leftOptions)
        .text(`Le preneur accepte la chambre et la maison dans l’état où elles se trouvent et s’engage à ne réclamer aucune modification et aucun équipement supplémentaire.`, 10, 280, leftOptions)
        .text(`Le bailleur se réserve le droit de modifier la chambre assignée jusqu’à l’arrivée du preneur.`, 10, 320, leftOptions)

    doc
        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 2 - ", 10, 360, { ...leftOptions, continued: true })
        .fillColor("black").text("DURÉE, FIN, PRÉAVIS, RUPTURE & RENOUVELLEMENT", leftOptions)
        .fillColor('#898989').fontSize(12).text("2.1 - ", 10, 400, { continued: true })
        .fillColor("black").text("DURÉE")
        .fillColor('#898989').fontSize(10)
        .text(`La durée du bail (date de début et date de fin) est définie dans la partie "Points-Clés".`, 10, 420, leftOptions)
        .text(`La location démarre et se termine aux dates indiquées dans ce contrat et ne pourront être modifiées sans l’accord écrit du bailleur.`, 10, 450, leftOptions)

        .fillColor('#898989').fontSize(12).text("2.2 - ", 10, 500, { continued: true })
        .fillColor("black").text("FIN DE BAIL")
        .fillColor('#898989').fontSize(10)
        .text(`La location se termine le dernier jour du mois et la chambre doit être libérée et conforme à l’état des lieux d’entrée pour 11h.`, 10, 520, leftOptions)


        .fillColor('#898989').fontSize(12).text("2.3 - ", 10, 570, { continued: true })
        .fillColor("black").text("FIN DE BAIL ANTICIPÉE")
        .fillColor('#898989').fontSize(10)
        .text(`Le preneur pourra mettre fin au bail à tout moment moyennant un préavis de 6 semaines notifiés par courrier ou par e-mail.`, 10, 590, leftOptions)
        .text(`Par ailleurs, des frais de dossier pour rupture anticipée de 400 € s’appliqueront en cas de fin de bail anticipée. Ils seront réduits à 100 € si le preneur propose un.e remplaçant.e pour reprendre la durée du bail. Ce ou cette remplaçant.e doit être proposé.e au minimum trois semaines avant son départ. Passé ce délai, le bailleur retiendra les 400 € de la garantie locative. `, 10, 630, leftOptions)
        .text(`ll est important de noter que le bailleur se réserve le droit de refuser les candidatures proposées.`, 10, 720, leftOptions)


    //----------- Rigth Column ----------------------------------------------------------
    const rightOptions = { width: 250 }
    doc
        .fillColor('#898989').fontSize(12).text("2.4 - ", 330, 130, { ...rightOptions, continued: true })
        .fillColor("black").text("RÉSILIATION POUR FAUTE")
        .fillColor('#898989').fontSize(10)
        .text(`La sous-location est strictement interdite pour des raisons d’assurance et de responsabilité. En l’absence d’un accord écrit du bailleur, l’entièreté de la garantie locative sera retenue et le contrat de bail pourra être rompu par Le bailleur sans préavis. `, 330, 150, leftOptions)

        .fillColor('#898989').fontSize(12).text("2.5 - ", 330, 220, { ...rightOptions, continued: true })
        .fillColor("black").text("RENOUVELLEMENT")
        .fillColor('#898989').fontSize(10)
        .text(`Si le preneur souhaite renouveler son contrat, il devra le signaler au minimum deux mois avant son départ. Dans le cas contraire, les chambres sont relouées rapidement et ne seront peut-être plus disponibles.`, 330, 240, leftOptions)
        .text(`Si le bail est prolongé, le preneur ne pourra louer la chambre que pour une durée totale strictement inférieure à trois ans.`, 330, 300, leftOptions)
        .text(`Le bailleur se réserve le droit de ne pas renouveler le bail.`, 330, 340, leftOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 3 - ", 330, 380, { ...rightOptions, continued: true })
        .fillColor("black").text("DESTINATION DU BIEN", rightOptions)

        .fillColor('#898989').fontSize(10)
        .text(`Le preneur reconnait que la location de sa chambre est réservée à une seule personne. Il est toléré que, de manière exceptionnelle, le preneur puisse inviter une personne de confiance dans le respect des autres resident.es. En aucun cas ceci ne devra devenir une habitude. En cas de non-respect de cette règle, le prix du loyer sera multiplié par deux pour couvrir les charges additionnelles subies par le bailleur.`, 330, 400, rightOptions)
        .text(`Le preneur doit affecter les lieux à usage d’habitation et ne peut en aucun cas y exercer une activité professionnelle et/ou un commerce ni déduire, d’une quelconque façon, les loyers et charges de ses revenus.En cas de non-respect de cette obligation, le preneur assumera seul, à la décharge du bailleur, les éventuelles conséquences fiscales.`, 330, 500, rightOptions)
        .text(`Le bien est destiné à usage de résidence principale de l’occupant. La législation en matière de bail de résidence principale est donc applicable au présent bail. Le preneur pourra se domicilier à la commune concernée et informera le bailleur de sa démarche.`, 330, 590, rightOptions)
        .text(`Dans tous les cas, les occupants de « l’habitat partagé » constituent un seul ménage et seront repris sur la même composition de ménage. Un ménage peut être constitué de personnes n’ayant aucun lien de parenté entre elles.`, 330, 660, rightOptions)



    footer(5)

    //////// PAGE 6 
    doc
        .addPage()
        .image('./files/logo.png', {
            fit: [80, 80]
        })

    ////////// Left Column

    doc
        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 4 - ", 10, 90, { ...leftOptions, continued: true })
        .fillColor("black").text("LOYER")
        .fillColor('#898989').fontSize(10)
        .text(`Le loyer mensuel de la chambre est repris dans la partie "Points-Clés".`, 10, 110, leftOptions)
        .text(`Il est majoré d’une provision telle que précisée dans l’article « Charges Communes et Consommations Privées ».`, 10, 140, leftOptions)
        .text(`Le loyer et le forfait de charges locatives sont payables par anticipation avant le premier de chaque mois, par virement bancaire sur le compte indiqué en page 2.`, 10, 180, leftOptions)
        .text(`Ce montant comprend le mobilier fourni pour une valeur équivalente à 5% du loyer mensuel.`, 10, 220, leftOptions)
        .text(`Le bailleur pourra demander l’indexation du loyer au maximum une fois par an, à la date d’anniversaire de l'entrée en vigueur du bail et sur demande écrite de la partie intéressée (par e-mail), conformément à la formule suivante (loyer mensuel de base x indice santé). L'indice santé est défini par la Région.`, 10, 250, leftOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 5 - ", 10, 340, { ...leftOptions, continued: true })
        .fillColor("black").text(" RETARD DE PAIEMENT & PÉNALITE")
        .fillColor('#898989').fontSize(10)
        .text(`Dans tous les cas, si le paiement est enregistré sur le compte après le 8 du mois, un intérêt de 10% sera appliqué et réclamé en plus de 40 € forfaitaires de frais de dossier. Au-delà de 30 jours de retard, une pénalité de 500 € sera appliquée et une procédure d’éviction sera lancée. Tous les frais juridiques engagés par le bailleur seront dus par le preneur. `, 10, 380, leftOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 6 - ", 10, 480, { ...leftOptions, continued: true })
        .fillColor("black").text("GARANTIE LOCATIVE")
        .fillColor('#898989').fontSize(10)
        .text(`En vue d’assurer le respect des obligations, le preneur constitue une garantie locative comme repris dans la partie "Points-Clés".`, 10, 510, leftOptions)
        .text(`La garantie locative sera versée sur le compte bancaire du bailleur. `, 10, 550, leftOptions)
        .text(`La première moitié du montant sera versée le jour de la signature du contrat. Ce dernier ne deviendra effectif qu’à partir du moment où la garantie locative aura bien été reçue.`, 10, 580, leftOptions)
        .text(`La seconde moitié sera versée pour le jour du début du contrat, comme indiqué en page 2.`, 10, 630, leftOptions)
        .text(`Le contrat sera rendu caduc si le premier versement de la garantie locative n’a pas été effectué dans les 48h après la signature du contrat. Il sera également rendu caduc si le deuxième versement de la garantie locative n’a pas été effectué lors de l’emménagement.`, 10, 660, leftOptions)


        ////////// Right Column
        .text(`En cas d’annulation du contrat de la part du preneur, la garantie locative ne sera pas restituée au preneur pour dédommager le bailleur du vide locatif engendré par la rupture. `, 330, 110, rightOptions)
        .text(`La garantie sera libérée sur production de l’accord des parties pour autant que toutes les obligations du preneur énumérées dans ce document aient été respectées. Le bailleur se réserve le droit de déduire un montant lié aux préjudices causés : celui-ci peut être total, si nécessaire.`, 330, 160, rightOptions)
        .text(`La garantie locative ne pourra pas être affectée par le preneur au paiement des loyers et charges.`, 330, 240, rightOptions)
        .text(`Si la réservation de la chambre a été faite en ligne (avec paiement de la garantie locative), le preneur pourra en vérifier la conformité pendant un délai de 48 heures.Au-delà de 48 heures, le contrat sera considéré comme confirmé et approuvé pour la durée signifiée.`, 330, 270, rightOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 7 - ", 330, 350, { ...rightOptions, continued: true })
        .fillColor("black").text("GARANTIE LOCATIVE")
        .fillColor('#898989').fontSize(10)
        .text(`Les charges locatives de l’immeuble dues par le preneur, à raison de sa quote-part, comprennent les frais de consommation d’eau, de gaz, d’électricité, de chauffage, de télécommunications (TV et internet), l’assurance avec abandon de recours, l’entretien annuel de la chaudière, du boiler et de la cheminée. La quote-part des charges communes dues par le preneur se calculera sur base d’une provision, payable en même temps que le loyer. Cette provision est calculée sur base d’une utilisation normale en bon père de famille du bien loué. S’il s’avérait que les relevés communiqués au moins une fois par an par le propriétaire montrent une consommation anormalement élevée des différentes charges locatives, le propriétaire pourra augmenter immédiatement le montant du forfait sur base de la différence entre le forfait versé et les charges réelles. `, 330, 370, rightOptions)
        .text(`Les charges d’entretien de l’immeuble dues par le preneur, à raison de sa quote-part, comprennent les frais d’entretien des espaces communs et privés.`, 330, 580, rightOptions)
        .text(`Il est rappelé que ces services sont fournis par des sociétés tierces qui peuvent occasionnellement rencontrer des difficultés techniques. En cas de dysfonctionnement, le bailleur fera tout le nécessaire pour prendre contact avec les sociétés concernées afin de garantir un service continu. Le bailleur ne pourra être tenu responsable en cas de problèmes techniques.`, 330, 620, rightOptions)


    footer(6)

    //////// PAGE 7
    doc
        .addPage()
        .image('./files/logo.png', {
            fit: [80, 80]
        })

    ////------Left Column
    doc
        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 8 - ", 10, 90, { ...leftOptions, continued: true })
        .fillColor("black").text("ENTRETIEN ET RÉPARATION")
        .fillColor('#898989').fontSize(12)
        .text("8.1 - ", 10, 120, { ...leftOptions, continued: true })
        .fillColor("black").text("AGENT.E DE PROPRETÉ")
        .fillColor('#898989').fontSize(10)
        .text(`Si repris dans la partie "Points-Clés", l’Agent.e de Propreté exécutera ses prestations dans les espaces communs (uniquement). Toutes les pièces devront être accessibles et rangées le jour de son passage sous peine de ne pas pouvoir faire le nettoyage. Le preneur n’aura pas de recours possible dans le cas où l’Agent.e de Propreté ne pourrait pas exécuter son travail.`, 10, 140, leftOptions)
        .text(`Dans le cas où le preneur souhaiterait bénéficier du service de l’Agent.e de Propreté, par exemple pour un nettoyage intense le jour du départ, il devra en faire la demande au bailleur.`, 10, 230, leftOptions)

        .fillColor('#898989').fontSize(12)
        .text("8.2 - ", 10, 290, { ...leftOptions, continued: true })
        .fillColor("black").text("TRAVAUX ET MAINTENANCE")
        .fillColor('#898989').fontSize(10)
        .text(`Le preneur est tenu d’effectuer les travaux de menu entretien ainsi que les réparations locatives qui ne sont pas occasionnées par vétusté ou force majeure. Les travaux de menu entretien comprennent le remplacement des ampoules et des piles, le remplacement de la vaisselle, l'entretien des machines (mettre du sel dans le lave vaisselle, filtre de la hotte, etc.), le remplacement des planches de WC, les traitements de parasites divers ou de rongeurs, les réparations suite aux obstructions d’éviers, de douches, de lavabos et WC, le linge de lit et la literie détériorés.`, 10, 310, leftOptions)
        .text(`Le bailleur prendra à sa charge les grosses réparations à effectuer au bien loué, comprenant, entre autres, les réparations à la toiture et au gros œuvre, la peinture et l’entretien des menuiseries extérieures, ainsi que le coût d’achat, d’installation et de remplacement des détecteurs de fumée requis. Si l’exécution de grosses réparations s’impose, le preneur devra en aviser le bailleur immédiatement. Il devra subir ces travaux sans indemnité, quoique leur durée puisse dépasser quarante jours.`, 10, 450, leftOptions)

        .text("8.3 - ", 10, 580, { ...leftOptions, continued: true })
        .fillColor("black").text("EMBELLISSEMENTS ET TRANSFORMATIONS")
        .fillColor('#898989').fontSize(10)
        .text(`Le preneur ne doit en aucun cas modifier la disposition de l’appartement ni faire de trou (petit ou grand) dans les murs.`, 10, 600, leftOptions)
        .text(`Tous les travaux visant à embellir, améliorer ou transformer le bien ne pourront être exécutés que moyennant l’autorisation préalable et écrite du bailleur. `, 10, 640, leftOptions)

        .text("8.4 - ", 10, 690, { ...leftOptions, continued: true })
        .fillColor("black").text("SERRURE / CODE")
        .fillColor('#898989').fontSize(10)
        .text(`Si le preneur perd son code d’entrée, l’intervention du serrurier ou d’une personne compétente sera à la charge du preneur. Un prix forfaitaire de 80€ pour une intervention simple ou 150€ en cas de remplacement de la serrure sera appliqué.`, 10, 710, leftOptions)

        ////////// Right Column

        .text(`De même, dans le cas où le bien est équipé d’une serrure à clef, l’intervention du serrurier ou d’une personne compétente est très couteuse et les frais peuvent aller jusqu’à 1000€. En cas de perte de la clef un prix forfaitaire de 80€ sera appliqué (par clef). Le prix d’une intervention simple (remise d’un autre trousseau) sera de 80€. `, 330, 120, rightOptions)
        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 9 - ", 330, 210, { ...rightOptions, continued: true })
        .fillColor("black").text("ASSURANCES")
        .fillColor('#898989').fontSize(10)
        .text(`L’immeuble est assuré par le bailleur contre l’incendie, les dégâts des eaux, la tempête et la grêle, ainsi que les recours des tiers (voisins, etc.).`, 330, 230, rightOptions)
        .text(`Dans le cas où le preneur est responsable d'un incident, il devra prendre en charge la franchise et les éventuels frais de dossier.`, 330, 270, rightOptions)
        .text(`Le preneur reste libre d’assurer ses objets personnels. Ils ne sont pas assurés par le bailleur. Celui-ci ne peut être tenu responsable pour tout vol, perte, dégradation ou autre.`, 330, 310, rightOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 10 - ", 330, 370, { ...rightOptions, continued: true })
        .fillColor("black").text("IMPOSITIONS")
        .fillColor('#898989').fontSize(10)
        .text(`En Belgique, il y a une taxe communément appelée « précompte immobilier ». Cette charge est imputable uniquement au bailleur.`, 330, 390, rightOptions)
        .text(`Dans le cas ou l’État, la Région, la Province, la Commune ou toute autre autorité publique mettrait en application d’autres taxes, celles-ci seraient à la charge du preneur. `, 330, 430, rightOptions)
        .text(`Les personnes domiciliées recevront l’année suivant leur domiciliation une taxe communale pour les immondices (collecte et traitement des déchets ménagers) qui est variable d’une commune à l’autre (approximativement 70€). En aucun cas, le bailleur ne sera tenu responsable du non-paiement de la taxe.`, 330, 480, rightOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 11 - ", 330, 570, { ...rightOptions, continued: true })
        .fillColor("black").text("ÉTAT DES LIEUX")
        .fillColor('#898989').fontSize(12)
        .text("11.1 - ", 330, 590, { ...rightOptions, continued: true })
        .fillColor("black").text(" ÉTAT DES LIEUX D’ENTRÉE")
        .fillColor('#898989').fontSize(10)
        .text(`Le bailleur s’engage à dresser un état des lieux d’entrée. Le preneur bénéficie de 15 jours pour notifier ses remarques complémentaires. Passé ce délai, l’état des lieux proposé par le bailleur sera automatiquement accepté.`, 330, 610, rightOptions)

    footer(7)



    //////// PAGE 8
    doc
        .addPage()
        .image('./files/logo.png', {
            fit: [80, 80]
        })

        ////------Left Column

        .fillColor('#898989').fontSize(12)
        .text("11.2 - ", 10, 90, { ...leftOptions, continued: true })
        .fillColor("black").text("ÉTAT DES LIEUX DE SORTIE")
        .fillColor('#898989').fontSize(10)
        .text(`Le preneur doit, à l’échéance du bail, rendre le bien loué tel qu’il l’a reçu suivant l’état des lieux d’entrée.`, 10, 110, leftOptions)
        .text(`L’état des lieux de sortie est établi le jour du départ. `, 10, 140, leftOptions)
        .text(`Le constat d’état des lieux de sortie sera établi selon les mêmes modalités qu’à l’entrée.`, 10, 160, leftOptions)
        .text(`Il est rappelé que le preneur se doit de nettoyer sa chambre de fond en comble (nettoyage professionnel) pour éviter une retenue sur la garantie locative. `, 10, 190, leftOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 12 - ", 10, 240, { ...leftOptions, continued: true })
        .fillColor("black").text(" AFFICHAGES ET VISITES")
        .fillColor('#898989').fontSize(10)
        .text(`Pendant toute la durée du bail, le bailleur ou leurs délégués pourront visiter les parties communes à tout moment et ce, sans prévenir. Le bailleur pourra venir prendre des photos des parties privées dans le cadre d’une remise en location ou d’une mise en vente.`, 10, 260, leftOptions)
        .text(`En ce qui concerne les parties privées (chambres), le bailleur s’engage à demander rendez-vous au preneur au moins 48 heures à l’avance. `, 10, 320, leftOptions)
        .text(`En cas d’urgence (fuite, fumée, odeur toxique, etc.), le preneur autorise à tout moment l’entrée (et sans préavis) du bailleur ou de leurs délégués dans son espace privé afin d’assurer la sécurité de tous les résident.es. `, 10, 360, leftOptions)
        .text(`Deux mois avant la date d’échéance du présent bail ou de la date d’expiration du terme fixé, le preneur devra tolérer des visites. Le bailleur s’engage à prévenir le preneur au moins 24 heures à l’avance. Ceci est aussi valable en cas de mise en vente du bien. `, 10, 430, leftOptions)
        .text(`Le bailleur est également habilité à prendre rendez-vous avec le preneur dans le but de contrôler la bonne exécution des obligations du preneur et cela en tenant compte de la vie privée de ce dernier.`, 10, 490, leftOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 13 - ", 10, 550, { ...leftOptions, continued: true })
        .fillColor("black").text("CHARTE DE L’HABITAT PARTAGÉ")
        .fillColor('#898989').fontSize(10)
        .text(`Dans le cas d'un bien partagé, le bailleur pourra mettre en place une charte de l’habitat partagé. Cette charte devra être respectée par le preneur et fait partie intégrante du présent contrat. Le preneur devra jouir des lieux loués en bon père de famille et conformément aux dispositions de la Charte. `, 10, 590, leftOptions)
        .text(`Les animaux domestiques ne sont pas autorisés sauf accord écrit du bailleur.  `, 10, 670, leftOptions)

        //////////---------- Right Column

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 14 - ", 330, 90, { ...rightOptions, continued: true })
        .fillColor("black").text("DOMICILIATION")
        .fillColor('#898989').fontSize(10)
        .text(`Le preneur, compte tenu de la nature de « l’habitat partagé », est libre de se domicilier ou pas à l’adresse du bien. En se domiciliant, il accepte de faire partie d’un ménage composé de personnes n’ayant aucun lien de parenté entre elles. Le propriétaire ne pourra pas être tenu pour responsable des conséquences qui pourraient en découler.`, 330, 110, rightOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 15 - ", 330, 210, { ...rightOptions, continued: true })
        .fillColor("black").text("COMMUNICATION")
        .fillColor('#898989').fontSize(10)
        .text(`Toutes les notifications du preneur doivent être faites par lettre recommandée (le cachet de la poste faisant foi de l’envoi dans le délai imparti).`, 330, 230, rightOptions)
        .text(`D’autres moyens de communication tels que les e-mails seront considérés comme valables.`, 330, 270, rightOptions)
        .text(`Le bailleur pourra également contacter le preneur par d’autres réseaux tels que WhatsApp.`, 330, 300, rightOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 16 - ", 330, 340, { ...rightOptions, continued: true })
        .fillColor("black").text("SÉCURITÉ PAR VIDÉOSURVEILLANCE")
        .fillColor('#898989').fontSize(10)
        .text(`Pour des raisons de sécurité, le bien est surveillé par un système de caméras de surveillance (à l’entrée et aux extérieurs).`, 330, 380, rightOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 17 - ", 330, 430, { ...rightOptions, continued: true })
        .fillColor("black").text("DROIT À L’IMAGE")
        .fillColor('#898989').fontSize(10)
        .text(`Le preneur autorise le bailleur à exploiter son image dans le cadre de sa communication sous quelque forme que ce soit à titre gratuit (exemple : publication d’un poste sur Facebook ou d’autres réseaux sociaux). Les droits ne pourront être cédés à un tiers sans autorisation écrite du preneur. `, 330, 450, rightOptions)

        .fillColor('#898989').fontSize(12)
        .text("ARTICLE 18 - ", 330, 540, { ...rightOptions, continued: true })
        .fillColor("black").text("JURIDICTION")
        .fillColor('#898989').fontSize(10)
        .text(`Seuls les tribunaux du lieu où se trouve le bien sont compétents pour trancher tout litige opposant le bailleur et le preneur. `, 330, 570, rightOptions)

    footer(8)

    let tenantContractName = infos.tenants[0].firstname + infos.tenants[0].lastname

    doc.pipe(fs.createWriteStream(`/Users/jiacintobranducci/Documents/STAGE/leaseAgreement/${tenantContractName}Contract.pdf`));

    doc.end()
}

module.exports = pdfGenerator