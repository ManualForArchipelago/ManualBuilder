class Registry extends Singleton {
    selectors = {
        primary_nav: "ul#primary_nav",
        container: "#container",

        nav_link: "ul#primary_nav li",
        nav_link_anchor: "ul#primary_nav li a",
        nav_link_template: "ul#primary_nav li.template",

        forms: "#container div.form",
        form_template: "#container div.form.template",
        form_template_form: "#container div.form.template form"
    }

    schema_catalog = []
    schemas = {}

    paths = {
        directory_schema: "schemas/",
        file_schema_catalog: "schemas/Manual.schema.catalog.json"
    }
}