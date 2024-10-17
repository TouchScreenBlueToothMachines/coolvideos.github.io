const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const uploadDir = 'uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Set up storage and file naming for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle file uploads
app.post('/upload', upload.single('videoFile'), (req, res) => {
    res.send('File uploaded successfully');
});

// Endpoint to get the list of videos
app.get('/videos', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            res.status(500).send('Unable to scan directory');
        } else {
            res.json(files);
        }
    });
});

// Serve video files
app.use('/videos', express.static(path.join(__dirname, uploadDir)));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
