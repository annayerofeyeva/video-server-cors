exports.port = 8000;
exports.upload_dir = './uploads';

exports.s3 = {
    key: process.env.aws_access_key_id,
    secret: process.env.aws_secret_access_key,
    bucket: 'stackovertube'
};

exports.s3_enabled = true;