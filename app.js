const express = require('express');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

const app = express();
const PORT = 3000;

app.use(express.json());

// Load the HTML template
const templatePath = path.join(__dirname, 'invoiceTemplate.html');
const source = fs.readFileSync(templatePath, 'utf8');
const template = handlebars.compile(source);

// Endpoint to generate PDF invoice
app.post('/generate-invoice', async (req, res) => {
    const invoiceData = req.body; // Get invoice data from request body

    // Render HTML with dynamic data
    const htmlContent = template(invoiceData);

    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Set the HTML content
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({ format: 'A4' });

        // Close browser
        await browser.close();

        // Set response headers to download PDF
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(pdfBuffer);
    } catch (err) {
        console.error('Error generating PDF:', err);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const puppeteer = require('puppeteer'); // Import Puppeteer so that we can use it to generate PDF
// const handlebars = require('handlebars'); // Import Handlebars so that we can use it to render HTML template

// const app = express();
// const PORT = 3000;

// app.use(express.json());

// // Load the HTML template
// const templatePath = path.join(__dirname, 'invoiceTemplate.html');
// const source = fs.readFileSync(templatePath, 'utf8');// Read the HTML template file synchronously
// const template = handlebars.compile(source);// Compile the HTML template using Handlebars to create a template function

// // Endpoint to generate PDF invoice
// app.post('/generate-invoice', async (req, res) => {
//     const invoiceData = req.body; // Get invoice data from request body

//     // Render HTML with dynamic data
//     const htmlContent = template(invoiceData);

//     try {
//         // Launch Puppeteer
//         const browser = await puppeteer.launch({
//             args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for running Puppeteer in Docker
//         });
//         const page = await browser.newPage();
        
//         // Set the HTML content
//         await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
//         // Generate PDF
//         const pdfBuffer = await page.pdf({ format: 'A4' });

//         // Close browser
//         await browser.close();

//         // Set response headers to download PDF
//         res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
//         res.setHeader('Content-Type', 'application/pdf');
//         res.send(pdfBuffer);
//     } catch (err) {
//         console.error('Error generating PDF:', err);
//         res.status(500).send('Error generating PDF');
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
