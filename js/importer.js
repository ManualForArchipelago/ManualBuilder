import { getRequirementsFromJSON } from './helpers.js';

export class Importer {
    vue = null;

    game = {};
    items = [];
    locations = [];
    regions = [];
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

        JSZip.loadAsync(file)                                   
            .then(function(zip) {
                zip.file(`${basename}/data/game.json`).async('string')
                    .then((content) => {
                        self.game = JSON.parse(content);
                    })
                    .catch((err) => {
                        self.status = error_text.replace(
                            '{text}',
                            'Your game.json file is invalid.'
                        );
                    });

                zip.file(`${basename}/data/items.json`).async('string')
                    .then((content) => {
                        self.items = JSON.parse(content);
                    })
                    .catch((err) => {
                        self.status = error_text.replace(
                            '{text}',
                            'Your items.json file is invalid.'
                        );
                    });

                zip.file(`${basename}/data/locations.json`).async('string')
                    .then((content) => {
                        self.locations = JSON.parse(content);
                    })
                    .catch((err) => {
                        self.status = error_text.replace(
                            '{text}',
                            'Your locations.json file is invalid.'
                        );
                    });

                zip.file(`${basename}/data/regions.json`).async('string')
                    .then((content) => {
                        self.regions = JSON.parse(content);
                    })
                    .catch((err) => {
                        console.log('Regions file not provided. Skipping');
                    });
            }, function (e) {
                self.status = `${file.name} failed because: ${e.message}`;
            });
                
        self.status = `Loaded: ${basename}`;

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
    }

    fillGame() {
        this.vue.game = this.game.game;
        this.vue.creator = this.game.player;
        this.vue.filler = this.game.filler_item_name;
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

            this.vue.items.push(item);
        }

        if (this.vue.items.length == 0) {
            this.vue.items.push({'id': 1, 'classification': 'filler', 'count': 1});
        }
    }

    fillLocations() {
        this.vue.locations = [];

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

            this.vue.locations.push(location);
        }

        if (this.vue.locations.length == 0) {
            this.vue.locations.push({'id': 1});
        }
    }

    fillRegions() {
        this.vue.regions = [];

        // region names are keys in this object, hence the "in"
        for (let region in this.regions) {
            let region_object = this.regions[region];

            region_object.name = region;
            region_object.requirements = getRequirementsFromJSON(region_object.requires);
            region_object.connects_to = region_object.connects_to?.join(', ') || '';

            this.vue.regions.push(region_object);
        }

        if (this.vue.regions.length == 0) {
            this.vue.regions.push({'id': 1});
        }
    }
}
