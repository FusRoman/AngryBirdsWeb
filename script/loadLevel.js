function readDirectories(dirname){
        const path = require('path');
        const fs = require('fs');

        const directoryPath = path.join(__dirname, dirname);

        fs.readdir(path,function(err, files) {
            
            if(err){
                return console.log(" Impossible de lire le dossier : " + err);
            }

            files.forEach(function (file) {
                console.log(file);
                //if()            
            });
        });
}