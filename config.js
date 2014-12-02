exports.port = 8000;
exports.upload_dir = './uploads';

exports.s3 = {
    key: process.env.key,
    secret: process.env.secret,
    bucket: 'stackovertube'
};

exports.s3_enabled = true;