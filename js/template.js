export class Template {
    fileContents = {}; // "filename": "file contents"

    static loadForLater() {
        let self = new Template();

        self.getFilesFromTemplate();

        return self;
    }

    getFilesFromTemplate() {
        let self = this;

        fetch('./templates/stable.zip')
            .then(function (response) {
                if (response.status === 200 || response.status === 0) {
                    return Promise.resolve(response.blob());
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            })
            .then(JSZip.loadAsync)
            .then(async function(template) {
                await template.forEach(async function (relativePath, zipEntry) {
                    await template.file(zipEntry.name)?.async('string')
                        .then((content) => {
                            self.fileContents[zipEntry.name] = content;
                        })
                        .catch((err) => {
                            // nothing?
                        });
                });
            });  
    }
}