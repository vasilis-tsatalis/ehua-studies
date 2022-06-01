const docFilter = function(req, file, cb) {
    // Accept word documents only
    if (!file.originalname.match(/\.(docx|DOCX|pdf|PDF|xls|xlsx|XLS|XLSX|txt|TXT)$/)) {
        req.fileValidationError = 'Only valid types files are allowed!';
        return cb(new Error('Only word,excel,txt,pdf files are allowed!'), false);
    }
    cb(null, true);
};

exports.docFilter = docFilter;