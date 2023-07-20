export class Yaml {
    vue = null;

    static fromApp(vue) {
        let self = new Yaml();
        self.vue = vue;

        return self;
    }

    toYaml() {
        if (!this.vue || !this.vue.game || !this.vue.creator) return;

        const yamlContents = 
            `Manual_${this.vue.game}_${this.vue.creator}:\n` +
            '    progression_balancing: 50\n' +
            '    accessibility: items\n\n' +
            `game: Manual_${this.vue.game}_${this.vue.creator}\n` +
            `name: ${this.vue.creator}`;

        const file = new Blob([yamlContents], { type: 'text/yaml' });

        saveAs(file, `Manual_${this.vue.game}_${this.vue.creator}.yaml`);
    }
}