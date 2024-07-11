class Form {
    short_name = null
    schema = null

    constructor(short_name, schema) {
        this.short_name = short_name;
        this.schema = schema;

        this.loadSchemaFields();
    }

    loadSchemaFields() {
        const hasItems = this.schema.hasOwnProperty('items') && !this.schema.hasOwnProperty('patternProperties');
        const hasPatternProperties = this.schema.hasOwnProperty('patternProperties') && !this.schema.hasOwnProperty('items');

        if (hasItems) {
            let items_ref = this.schema.items['$ref'].split('/');
            let item_definition_key = items_ref[2];
            let items_spec = this.schema.definitions[item_definition_key]['properties']

            for (const property in items_spec) {
                const properties_data = items_spec[property] || {};
                const new_field = this.getSchemaField(property, properties_data, {});

                if (new_field) this.addFormField(new_field, $(`#form_${this.short_name}`), /* multiple=*/true);
            }
        }
        else if (hasPatternProperties) {
            let patternPropKey = Object.keys(this.schema.patternProperties);
            let props_spec = this.schema.patternProperties[patternPropKey]['anyOf'][0]['properties'];

            for (const property in props_spec) {
                const properties_data = props_spec[property] || {};
                const definitions_data = this.schema.definitions || {};
                const new_field = this.getSchemaField(property, properties_data, definitions_data);

                if (new_field) this.addFormField(new_field, $(`#form_${this.short_name}`), /* multiple=*/true);
            }
        }
        else {
            for (const property in this.schema.properties) {
                const properties_data = this.schema.properties[property] || {};
                const definitions_data = this.schema.definitions || {};
                const new_field = this.getSchemaField(property, properties_data, definitions_data);

                if (new_field) this.addFormField(new_field, $(`#form_${this.short_name}`));
            }
        }
    }

    getSchemaField(property, properties_data, definitions_data) {
        // skip any hidden or "comment" fields
        if (property.substring(1) == '_' || property.includes("comment") || property.includes("$schema")) return;
            
        // skip any deprecated fields
        if (properties_data.hasOwnProperty('deprecated') && properties_data['deprecated']) return;

        const field_default = properties_data.hasOwnProperty('default') ? properties_data['default'] : null;
        let field_name = property;
        let field_type = 'text';
        let subitems = [];
        
        // if the value is an array of strings and not an array of "items", 
        //   or the value is an array of items but the items aren't object definitions,
        //     then we'll expect the user to enter comma-separated in a text box
        if (properties_data['type'] == 'array' && 
            (!properties_data.hasOwnProperty('items') || Object.keys(definitions_data).length == 0)
        ) {
            properties_data['type'] = 'text';
        }

        switch (properties_data['type']) {
            case 'array':
                field_type = 'subform';
                let items_ref = properties_data['items']['$ref'].split('/');
                let item_definition_key = items_ref[2];
                let items_spec = definitions_data[item_definition_key]['properties']

                for (const subproperty in items_spec) {
                    const subitem = this.getSchemaField(subproperty, items_spec[subproperty], {});
                    
                    if (subitem) subitems.push(subitem);
                }

                break;

            case 'boolean':
                field_type = 'checkbox';

                break;
        }

        const custom_field_type = this._checkForCustomFieldType(property);
        if (custom_field_type) field_type = custom_field_type;

        const custom_field_label = this._checkForCustomFieldLabel(property);
        if (custom_field_label) property = custom_field_label;
        
        const custom_field_name = this._checkForCustomFieldName(property);
        if (custom_field_name) field_name = custom_field_name;

        return {
            'name': property,
            'field_name': field_name,
            'description': properties_data['description'],
            'type': field_type,
            'schema_type': properties_data['type'], // in case this is ever helpful to have
            'default': field_default,
            subitems
        };
    }

    addFormField(field_details, dom_form, multiple) {
        if (!field_details['name']) return;
        if (!multiple) multiple = false;

        const display_name = field_details['name'].replace(/_/g, ' ');
        const new_field_label = $(`<label for="${field_details['name']}">${display_name}</label>`);
        let new_field = $('<input type="text" />');

        if (field_details['type'] == 'subform') {
            let new_subform = $('<div class="subform"></div>');
            let new_subitem = $('<div class="subitem"></div>');
            let clear = $('<div class="clear" />');
            
            dom_form.append(clear.clone());
            dom_form.append(`<h4>${display_name}</h4>`);
            dom_form.append(new_subform);
            new_subform.append(new_subitem);
            
            for (const subitem of field_details['subitems']) {
                this.addFormField(subitem, new_subitem, /* multiple= */true);
            }

            new_subitem.append(clear.clone());
            new_subform.append(clear.clone());
        }
        else {
            if (field_details['type'] == 'checkbox') {
                new_field = $('<input type="checkbox" />');
                new_field_label.addClass('inline');
            }

            if (field_details['type'] == 'radio') {
                new_field = $('<input type="radio" />');
                new_field_label.addClass('inline');
            }
            
            if (field_details['type'] != 'subform') {
                new_field.attr('name', field_details['field_name'] + (multiple ? '[]' : ''));
            }
            if (field_details['default']) new_field.val(field_details['default']);
    
            dom_form.append(
                (
                    field_details['type'] == 'radio' || field_details['type'] == 'checkbox'
                    ? 
                        $('<div class="form-field" />')
                            .append(new_field).append(' ')
                            .append(new_field_label)
                    : 
                        $('<div class="form-field" />')
                            .append(new_field_label)
                            .append(new_field)
                )
            );
        }
    }

    getData() {

    }

    _checkForCustomFieldType(property_name) {
        if (this.short_name == 'items') {
            const item_classifications = ['progression', 'progression_skip_balancing', 'useful', 'filler', 'trap'];

            if (item_classifications.indexOf(property_name) >= 0) {
                return 'radio';
            }
        }

        if (this.short_name == 'meta' && property_name == 'docs') return 'textarea';

        return null;
    }

    _checkForCustomFieldLabel(property_name) {
        if (this.short_name == 'items' && property_name == 'value') {
            return 'Item Value';
        }

        return null;
    }

    _checkForCustomFieldName(property_name) {
        if (this.short_name == 'items') {
            const item_classifications = ['progression', 'progression_skip_balancing', 'useful', 'filler', 'trap'];

            if (item_classifications.indexOf(property_name) >= 0) {
                return 'classification';
            }
        }

        return null;
    }
}