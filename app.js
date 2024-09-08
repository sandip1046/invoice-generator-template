const express = require('express');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const handlebars = require('handlebars');

const app = express();
const PORT = 3000;

app.use(express.json());

// Load the HTML template
const templatePath = path.join(__dirname, 'invoiceTemplate.html');
const source = fs.readFileSync(templatePath, 'utf8');
const template = handlebars.compile(source);

// Endpoint to generate and download PDF invoice
app.post('/generate-invoice', (req, res) => {
    const invoiceData = req.body; // Get invoice data from request body

    // Render HTML with dynamic data
    const htmlContent = template(invoiceData);

    // Path where the PDF will be saved
    const pdfPath = path.join(__dirname, 'invoice.pdf');

    // Generate PDF from HTML and save to a file
    pdf.create(htmlContent).toFile(pdfPath, (err, result) => {
        if (err) {
            res.status(500).send('Error generating PDF');
            return;
        }

        // Send the generated PDF as a downloadable file
        res.download(pdfPath, 'invoice.pdf', (downloadErr) => {
            if (downloadErr) {
                res.status(500).send('Error downloading PDF');
            }

            // Optionally, delete the file after download to save disk space
            fs.unlinkSync(pdfPath);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const pdf = require('html-pdf');
// const handlebars = require('handlebars');

// const app = express();
// const PORT = 3000;

// app.use(express.json());

// // Load the HTML template
// const templatePath = path.join(__dirname, 'invoiceTemplate.html');
// const source = fs.readFileSync(templatePath, 'utf8');
// const template = handlebars.compile(source);

// // Endpoint to generate PDF invoice
// app.post('/generate-invoice', (req, res) => {
//     const invoiceData = req.body; // Get invoice data from request body

//     // Render HTML with dynamic data
//     const htmlContent = template(invoiceData);

//     // Generate PDF from HTML
//     pdf.create(htmlContent).toStream((err, stream) => {
//         if (err) {
//             res.status(500).send('Error generating PDF');
//             return;
//         }

//         res.setHeader('Content-type', 'application/pdf');
//         stream.pipe(res);
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
