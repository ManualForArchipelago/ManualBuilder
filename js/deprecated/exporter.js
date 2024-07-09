/*
import { encodeJsonWithSpacing, fixRegionsSpacing } from "./helpers.js";

export class Exporter {
    vue = null;

    game = {};
    items = [];
    locations = [];
    regions = [];
    status = '';

    static fromApp(vue) {
        let self = new Exporter;
        self.vue = vue;

        return self;
    }

    toZip() {
        let self = this;

        const hasGameDetails = this.vue.game && this.vue.creator && this.vue.filler;
        const hasOneNonEmptyItem = this.vue.items.length > 0 && this.vue.items[0].name;

        // if they don't have at least 1 item or their game details, there's nothing to do yet
        if (!this.vue || !hasGameDetails || !hasOneNonEmptyItem) {
            return;
        }

        this.game = Exporter.prepGame({
            "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.game.schema.json",
            'game': this.vue.game.replace(/[^A-Za-z0-9]/g, ''),
            'creator': this.vue.creator.replace(/[^A-Za-z0-9]/g, ''),
            'filler_item_name': this.vue.filler,
            'starting_items': this.vue.starting_items,
        });

        this.items = Exporter.prepItems(this.vue.items);
        this.locations = Exporter.prepLocations(this.vue.locations);
        this.regions = Exporter.prepRegions(this.vue.regions);

        let template = self.vue.apworld_template;
        let gameFormatted = self.game.game.toLowerCase().replace(/[^A-Za-z0-9]/g, '');
        let playerFormatted = self.game.creator.toLowerCase().replace(/[^A-Za-z0-9]/g, '');
        let folder_name = `manual_${gameFormatted}_${playerFormatted}`;

        let zip = new JSZip();
        
        for (let filename in template.fileContents) {
            zip.folder(folder_name).file(filename, template.fileContents[filename]);
        }

        zip.folder(folder_name).file('data/game.json', encodeJsonWithSpacing(this.game));
        zip.folder(folder_name).file('data/items.json', encodeJsonWithSpacing(this.items));
        zip.folder(folder_name).file('data/locations.json', encodeJsonWithSpacing(this.locations));
        zip.folder(folder_name).file('data/regions.json', fixRegionsSpacing(encodeJsonWithSpacing(this.regions)));

        zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, `${folder_name}.apworld`);
            });
    }

    static prepGame(before_game) {
        let after_game = {};

        for (let prop in before_game) {
            after_game[prop] = before_game[prop];
        }

        return after_game;
    }

    static prepItems(before_items) {
        let after_items = [];

        for (let before_item of [...before_items]) {
            let item = Object.assign({}, before_item);
            let classification = item['classification'];

            if (item['categories']) {
                item['category'] = item['categories']?.split(',').map((r) => r.trim()) || [];
            }
            else {
                item['category'] = [];
            }
                        
            for (let delete_key of ['id', 'categories', 'classification', 'validation_error', 'progression', 'progression_skip_balancing', 'useful', 'filler', 'trap']) {
                delete item[delete_key];
            }

            item[classification] = true;

            after_items.push(item);
        }

        return after_items;
    }

    static prepLocations(before_locations) {
        let after_locations = [];

        for (let before_location of [...before_locations]) {
            let location = Object.assign({}, before_location);

            if (location['categories']) {
                location['category'] = location['categories']?.split(',').map((r) => r.trim()) || [];
            }
            else {
                location['category'] = [];
            }
            
            location['requires'] = location['requirements'] || [];

            if (location['requires'] == '') {
                location['requires'] = [];
            }

            if (location['placement_type'] != 'none') {
                switch (location['placement_type']) {
                    case 'single_item':
                        location['place_item'] = location['placement'].split(',').map((r) => r.trim());
                        break;

                    case 'category_item':
                        location['place_item_category'] = location['placement'].split(',').map((r) => r.trim());
                        break;
                }
            }

            for (let delete_key of ['id', 'categories', 'validation_error', 'requirements', 'placement', 'placement_type']) {
                delete location[delete_key];
            }

            after_locations.push(location);
        }

        return after_locations;
    }

    static prepRegions(before_regions) {
        let after_regions = {};

        for (let before_region of [...before_regions]) {
            let region = Object.assign({}, before_region);
            let region_name = region['name'];

            if (region.hasOwnProperty('connects_to') && typeof(region.connects_to) == 'string' && region.connects_to.length > 0) {
                region['connects_to'] = region['connects_to']?.split(',').map((r) => r.trim()) || [];
            }
            else {
                region['connects_to'] = [];
            }
            
            region['requires'] = region['requirements'] || [];

            if (region['requires'] == '') {
                region['requires'] = [];
            }

            for (let delete_key of ['id', 'validation_error', 'requirements', 'name']) {
                delete region[delete_key];
            }

            after_regions[region_name] = region;
        }

        return after_regions;
    }
}
*/