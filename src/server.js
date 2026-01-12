const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve assets explicitly if needed (though static middleware above covers it)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Route for the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/index.html'));
});

// Route for the roadmap
app.get('/roadmap', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/roadmap.html'));
});

// Route for infographics pages
app.get('/infografico/:id', (req, res) => {
    const file = path.join(__dirname, `src/pages/${req.params.id}.page.html`);
    res.sendFile(file, (err) => {
        if (err) {
            res.status(404).send('Página não encontrada');
        }
    });
});

// Sitemap and Robots (handled by static or specific routes if dynamic)
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Fallback for Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app; // For Vercel
