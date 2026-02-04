// Fichier de traductions pour l'application Bismillah

const translations = {
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      restaurants: 'Restaurants',
      charter: 'Charte Halal',
      terms: 'Conditions d\'utilisation',
      login: 'Connexion',
      register: 'Inscription'
    },

    // Page Charte Halal
    charter: {
      title: 'Charte Éthique Halal',
      subtitle: 'Notre engagement pour une alimentation halal authentique',
      intro: 'Bismillah s\'engage à promouvoir une offre culinaire respectant une éthique halal stricte. Cette charte définit les critères que chaque restaurant partenaire doit respecter.',
      
      section1_title: '1. Viande Halal Exclusive',
      section1_content: 'Tous les restaurants référencés sur Bismillah doivent servir exclusivement de la viande halal. Cela signifie que l\'animal doit avoir été abattu selon les rites islamiques, par un musulman pratiquant, en invoquant le nom d\'Allah.',
      
      section2_title: '2. Absence de Boissons Alcoolisées',
      section2_content: 'Les établissements partenaires s\'engagent à ne proposer aucune boisson alcoolisée dans leur carte. Cette règle s\'applique à l\'ensemble de l\'offre du restaurant, sans exception.',
      
      section3_title: '3. Certification et Traçabilité',
      section3_content: 'Nous encourageons vivement les restaurants à obtenir une certification halal auprès d\'un organisme reconnu. Les restaurants certifiés bénéficient d\'un badge de confiance sur notre plateforme.',
      
      section4_title: '4. Transparence',
      section4_content: 'Chaque restaurant s\'engage à fournir des informations exactes sur ses pratiques, ses fournisseurs et ses certifications. Toute fausse déclaration entraînera une exclusion immédiate de la plateforme.',
      
      section5_title: '5. Contrôle et Vérification',
      section5_content: 'Bismillah se réserve le droit d\'effectuer des contrôles auprès des restaurants partenaires afin de vérifier le respect de cette charte. Les restaurants s\'engagent à coopérer pleinement lors de ces vérifications.',
      
      section6_title: '6. Engagement Communautaire',
      section6_content: 'En rejoignant Bismillah, les restaurants contribuent à offrir à la communauté musulmane une solution fiable pour trouver des établissements respectant leurs valeurs alimentaires.',
      
      conclusion: 'Cette charte reflète notre engagement envers la communauté et garantit une expérience culinaire conforme aux principes islamiques.',
      version: 'Version 1.0 - Janvier 2026'
    },

    // Page Conditions d'utilisation
    terms: {
      title: 'Conditions d\'Utilisation',
      subtitle: 'Modalités d\'utilisation de la plateforme Bismillah',
      
      section1_title: '1. Objet',
      section1_content: 'Les présentes conditions générales d\'utilisation (CGU) ont pour objet de définir les modalités et conditions d\'accès et d\'utilisation de la plateforme Bismillah par les restaurants partenaires.',
      
      section2_title: '2. Critères d\'Éligibilité',
      section2_intro: 'Pour être référencé sur la plateforme Bismillah, le restaurant s\'engage à :',
      section2_list: [
        'Servir exclusivement de la viande halal certifiée',
        'Ne pas proposer de boissons alcoolisées',
        'Respecter les normes d\'hygiène en vigueur',
        'Fournir des informations exactes et à jour'
      ],
      
      section3_title: '3. Certification Halal',
      section3_recognized_title: 'Certificateurs reconnus',
      section3_recognized_content: 'La plateforme reconnaît officiellement plusieurs organismes de certification. Les restaurants certifiés par un organisme non listé peuvent s\'inscrire, mais leur certification sera soumise à vérification.',
      section3_uncertified_content: 'Les restaurants sans certification peuvent s\'inscrire mais seront identifiés comme "non certifié" auprès des utilisateurs.',
      
      section4_title: '4. Obligations du Restaurant',
      section4_list: [
        'Maintenir les critères halal tout au long de son partenariat',
        'Informer immédiatement la plateforme de tout changement',
        'Renouveler ses certifications avant expiration',
        'Accepter les contrôles et vérifications de la plateforme'
      ],
      
      section5_title: '5. Responsabilités',
      section5_restaurant: 'Le restaurant est seul responsable des informations qu\'il fournit et de la conformité de son établissement aux critères halal.',
      section5_platform: 'La plateforme s\'efforce de vérifier les certifications mais ne peut garantir à 100% l\'authenticité de toutes les informations.',
      
      section6_title: '6. Sanctions',
      section6_list: [
        'Première infraction : avertissement',
        'Récidive : suspension temporaire',
        'Infraction grave : exclusion définitive'
      ],
      
      section7_title: '7. Données Personnelles',
      section7_content: 'Les données collectées sont traitées conformément au RGPD. Le restaurant dispose d\'un droit d\'accès, de rectification et de suppression de ses données.',
      
      section8_title: '8. Modification des CGU',
      section8_content: 'La plateforme se réserve le droit de modifier les présentes CGU. Les restaurants seront informés de toute modification.',
      
      section9_title: '9. Contact',
      section9_content: 'Pour toute question : contact@bismillah-app.be',
      
      version: 'Version 1.0 - Janvier 2026'
    },

    // Messages d'erreur inscription
    registration: {
      charterError: 'Votre établissement ne répond pas aux critères de notre charte éthique. Bismillah référence uniquement les restaurants respectant une politique halal stricte.',
      seeCharter: 'Consultez notre charte',
      seeTerms: 'Consultez nos conditions d\'utilisation'
    },

    // Footer
    footer: {
      rights: 'Tous droits réservés.',
      charter: 'Charte Éthique Halal',
      terms: 'CGU',
      slogan: 'Votre guide halal de confiance'
    }
  },

  en: {
    // Navigation
    nav: {
      home: 'Home',
      restaurants: 'Restaurants',
      charter: 'Halal Charter',
      terms: 'Terms of Use',
      login: 'Login',
      register: 'Register'
    },

    // Page Charte Halal
    charter: {
      title: 'Halal Ethics Charter',
      subtitle: 'Our commitment to authentic halal food',
      intro: 'Bismillah is committed to promoting a culinary offer that respects strict halal ethics. This charter defines the criteria that each partner restaurant must respect.',
      
      section1_title: '1. Exclusive Halal Meat',
      section1_content: 'All restaurants listed on Bismillah must serve exclusively halal meat. This means that the animal must have been slaughtered according to Islamic rites, by a practicing Muslim, invoking the name of Allah.',
      
      section2_title: '2. No Alcoholic Beverages',
      section2_content: 'Partner establishments commit to not offering any alcoholic beverages on their menu. This rule applies to the entire restaurant offer, without exception.',
      
      section3_title: '3. Certification and Traceability',
      section3_content: 'We strongly encourage restaurants to obtain halal certification from a recognized organization. Certified restaurants benefit from a trust badge on our platform.',
      
      section4_title: '4. Transparency',
      section4_content: 'Each restaurant commits to providing accurate information about its practices, suppliers and certifications. Any false statement will result in immediate exclusion from the platform.',
      
      section5_title: '5. Control and Verification',
      section5_content: 'Bismillah reserves the right to carry out checks on partner restaurants to verify compliance with this charter. Restaurants agree to fully cooperate during these verifications.',
      
      section6_title: '6. Community Commitment',
      section6_content: 'By joining Bismillah, restaurants contribute to offering the Muslim community a reliable solution to find establishments that respect their dietary values.',
      
      conclusion: 'This charter reflects our commitment to the community and guarantees a culinary experience in accordance with Islamic principles.',
      version: 'Version 1.0 - January 2026'
    },

    // Page Conditions d'utilisation
    terms: {
      title: 'Terms of Use',
      subtitle: 'Terms of use of the Bismillah platform',
      
      section1_title: '1. Purpose',
      section1_content: 'These general terms and conditions of use (GTU) aim to define the terms and conditions of access and use of the Bismillah platform by partner restaurants.',
      
      section2_title: '2. Eligibility Criteria',
      section2_intro: 'To be listed on the Bismillah platform, the restaurant commits to:',
      section2_list: [
        'Serve exclusively certified halal meat',
        'Not offer alcoholic beverages',
        'Comply with current hygiene standards',
        'Provide accurate and up-to-date information'
      ],
      
      section3_title: '3. Halal Certification',
      section3_recognized_title: 'Recognized certifiers',
      section3_recognized_content: 'The platform officially recognizes several certification organizations. Restaurants certified by an unlisted organization can register, but their certification will be subject to verification.',
      section3_uncertified_content: 'Restaurants without certification can register but will be identified as "uncertified" to users.',
      
      section4_title: '4. Restaurant Obligations',
      section4_list: [
        'Maintain halal criteria throughout the partnership',
        'Immediately inform the platform of any changes',
        'Renew certifications before expiration',
        'Accept platform controls and verifications'
      ],
      
      section5_title: '5. Responsibilities',
      section5_restaurant: 'The restaurant is solely responsible for the information it provides and for the compliance of its establishment with halal criteria.',
      section5_platform: 'The platform strives to verify certifications but cannot guarantee 100% the authenticity of all information.',
      
      section6_title: '6. Sanctions',
      section6_list: [
        'First offense: warning',
        'Repeat offense: temporary suspension',
        'Serious offense: permanent exclusion'
      ],
      
      section7_title: '7. Personal Data',
      section7_content: 'The data collected is processed in accordance with GDPR. The restaurant has a right of access, rectification and deletion of its data.',
      
      section8_title: '8. Modification of GTU',
      section8_content: 'The platform reserves the right to modify these GTU. Restaurants will be informed of any modification.',
      
      section9_title: '9. Contact',
      section9_content: 'For any questions: contact@bismillah-app.be',
      
      version: 'Version 1.0 - January 2026'
    },

    // Messages d'erreur inscription
    registration: {
      charterError: 'Your establishment does not meet the criteria of our ethical charter. Bismillah only lists restaurants that respect a strict halal policy.',
      seeCharter: 'See our charter',
      seeTerms: 'See our terms of use'
    },

    // Footer
    footer: {
      rights: 'All rights reserved.',
      charter: 'Halal Ethics Charter',
      terms: 'Terms',
      slogan: 'Your trusted halal guide'
    }
  },

  nl: {
    // Navigation
    nav: {
      home: 'Home',
      restaurants: 'Restaurants',
      charter: 'Halal Charter',
      terms: 'Gebruiksvoorwaarden',
      login: 'Inloggen',
      register: 'Registreren'
    },

    // Page Charte Halal
    charter: {
      title: 'Halal Ethisch Charter',
      subtitle: 'Onze toewijding aan authentiek halal voedsel',
      intro: 'Bismillah zet zich in voor het promoten van een culinair aanbod dat strikte halal-ethiek respecteert. Dit charter definieert de criteria waaraan elk partnerrestaurant moet voldoen.',
      
      section1_title: '1. Exclusief Halal Vlees',
      section1_content: 'Alle restaurants die op Bismillah vermeld staan, moeten uitsluitend halal vlees serveren. Dit betekent dat het dier volgens islamitische riten moet zijn geslacht, door een praktiserende moslim, met aanroeping van de naam van Allah.',
      
      section2_title: '2. Geen Alcoholische Dranken',
      section2_content: 'Partnerinstellingen verbinden zich ertoe geen alcoholische dranken op hun menu aan te bieden. Deze regel is van toepassing op het volledige restaurantaanbod, zonder uitzondering.',
      
      section3_title: '3. Certificering en Traceerbaarheid',
      section3_content: 'Wij moedigen restaurants sterk aan om een halal-certificering te verkrijgen van een erkende organisatie. Gecertificeerde restaurants profiteren van een vertrouwensbadge op ons platform.',
      
      section4_title: '4. Transparantie',
      section4_content: 'Elk restaurant verbindt zich ertoe nauwkeurige informatie te verstrekken over zijn praktijken, leveranciers en certificeringen. Elke valse verklaring leidt tot onmiddellijke uitsluiting van het platform.',
      
      section5_title: '5. Controle en Verificatie',
      section5_content: 'Bismillah behoudt zich het recht voor om controles uit te voeren bij partnerrestaurants om de naleving van dit charter te verifiëren. Restaurants stemmen ermee in om volledig mee te werken tijdens deze verificaties.',
      
      section6_title: '6. Gemeenschapsbetrokkenheid',
      section6_content: 'Door lid te worden van Bismillah dragen restaurants bij aan het bieden van een betrouwbare oplossing aan de moslimgemeenschap om etablissementen te vinden die hun voedingswaarden respecteren.',
      
      conclusion: 'Dit charter weerspiegelt onze toewijding aan de gemeenschap en garandeert een culinaire ervaring in overeenstemming met islamitische principes.',
      version: 'Versie 1.0 - Januari 2026'
    },

    // Page Conditions d'utilisation
    terms: {
      title: 'Gebruiksvoorwaarden',
      subtitle: 'Gebruiksvoorwaarden van het Bismillah-platform',
      
      section1_title: '1. Doel',
      section1_content: 'Deze algemene gebruiksvoorwaarden hebben tot doel de voorwaarden voor toegang tot en gebruik van het Bismillah-platform door partnerrestaurants te definiëren.',
      
      section2_title: '2. Toelatingscriteria',
      section2_intro: 'Om op het Bismillah-platform te worden vermeld, verbindt het restaurant zich ertoe:',
      section2_list: [
        'Uitsluitend gecertificeerd halal vlees te serveren',
        'Geen alcoholische dranken aan te bieden',
        'Te voldoen aan de geldende hygiënenormen',
        'Nauwkeurige en actuele informatie te verstrekken'
      ],
      
      section3_title: '3. Halal Certificering',
      section3_recognized_title: 'Erkende certificeerders',
      section3_recognized_content: 'Het platform erkent officieel verschillende certificeringsorganisaties. Restaurants die gecertificeerd zijn door een niet-vermelde organisatie kunnen zich registreren, maar hun certificering wordt onderworpen aan verificatie.',
      section3_uncertified_content: 'Restaurants zonder certificering kunnen zich registreren maar worden aangeduid als "niet gecertificeerd" bij gebruikers.',
      
      section4_title: '4. Verplichtingen van het Restaurant',
      section4_list: [
        'Halal-criteria handhaven gedurende het hele partnerschap',
        'Het platform onmiddellijk informeren over eventuele wijzigingen',
        'Certificeringen vernieuwen vóór vervaldatum',
        'Platformcontroles en -verificaties accepteren'
      ],
      
      section5_title: '5. Verantwoordelijkheden',
      section5_restaurant: 'Het restaurant is als enige verantwoordelijk voor de informatie die het verstrekt en voor de naleving van de halal-criteria door zijn etablissement.',
      section5_platform: 'Het platform streeft ernaar certificeringen te verifiëren, maar kan de authenticiteit van alle informatie niet 100% garanderen.',
      
      section6_title: '6. Sancties',
      section6_list: [
        'Eerste overtreding: waarschuwing',
        'Herhaling: tijdelijke schorsing',
        'Ernstige overtreding: definitieve uitsluiting'
      ],
      
      section7_title: '7. Persoonsgegevens',
      section7_content: 'De verzamelde gegevens worden verwerkt in overeenstemming met de AVG. Het restaurant heeft recht op toegang, rectificatie en verwijdering van zijn gegevens.',
      
      section8_title: '8. Wijziging van de Voorwaarden',
      section8_content: 'Het platform behoudt zich het recht voor deze voorwaarden te wijzigen. Restaurants worden geïnformeerd over elke wijziging.',
      
      section9_title: '9. Contact',
      section9_content: 'Voor vragen: contact@bismillah-app.be',
      
      version: 'Versie 1.0 - Januari 2026'
    },

    // Messages d'erreur inscription
    registration: {
      charterError: 'Uw etablissement voldoet niet aan de criteria van ons ethisch charter. Bismillah vermeldt alleen restaurants die een strikt halal-beleid respecteren.',
      seeCharter: 'Bekijk ons charter',
      seeTerms: 'Bekijk onze gebruiksvoorwaarden'
    },

    // Footer
    footer: {
      rights: 'Alle rechten voorbehouden.',
      charter: 'Halal Ethisch Charter',
      terms: 'Voorwaarden',
      slogan: 'Uw vertrouwde halal gids'
    }
  },

  de: {
    // Navigation
    nav: {
      home: 'Startseite',
      restaurants: 'Restaurants',
      charter: 'Halal-Charta',
      terms: 'Nutzungsbedingungen',
      login: 'Anmelden',
      register: 'Registrieren'
    },

    // Page Charte Halal
    charter: {
      title: 'Halal-Ethik-Charta',
      subtitle: 'Unser Engagement für authentisches Halal-Essen',
      intro: 'Bismillah setzt sich für die Förderung eines kulinarischen Angebots ein, das strenge Halal-Ethik respektiert. Diese Charta definiert die Kriterien, die jedes Partnerrestaurant einhalten muss.',
      
      section1_title: '1. Ausschließlich Halal-Fleisch',
      section1_content: 'Alle bei Bismillah gelisteten Restaurants müssen ausschließlich Halal-Fleisch servieren. Das bedeutet, dass das Tier nach islamischen Riten geschlachtet worden sein muss, von einem praktizierenden Muslim, unter Anrufung des Namens Allahs.',
      
      section2_title: '2. Keine alkoholischen Getränke',
      section2_content: 'Partnereinrichtungen verpflichten sich, keine alkoholischen Getränke auf ihrer Speisekarte anzubieten. Diese Regel gilt ausnahmslos für das gesamte Restaurantangebot.',
      
      section3_title: '3. Zertifizierung und Rückverfolgbarkeit',
      section3_content: 'Wir ermutigen Restaurants nachdrücklich, eine Halal-Zertifizierung von einer anerkannten Organisation zu erhalten. Zertifizierte Restaurants profitieren von einem Vertrauensabzeichen auf unserer Plattform.',
      
      section4_title: '4. Transparenz',
      section4_content: 'Jedes Restaurant verpflichtet sich, genaue Informationen über seine Praktiken, Lieferanten und Zertifizierungen bereitzustellen. Jede falsche Aussage führt zum sofortigen Ausschluss von der Plattform.',
      
      section5_title: '5. Kontrolle und Überprüfung',
      section5_content: 'Bismillah behält sich das Recht vor, Kontrollen bei Partnerrestaurants durchzuführen, um die Einhaltung dieser Charta zu überprüfen. Die Restaurants stimmen zu, bei diesen Überprüfungen vollständig zu kooperieren.',
      
      section6_title: '6. Gemeinschaftliches Engagement',
      section6_content: 'Durch den Beitritt zu Bismillah tragen Restaurants dazu bei, der muslimischen Gemeinschaft eine zuverlässige Lösung anzubieten, um Einrichtungen zu finden, die ihre Ernährungswerte respektieren.',
      
      conclusion: 'Diese Charta spiegelt unser Engagement für die Gemeinschaft wider und garantiert ein kulinarisches Erlebnis im Einklang mit islamischen Prinzipien.',
      version: 'Version 1.0 - Januar 2026'
    },

    // Page Conditions d'utilisation
    terms: {
      title: 'Nutzungsbedingungen',
      subtitle: 'Nutzungsbedingungen der Bismillah-Plattform',
      
      section1_title: '1. Zweck',
      section1_content: 'Diese Allgemeinen Nutzungsbedingungen (ANB) haben zum Ziel, die Bedingungen für den Zugang und die Nutzung der Bismillah-Plattform durch Partnerrestaurants zu definieren.',
      
      section2_title: '2. Zulassungskriterien',
      section2_intro: 'Um auf der Bismillah-Plattform gelistet zu werden, verpflichtet sich das Restaurant:',
      section2_list: [
        'Ausschließlich zertifiziertes Halal-Fleisch zu servieren',
        'Keine alkoholischen Getränke anzubieten',
        'Die geltenden Hygienestandards einzuhalten',
        'Genaue und aktuelle Informationen bereitzustellen'
      ],
      
      section3_title: '3. Halal-Zertifizierung',
      section3_recognized_title: 'Anerkannte Zertifizierer',
      section3_recognized_content: 'Die Plattform erkennt offiziell mehrere Zertifizierungsorganisationen an. Restaurants, die von einer nicht gelisteten Organisation zertifiziert sind, können sich registrieren, aber ihre Zertifizierung wird einer Überprüfung unterzogen.',
      section3_uncertified_content: 'Restaurants ohne Zertifizierung können sich registrieren, werden aber bei Nutzern als "nicht zertifiziert" gekennzeichnet.',
      
      section4_title: '4. Pflichten des Restaurants',
      section4_list: [
        'Halal-Kriterien während der gesamten Partnerschaft einhalten',
        'Die Plattform sofort über Änderungen informieren',
        'Zertifizierungen vor Ablauf erneuern',
        'Plattformkontrollen und -überprüfungen akzeptieren'
      ],
      
      section5_title: '5. Verantwortlichkeiten',
      section5_restaurant: 'Das Restaurant ist allein verantwortlich für die bereitgestellten Informationen und für die Einhaltung der Halal-Kriterien durch seine Einrichtung.',
      section5_platform: 'Die Plattform bemüht sich, Zertifizierungen zu überprüfen, kann aber die Authentizität aller Informationen nicht zu 100% garantieren.',
      
      section6_title: '6. Sanktionen',
      section6_list: [
        'Erster Verstoß: Warnung',
        'Wiederholung: vorübergehende Sperrung',
        'Schwerer Verstoß: dauerhafter Ausschluss'
      ],
      
      section7_title: '7. Persönliche Daten',
      section7_content: 'Die gesammelten Daten werden gemäß DSGVO verarbeitet. Das Restaurant hat ein Recht auf Zugang, Berichtigung und Löschung seiner Daten.',
      
      section8_title: '8. Änderung der ANB',
      section8_content: 'Die Plattform behält sich das Recht vor, diese ANB zu ändern. Restaurants werden über jede Änderung informiert.',
      
      section9_title: '9. Kontakt',
      section9_content: 'Bei Fragen: contact@bismillah-app.be',
      
      version: 'Version 1.0 - Januar 2026'
    },

    // Messages d'erreur inscription
    registration: {
      charterError: 'Ihre Einrichtung erfüllt nicht die Kriterien unserer ethischen Charta. Bismillah listet nur Restaurants, die eine strenge Halal-Politik respektieren.',
      seeCharter: 'Unsere Charta ansehen',
      seeTerms: 'Unsere Nutzungsbedingungen ansehen'
    },

    // Footer
    footer: {
      rights: 'Alle Rechte vorbehalten.',
      charter: 'Halal-Ethik-Charta',
      terms: 'AGB',
      slogan: 'Ihr vertrauenswürdiger Halal-Führer'
    }
  }
};

export default translations;
