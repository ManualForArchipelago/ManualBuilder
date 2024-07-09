class Layout {
    load() {
        this.loadPrimaryNavigation();
    }

    loadPrimaryNavigation() {
        const nav = $(registry.selectors.primary_nav);
        const nav_link_template = $(registry.selectors.nav_link_template).clone().removeClass('template');
        
        nav.empty();

        for (const schema of registry.schema_catalog) {
            const nav_link_title = schema.short_name;

            nav_link_template.clone().appendTo(nav).find('a').html(nav_link_title).click(() => {
                this.selectNavigationItem(schema.short_name);
            });
        }

        this.selectNavigationItem('game');
    }

    selectNavigationItem(short_name) {
        $(registry.selectors.nav_link_anchor).removeClass('active').each(function() {
            if ($(this).html() == short_name) {
                $(this).addClass('active');
                return;
            }
        });
    }
}