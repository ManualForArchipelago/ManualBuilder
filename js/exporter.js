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

        // if they don't have at least 5 items, there's nothing to do yet
        if (!this.vue || this.vue.items.length < 5) {
            return;
        }

        this.game = Exporter.prepGame({
            'game': this.vue.game,
            'player': this.vue.creator,
            'filler_item_name': this.vue.filler
        });

        this.items = Exporter.prepItems(this.vue.items);
        this.locations = Exporter.prepLocations(this.vue.locations);
        this.regions = Exporter.prepRegions(this.vue.regions);

        let template = self.vue.apworld_template;
        let folder_name = `manual_${self.game.game.toLowerCase()}_${self.game.player.toLowerCase()}`;

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

        for (let item of before_items) {
            let classification = item['classification'];

            item['category'] = item['categories']?.split(',').map((r) => r.trim()) || [];
                        
            for (let delete_key of ['categories', 'classification', 'validation_error', 'progression', 'progression_skip_balancing', 'useful', 'filler', 'trap']) {
                delete item[delete_key];
            }

            item[classification] = true;

            after_items.push(item);
        }

        return after_items;
    }

    static prepLocations(before_locations) {
        let after_locations = [];

        for (let location of before_locations) {
            location['category'] = location['categories']?.split(',').map((r) => r.trim()) || [];
            location['requires'] = location['requirements'];

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

            for (let delete_key of ['categories', 'validation_error', 'requirements', 'placement', 'placement_type']) {
                delete location[delete_key];
            }

            after_locations.push(location);
        }

        return after_locations;
    }

    static prepRegions(before_regions) {
        let after_regions = {};

        for (let region of before_regions) {
            let region_name = region['name'];

            region['connects_to'] = region['connects_to']?.split(',').map((r) => r.trim()) || [];
            region['requires'] = region['requirements'];

            if (region['requires'] == '') {
                region['requires'] = [];
            }

            for (let delete_key of ['validation_error', 'requirements', 'name']) {
                delete region[delete_key];
            }

            after_regions[region_name] = region;
        }

        return after_regions;
    }
}