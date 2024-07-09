class Form {
    short_name = null
    schema = null

    constructor(short_name, schema) {
        this.short_name = short_name;
        this.schema = schema;

        this.loadSchemaFields();
    }

    loadSchemaFields() {
        for (const property in this.schema.properties) {
            const property_data = this.schema.properties[property];
            const field_default = property_data.hasOwnProperty('default') ? property_data['default'] : null;
            let field_type = 'text';
            
            switch (property_data['type']) {
                case 'array':
                    field_type = 'subform';
                    break;

                case 'boolean':
                    field_type = 'checkbox';
                    break;
            }

        }
    }

    getData() {

    }
}