"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require('multer'); // 加载nodemailer模块
const lowdb = require('../../../../db/lowdb/index');
// 文件上传
// 加载配置
const multerDefault = (fileType) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const storage = lowdb
        .read()
        .get('storage')
        .value();
    let fileFilter = (req, file, cb) => {
        // 过滤文件
        let ImgLimitType = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
        if (~ImgLimitType.indexOf(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    };
    let destinations = {
        'client': `static/upload/client-img-service/${year}/${month}`,
        'admin': `static/upload/admin-img-service/${year}/${month}`,
    };
    let storageFile = multer.diskStorage({
        // 文件保存路径
        destination: destinations[fileType],
        // 修改文件名称
        filename: (req, file, callback) => {
            let fileFormat = file.mimetype.split('/');
            callback(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
        }
    });
    let limits = {
        fileSize: 1 * 1024 * 1024
    };
    return multer({
        storage: storageFile,
        fileFilter,
        limits
    });
};
exports.default = multerDefault;
