export function reduceToMaxId(accumulator, item) {
    if (!item.id) return accumulator || 0;

    return accumulator < item.id ? item.id : accumulator;
}

export function getRequirementsFromJSON(json_object) {
    if (typeof(json_object) == 'string') {
        return translateRequirementsFromBooleans(json_object);
    }

    if (typeof(json_object) == 'array' || typeof(json_object) == 'object') {
        return translateRequirementsFromArray(json_object);
    }
}

export function translateRequirementsFromArray(json_object) {
    let translated = [];
    let count = 0;

    for (let row of json_object) {
        if (!translated[count]) translated.push([]);

        if (typeof(row) == 'string') {
            translated[count].push(`|${row}|`);
        }
        else if (typeof(row) == 'array' || typeof(row) == 'object') {
            if (translated[count]) {
                count++; // move the OR condition into its own block
            }
                                    
            if (row.hasOwnProperty('or')) {
                translated[count] = row.or.map(
                    (r) => `|${r}|`
                ).join(', ');
            }
            else {
                translated[count] = row.map(
                    (r) => `|${r}|`
                ).join(', ');
            }

            count++; // then increment the count to start with a fresh block
        }
    }

    // if it's just a single line, no need for parenthesis
    if (translated.length == 1) {
        return translated[0].join(' AND ');
    }

    for (let t in translated) {
        if (!translated[t]) continue;

        translated[t] = `( ${translated[t].join(' AND ')} )`;
    }

    return translated.join(' OR ');
}

export function translateRequirementsFromBooleans(boolean_string) {
    return boolean_string
        .replace(/\(/g, '( ')
        .replace(/\)/g, ' )')
        .replace(/\bor\b/ig, 'OR')
        .replace(/\band\b/ig, 'AND');
}

export function getItemsListedInRequirements(requirements) {
    if (!requirements) return [];

    const matches = requirements.matchAll(/\|([^|]+)\|/g);
    let items_list = [];

    for (let match of matches) {
        items_list.push(match[1].replace(/\:\d+$/, '')); // take the count off the end of the item name
    }

    return items_list;
}

export async function copyJsonCollection(collection) {
    try {
        await navigator.clipboard.writeText(JSON.stringify(collection));
    }
    catch (err) {
        return false;
    }

    return true;
}

export function encodeJsonWithSpacing(js_object) {
    let json_content = JSON.stringify(js_object)
                        .replace(/\{/g, '\n\t{')
                        .replace(/\}\,/g, '\n\t},')
                        .replace(/\}\]/, '\n\t}\n]')
                        .replace(/\:/g, ': ');
    
    let manual_keywords = [
        /* multiple */
        'name', 'category', 'requires',
        
        /* items */
        'progression', 'progression_skip_balancing', 'useful', 'filler', 'trap', 'count',
    
        /* locations */
        'region', 'place_item', 'place_item_category', 'victory',

        /* regions */
        'connects_to', 'starting'
    ];

    for (let keyword of manual_keywords) {
        json_content = json_content.replaceAll(`"${keyword}"`, `\n\t\t"${keyword}"`);
    }

    return json_content;
}

export function fixRegionsSpacing(json_content) {
    return json_content
            .replace(/\{\"/g, '{\n\t\"')
            .replace(/\}\,\"/g, '},\n\t"')
            .replace(/\}\}/g, '\n}\n}').trim();
}
