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

        if (Array.isArray(translated[t])) {
            translated[t] = `( ${translated[t].join(' AND ')} )`;
        }
        else {
            translated[t] = `( ${translated[t]} )`;
        }
    }

    return translated.join(' OR ');
}

export function translateRequirementsFromBooleans(boolean_string) {
    return boolean_string;
        // .replace(/\(\s*/g, '( ')
        // .replace(/\s*\)/g, ' )')
        // .replace(/\bor\b/ig, 'OR')
        // .replace(/\band\b/ig, 'AND');
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
    let json_content = JSON.stringify(js_object, null, 2)
                        .replace(/http\:\s/g, 'http:').replace(/https\:\s/g, 'https:')
                        .replace(/\:\s*ALL/, ":ALL").replace(/\:\s*HALF/, ":HALF");

    return json_content;
}
