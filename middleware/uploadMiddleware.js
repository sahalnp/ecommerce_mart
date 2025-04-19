import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, files, cb) {
        cb(null, 'public/uploads'); 
    },
    filename: function (req, files, cb) {

        cb(null, Date.now() + "-" + files.originalname);
    }
});

export const upload = multer({ storage });
