# Installer Problem Child Analyzer

A simple React web app for GitHub Pages that lets you upload an XLSX file and analyzes:

- The installer (from column C) with the most jobs ("problem child")
- The name of the driver (column C of the first row)
- How many times "Customer Satisfaction" is written in column F
- Shows a list of all jobs with data from columns A to K

## Usage

1. Upload your `.xlsx` file (first sheet analyzed, columns A-K expected).
2. See the "problem child" installer, driver name, and Customer Satisfaction count.
3. Below, see a table of all jobs (columns A-K).

## Development

- Install dependencies:  
  `npm install`
- Run locally:  
  `npm start`
- Build for GitHub Pages:  
  `npm run build`

## Deploying to GitHub Pages

1. Push to a new repo.
2. Configure GitHub Pages to use the `gh-pages` branch or `/docs` folder.
3. Make sure `homepage` in `package.json` is set to `"."` or your repo URL.

---

Powered by [xlsx](https://github.com/SheetJS/sheetjs) and React.