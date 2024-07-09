class Registry extends Singleton {
    selectors = {
        primary_nav: "ul#primary_nav",
        nav_link: "ul#primary_nav li",
        nav_link_anchor: "ul#primary_nav li a",
        nav_link_template: "ul#primary_nav li.template"
    }

    schema_catalog = []
    schemas = {}

    paths = {
        directory_schema: "schemas/",
        file_schema_catalog: "schemas/Manual.schema.catalog.json"
    }
}