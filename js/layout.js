class Layout {
    load() {
        this.loadForms();
        this.loadPrimaryNavigation();
    }

    loadPrimaryNavigation() {
        const nav = $(registry.selectors.primary_nav);
        const nav_link_template = $(registry.selectors.nav_link_template).clone().removeClass('template');
        
        nav.empty();

        for (const schema of registry.schema_catalog) {
            const nav_link_title = schema.short_name;
            const new_nav_link = nav_link_template.clone();
            
            new_nav_link.appendTo(nav).find('a').html(nav_link_title).click(() => {
                this.selectNavigationItem(schema.short_name);
            });

            if (schema.has_items === false) {
                new_nav_link.find('span.badge').remove();
            }
        }

        this.selectNavigationItem('game');
    }

    loadForms() {
        const container = $(registry.selectors.container);
        const form_template = $(registry.selectors.form_template).clone().removeClass('template');
        
        container.empty();

        for (const schema of registry.schema_catalog) {
            const form_title = `form_${schema.short_name}`;
            const form_class = `form-${schema.short_name}`;
            const new_form_markup = form_template.clone();
            
            new_form_markup.appendTo(container).addClass(form_class).find('form').attr('id', form_title);

            // constructor loads form fields
            (new Form(schema.short_name, registry.schemas[schema.short_name]));
        }
    }

    selectNavigationItem(short_name) {
        $(registry.selectors.nav_link_anchor).removeClass('active').each(function() {
            if ($(this).html() == short_name) {
                $(this).addClass('active');
                return;
            }
        });

        $(registry.selectors.forms).removeClass('active').each(function () {
            if ($(this).find('form').attr('id') == `form_${short_name}`) {
                $(this).addClass('active');
                return;
            }
        });
    }
}