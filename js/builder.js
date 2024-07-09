class Builder extends Singleton {
    layout = null
    schema = null

    constructor(layout, schema) {
        super();

        this.layout = layout;
        this.schema = schema;
    }

    init() {
        this.schema.loadCatalogIntoRegistry().then(() => {
            this.layout.load();
        });
    }
}