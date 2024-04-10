// For images
import crypto from 'crypto'
import path from 'path'

import GridFsStorage from 'multer-gridfs-storage' 
import mongoose from 'mongoose' 
import multer from 'multer' 

let gfs 

const storage = new GridFsStorage({
    url: mongoURI,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
      // Add bites to file name to avoid naming collisions
      return new Promise((resolve, reject) => {
        // use the crypto package to generate some random hex bytes
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err)
          }
          // turn the random bytes into a string and add the file extention at the end of it (.png or .jpg)
          // this way our file names will not collide if someone uploads the same file twice
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'images',
          }
          // resolve these properties so they will be added to the new file document
          resolve(fileInfo);
        })
      })
    },
  })




