const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

// Path to the build folder (use __dirname to get correct path even inside wwwroot)
const buildPath = path.join(__dirname, 'build');

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
