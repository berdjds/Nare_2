const fs = require('fs');
const path = require('path');

// Path to the translations file
const translationsFilePath = path.join(__dirname, '..', 'lib', 'translations.ts');

// Read the file content
let fileContent = fs.readFileSync(translationsFilePath, 'utf8');

// English translations to add
const englishTranslations = `      business: {
        title: "Business Travel",
        description: "Professional travel solutions for businesses"
      },
      outgoingPackages: {
        hero: {
          title: "International Tour Packages",
          subtitle: "Explore the world with our carefully curated travel experiences"
        }
      }`;

// Replace in English section
fileContent = fileContent.replace(
  `      business: {
        title: "Business Travel",
        description: "Professional travel solutions for businesses"
      }`,
  englishTranslations
);

// Armenian translations to add
const armenianTranslations = `      business: {
        title: "Գործնական Ճամփորդություն",
        description: "Պրոֆեսիոնալ ճամփորդական լուծումներ բիզնեսի համար"
      },
      outgoingPackages: {
        hero: {
          title: "Միջազգային Տուրիստական Փաթեթներ",
          subtitle: "Ուսումնասիրեք աշխարհը մեր մանրակրկիտ կազմակերպված ճամփորդական փորձառություններով"
        }
      }`;

// Replace in Armenian section
fileContent = fileContent.replace(
  `      business: {
        title: "Գործնական Ճամփորդություն",
        description: "Պրոֆեսիոնալ ճամփորդական լուծումներ բիզնեսի համար"
      }`,
  armenianTranslations
);

// Russian translations to add
const russianTranslations = `      business: {
        title: "Деловые Поездки",
        description: "Профессиональные решения для деловых путешествий"
      },
      outgoingPackages: {
        hero: {
          title: "Международные Туристические Пакеты",
          subtitle: "Исследуйте мир с нашими тщательно подобранными туристическими программами"
        }
      }`;

// Replace in Russian section
fileContent = fileContent.replace(
  `      business: {
        title: "Деловые Поездки",
        description: "Профессиональные решения для деловых путешествий"
      }`,
  russianTranslations
);

// Write the updated content back to the file
fs.writeFileSync(translationsFilePath, fileContent);

console.log('Successfully added missing outgoingPackages translations to all language sections.');
