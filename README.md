# Client Side Azure Storage Encryption Layer from DataStrata.io: Javascript
Javascript example of client-side encryption on Azure Storage using DataStrata.io Encryption Layers

## Prerequisites

Configure an Encryption Layer at DataStrata.io. [Here are some tips](https://datastrata.io/encryption-layer-overview-and-getting-started/) to get started with configuration.

## Getting Started

### From respository

You can download this example from:

https://github.com/DataStrata-io/encryption-layer-azure-storage-js.git

1. Clone the repository: `git clone https://github.com/DataStrata-io/encryption-layer-azure-storage-js.git`

2. Change into the directory: `cd encryption-layer-azure-storage-js`

3. Install the dependency: `npm install`

4. Replace `YOUR-REST-CREDENTIAL-CLIENT-ID` and `YOUR-REST-CREDENTIAL-SECRET` with the values you configured at [DataStrata.io: Getting Started with Encryption Layers](https://datastrata.io/encryption-layer-overview-and-getting-started/).

5. Replace `YOUR-AZURE-STORAGE-CONTAINER-NAME` with the name of the Container in your Storage Account.

6. Run `node index.js`

### From scratch

1. Create a directory and setup a Node.js project package.json. Quick one:

`npm init -y`

2. Install the npm package @datastrata/azure-blob-encryption-layer.

`npm i @datastrata/azure-blob-encryption-layer`

3. Create an index.js file with the following code:

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


5. Replace `YOUR-REST-CREDENTIAL-CLIENT-ID` and `YOUR-REST-CREDENTIAL-SECRET` with the values you configured at [DataStrata.io: Getting Started with Encryption Layers](https://datastrata.io/encryption-layer-overview-and-getting-started/).

6. Replace `YOUR-AZURE-STORAGE-CONTAINER-NAME` with the name of the Container in your Storage Account.

7. Run the file by typing: `node index.js`. You should see the contents of the uploaded file. If you used the `test-file.txt` in the repository, you will see:

> Welcome to DataStrata.io Encryption Layers, client-side encryption for your data.

