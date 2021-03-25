var DataStrata = require ('@datastrata/azure-blob-encryption-layer');
var fs = require ('fs');
var crypto = require ('crypto');

const main = async () => {
    try {
        const testFileName = 'test-file.txt';
        const outputFilePath = 'downloaded-test-file.txt';

        const fileStream = fs.createReadStream(testFileName);
        fileStream.on('error', (err) => { console.log('File Error', err); });

        const encryptionLayer = new DataStrata.AzureEncryptionLayer (
            'YOUR-REST-CREDENTIAL-CLIENT-ID',
            'YOUR-REST-CREDENTIAL-SECRET',
            'us-east-1');

        encryptionLayer.setContainerClient('YOUR-AZURE-STORAGE-CONTAINER-NAME');
        encryptionLayer.setBlockBlobClient(testFileName);

        const resultNoVersioningV1 = await encryptionLayer.uploadFile(testFileName);
        const downloadNoVersioningV1 = await encryptionLayer.downloadToFile(outputFilePath);

        // Confirm file correctly downloaded and decrypted
        console.log('Uploaded file Sha1:  ', await getSha1(testFileName));
        console.log('Downloaded file Sha1:', await getSha1(outputFilePath));

        // Cleanup
        await encryptionLayer.delete();
        fs.unlinkSync(outputFilePath);
    } catch (e) {
        console.log(e);
    }
}

const getSha1 = async (path) => {
    return new Promise ( async (resolve, reject) => {
        try {
            const fd = fs.createReadStream(path);
            var hash = crypto.createHash('sha1');
            hash.setEncoding('hex');

            fd.on('end', function() {
                hash.end();
                const h = hash.read();
                return resolve(h);
            });

            // read all file and pipe it (write it) to the hash object
            fd.pipe(hash);
        } catch (e) {
            console.log (e);
            return reject(e);
        }
    });
}

main();
