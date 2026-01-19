import { reactive } from 'vue';
import { getRequirementsFromJSON } from './helpers.js';

export class Importer {
    vue = null;

    game = {};
    items = [];
    locations = [];
    regions = [];
    categories = {};
    status = '';

    static fromZip(file, app) {
        let self = new Importer;
        self.vue = app;

        if (file == null) {
            self.status = 'Invalid file.';
            return;
        }

        const basename = file.name.replace(/\.apworld/, '');
        const error_text = '<span style="color: red">{text}</span>';

        JSZip.loadAsync(file, { createFolders: true })                                   
            .then(function(zip) {
                
                var selfref = reactive(self);
                const file_game = zip.file(`${basename}/data/game.json`);
                const file_items = zip.file(`${basename}/data/items.json`);
                const file_locations = zip.file(`${basename}/data/locations.json`);
                const file_regions = zip.file(`${basename}/data/regions.json`);
                const file_categories = zip.file(`${basename}/data/categories.json`);

                if (!file_game && !file_items && !file_locations && !file_regions) {
                    selfref.status = error_text.replace(
                        '{text}',
                        'This zip file is not a functional Manual apworld. Please fix or upload the right file.'
                    );

                    return;
                }

                if (file_game) {
                    file_game.async('string')
                        .then((content) => {
                            selfref.game = self.parseJSON(content);
                        })
                        .catch((err) => {
                            selfref.status = error_text.replace(
                                '{text}',
                                'Your game.json file is invalid.'
                            );
                        });
                }
                else {
                    selfref.status = error_text.replace(
                        '{text}',
                        'Your game.json file is invalid.'
                    );

                    return;
                }
                
                if (file_items) {
                    file_items.async('string')
                        .then((content) => {
                            selfref.items = self.parseJSON(content);
                        })
                        .catch((err) => {
                            selfref.status = error_text.replace(
                                '{text}',
                                'Your items.json file is invalid.'
                            );
                        });
                }
                else {
                    selfref.status = error_text.replace(
                        '{text}',
                        'Your items.json file is invalid.'
                    );

                    return;
                }

                if (file_locations) {
                    file_locations.async('string')
                        .then((content) => {
                            selfref.locations = self.parseJSON(content);
                        })
                        .catch((err) => {
                            selfref.status = error_text.replace(
                                '{text}',
                                'Your locations.json file is invalid.'
                            );
                        });
                }
                else {
                    selfref.status = error_text.replace(
                        '{text}',
                        'Your locations.json file is invalid.'
                    );

                    return;
                }

                // no else needed for regions because the file is optional
                if (file_regions) {
                    file_regions.async('string')
                        .then((content) => {
                            selfref.regions = self.parseJSON(content);
                        })
                        .catch((err) => {
                            console.log('Regions file not provided. Skipping');
                        });
                }          

                if (file_categories) {
                    file_categories.async('string')
                        .then((content) => {
                            selfref.categories = self.parseJSON(content);
                        })
                        .catch((err) => {
                            console.log('Categories file not provided. Skipping');
                        });
                }
            }, function (e) {
                var selfref = reactive(self);
                selfref.status = `${file.name} failed because: ${e.message}`;
            });
        
        self.status = `<strong>Ready for Import!</strong> <span class="text-success">${basename.replace(/^manual_/, '')}</span>`;

        return self;
    }

    fillAll() {
        if (!this.game && this.items.length == 0 && this.locations.length == 0 && this.regions.length == 0) {
            this.status = 'Nothing to import.';

            return;
        }

        this.fillGame();
        this.fillItems();
        this.fillLocations();
        this.fillRegions();
        this.fillCategories();

        this.status = `<strong>Loaded!</strong>`;
    }

    fillGame() {
        this.vue.game = this.game.game;

        if ('creator' in this.game) {
            this.vue.creator = this.game.creator;
        }
        else {
            this.vue.creator = this.game.player;
        }
        
        this.vue.filler = this.game.filler_item_name;
        this.vue.starting_items = this.game.starting_items || [];
    }

    fillItems() {
        this.vue.items = [];

        let possible_classifications = [
            'progression',
            'progression_skip_balancing',
            'useful',
            'filler',
            'trap',
        ];

        let id = 1;

        for (let item of this.items) {
            for (let classification of possible_classifications) {
                if (item[classification] === true) {
                    item.classification = classification;

                    break;
                }
            }

            if (!item.classification) {
                item.classification = 'useful';
            }

            item.categories = item.category?.join(', ') || '';

            if (!item.count) {
                item.count = 1;
            }

            item.id = id;

            this.vue.items.push(item);
            id++;
        }

        if (this.vue.items.length == 0) {
            this.vue.items.push({'id': 1, 'classification': 'filler', 'count': 1});
        }

        this.vue.updateTotalItemsByCount();
    }

    fillLocations() {
        this.vue.locations = [];

        let id = 1;

        for (let location of this.locations) {
            location.requirements = getRequirementsFromJSON(location.requires);

            location.categories = location.category?.join(', ') || '';

            if (location.place_item) {
                location.placement_type = 'single_item';
                location.placement = location.place_item.join(', ');
            }
            else if (location.place_item_category) {
                location.placement_type = 'category_item';
                location.placement = location.place_item_category.join(', ');
            }
            else {
                location.placement_type = 'none';
                location.placement = '';
            }

            location.id = id;
            location.region_options = [];

            this.vue.locations.push(location);
            id++;
        }

        if (this.vue.locations.length == 0) {
            this.vue.locations.push({'id': 1});
        }

        this.vue.updateTotalLocationsCount();
    }

    fillRegions() {
        this.vue.regions = [];

        let id = 1;

        // region names are keys in this object, hence the "in"
        for (let region in this.regions) {
            let region_object = this.regions[region];

            region_object.name = region;
            region_object.requirements = getRequirementsFromJSON(region_object.requires);
            region_object.connects_to = region_object.connects_to?.join(', ') || '';

            region_object.id = id;

            this.vue.regions.push(region_object);
            id++;
        }

        if (this.vue.regions.length == 0) {
            this.vue.regions.push({'id': 1});
        }

        this.vue.updateTotalRegionsCount();
    }

    fillCategories() {
        this.vue.categories = this.categories; // we can do better in the future
    }

    parseJSON(json_text) {
        let parsed = JSON.parse(json_text);

        if (parsed.hasOwnProperty('data')) {
            parsed = parsed['data'];
        }

        if (parsed.hasOwnProperty('$schema')) delete parsed['$schema'];

        return parsed;
    }
}
