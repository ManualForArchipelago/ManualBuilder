import { createApp, computed, reactive } from 'vue';
import { Importer } from './importer.js';
import { Exporter } from './exporter.js';
import { Template } from './template.js';
import { Yaml } from './yaml.js';
import { reduceToMaxId, getItemsListedInRequirements } from './helpers.js';

const app = createApp({
    data: function () {
        return {
            loaded: false,
            imported: null,

            // game.json
            game: '',
            creator: '',
            filler: 'Filler',
            starting_items: [],

            items: [{'id': 1, 'classification': 'filler', 'count': 1}], // items.json
            locations: [{'id': 1}], // locations.json
            regions: [{'id': 1}], // regions.json

            getItemNames: computed(() => {
                if (!this.loaded) return [];

                return this.items.map((i) => i.name || '');
            }),
            getRequiredItemNames: computed(() => {
                if (!this.loaded) return [];

                return this.items.map((i) => {
                    if (['progression', 'progression_skip_balancing'].includes(i.classification)) {
                        return i.name || '';
                    }

                    return null;
                });
            }),
            getLocationNames: computed(() => {
                if (!this.loaded) return [];

                return this.locations.map((i) => i.name || '');
            }),
            getRegionNames: computed(() => {
                if (!this.loaded) return [];

                return this.regions.map((i) => i.name || '');
            }),

            addItem: () => { 
                this.items.push({
                    // get the max id in the array, then increment by 1
                    'id': this.items.reduce(reduceToMaxId) + 1, 
                    'classification': 'filler', 
                    'count': 1
                }); 
            },
            addLocation: () => { 
                this.locations.push({
                    // get the max id in the array, then increment by 1
                    'id': this.locations.reduce(reduceToMaxId) + 1
                }); 
            },
            addRegion: () => { 
                this.regions.push({
                    // get the max id in the array, then increment by 1
                    'id': this.regions.reduce(reduceToMaxId) + 1
                }); 
            },

            removeItem: (index) => { this.items.splice(index, 1); },
            removeLocation: (index) => { this.locations.splice(index, 1); },
            removeRegion: (index) => { this.regions.splice(index, 1); },

            isItemValid: (item) => {
                if (item.count < 1) {
                    item.validation_error = 'You must have at least 1 of every item.';

                    return false;
                }

                item.validation_error = '';
                return true;
            },

            isLocationValid: (location) => {
                if (location.region && !this.getRegionNames.includes(location.region)) {
                    location.validation_error = `The region "${location.region}" is misspelled or does not exist.`;

                    return false;
                }

                let required_items = getItemsListedInRequirements(location.requirements);

                for (let required_item of required_items) {
                    if (!this.getItemNames.includes(required_item)) {
                        location.validation_error = `Required item "${required_item}" is misspelled or does not exist.`;

                        return false;
                    }

                    if (!this.getRequiredItemNames.includes(required_item)) {
                        location.validation_error = `Required item "${required_item}" is not marked as progression.`;

                        return false;
                    }
                }

                location.validation_error = '';
                return true;
            },

            isRegionValid: (region) => {
                let required_items = getItemsListedInRequirements(region.requirements);

                for (let required_item of required_items) {
                    if (!this.getItemNames.includes(required_item)) {
                        region.validation_error = `Required item "${required_item}" is misspelled or does not exist.`;

                        return false;
                    }

                    if (!this.getRequiredItemNames.includes(required_item)) {
                        region.validation_error = `Required item "${required_item}" is not marked as progression.`;

                        return false;
                    }
                }

                if (region.hasOwnProperty('connects_to') && region.connects_to != null) {
                    for (let connected of region.connects_to?.split(/,\s*/)) {
                        if (!this.getRegionNames.includes(connected)) {
                            region.validation_error = `Connecting region "${connected}" is misspelled or does not exist.`;

                            return false;
                        }
                    }
                }

                region.validation_error = '';
                return true;
            },

            getImporter: (event) => {
                this.imported = reactive(Importer.fromZip(event.target.files[0] || null, this));

                event.target.value = ''; // unset the file input
            },
            getExporter: () => {
                return Exporter.fromApp(this);
            },
            getYaml: () => {
                return Yaml.fromApp(this);
            },

            Importer,
            Exporter,
            Yaml,

            apworld_template: Template.loadForLater()
        };
    },

    mounted: function () {
        this.loaded = true;
    }
}).mount('#app');