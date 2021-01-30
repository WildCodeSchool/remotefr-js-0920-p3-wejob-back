const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const templateDir = path.resolve(__dirname, '..', 'templates');

const getTemplate = (templateName) => {
  const templateFile = `${templateName}.html`;
  const templatePath = path.join(templateDir, templateFile);
  const html = fs.readFileSync(templatePath, 'utf-8');
  return handlebars.compile(html);
}

module.exports = getTemplate;