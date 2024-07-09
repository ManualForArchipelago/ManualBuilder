class Schema {
    loadCatalogIntoRegistry() {
        return new Promise((resolve, reject) => {
            this.loadCatalog().then((data) => {
                registry.schema_catalog = data.schemas.map((x) => {
                    x.short_name = x.name.replace(/^Manual /, '').replace(/\.json$/, ''); // give each of them a meaningful short name to reuse
                    this.loadSchemaIntoRegistry(x.short_name); // load each of the schemas individually by short name

                    return x;
                });

                // now, sort the schema catalog in order of importance
                const game_schema = registry.schema_catalog.filter((x) => x.name.includes('game')).pop();
                const items_schema = registry.schema_catalog.filter((x) => x.name.includes('item')).pop();
                const locations_schema = registry.schema_catalog.filter((x) => x.name.includes('location')).pop();
                const regions_schema = registry.schema_catalog.filter((x) => x.name.includes('region')).pop();

                registry.schema_catalog = [
                    game_schema,
                    items_schema,
                    locations_schema,
                    regions_schema,

                    ...registry.schema_catalog.filter((x) => x != game_schema && x != items_schema && x != locations_schema && x != regions_schema)
                ];

                // finally, let things load
                resolve();
            });
        });
    }

    loadCatalog() {
        return $.get(registry.paths.file_schema_catalog); // can .then() this to work with raw retrieved data
    }

    loadSchemaIntoRegistry(schema_short_name) {
        this.loadSchema(schema_short_name).then((data) => {
            registry.schemas[schema_short_name] = data;
        });
    }

    loadSchema(schema_short_name) {
        return $.get(`${registry.paths.directory_schema}Manual.${schema_short_name}.schema.json`);
    }
}